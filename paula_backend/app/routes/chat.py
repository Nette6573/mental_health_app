from fastapi import APIRouter, HTTPException, Query, Request
from bson import ObjectId
from datetime import datetime
from typing import Optional
import logging
import traceback

from app.db.mongo import chats, users
from app.ai.paula_client import ask_paula, detect_emotion_ai
from app.models.chat import new_chat
from app.models.message import MessageIn, MessageOut

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------- MEMORY HELPERS ---------------- #

def extract_memory(message: str, existing_memory: dict):
    msg = message.lower()

    memory = existing_memory or {
        "emotional_state": None,
        "main_issues": [],
        "stress_level": 0,
        "risk_flags": [],
        "conversation_count": 0,
        "emotion_history": []
    }

    memory["conversation_count"] += 1

    # -------- EMOTIONAL DETECTION --------
    if any(word in msg for word in ["stress", "overwhelmed", "pressure"]):
        memory["emotional_state"] = "stressed"
        memory["stress_level"] += 1

    if any(word in msg for word in ["sad", "down", "tired", "empty"]):
        memory["emotional_state"] = "low"
        memory["stress_level"] += 1

    # -------- ISSUE TRACKING --------
    if "exam" in msg and "exam pressure" not in memory["main_issues"]:
        memory["main_issues"].append("exam pressure")

    if "work" in msg and "work stress" not in memory["main_issues"]:
        memory["main_issues"].append("work stress")

    # -------- RISK DETECTION --------
    if memory["stress_level"] >= 3 and "burnout_risk" not in memory["risk_flags"]:
        memory["risk_flags"].append("burnout_risk")

    if any(word in msg for word in ["hopeless", "pointless"]) and "depression_risk" not in memory["risk_flags"]:
        memory["risk_flags"].append("depression_risk")

    # -------- EMOTION HISTORY FIX --------
    current_emotion = memory.get("emotional_state")

    if current_emotion:
        memory["emotion_history"].append({
            "emotion": current_emotion,
            "time": datetime.utcnow()
        })

    memory["emotion_history"] = memory["emotion_history"][-10:]

    return memory


def update_user_memory(user_id, new_memory):
    user = users.find_one({"user_id": user_id}) or {}
    existing = user.get("memory", {})

    updated = {
        "emotional_patterns": list(set(
            existing.get("emotional_patterns", []) + 
            ([new_memory.get("emotional_state")] if new_memory.get("emotional_state") else [])
        )),
        "main_issues": list(set(
            existing.get("main_issues", []) + new_memory.get("main_issues", [])
        )),
        "habits": existing.get("habits", []),
        "last_seen": datetime.utcnow()
    }

    users.update_one(
        {"user_id": user_id},
        {"$set": {"memory": updated}},
        upsert=True
    )


# ---------------- MAIN ROUTE ---------------- #

@router.post("/send", response_model=MessageOut)
async def send_message(
    request: Request,
    data: MessageIn,
    user_id: str = Query(...),
    chat_id: Optional[str] = Query(None)
):
    try:
        # ---------------- CREATE OR LOAD CHAT ---------------- #
        if chat_id:
            try:
                chat_obj_id = ObjectId(chat_id)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid chat_id")

            chat = chats.find_one({"_id": chat_obj_id})

            # ✅ AUTO FIX
            if not chat:
                chat_data = new_chat(user_id)
                result = chats.insert_one(chat_data)
                chat_obj_id = result.inserted_id
                chat_id = str(chat_obj_id)
                chat = chats.find_one({"_id": chat_obj_id})

        else:
            chat_data = new_chat(user_id)
            result = chats.insert_one(chat_data)
            chat_obj_id = result.inserted_id
            chat_id = str(chat_obj_id)
            chat = chats.find_one({"_id": chat_obj_id})

        # ---------------- USER MESSAGE ---------------- #
        emotion = detect_emotion_ai(data.text)

        user_message = {
            "role": "user",
            "content": data.text,
            "time": datetime.utcnow(),
            "emotion": emotion
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": user_message}}
        )

        updated_chat = chats.find_one({"_id": chat_obj_id})

        raw_history = updated_chat.get("messages", [])
        chat_memory = updated_chat.get("memory", {})

        # ---------------- MEMORY ---------------- #
        chat_memory = extract_memory(data.text, chat_memory)

        chats.update_one(
            {"_id": chat_obj_id},
            {"$set": {"memory": chat_memory}}
        )

        update_user_memory(user_id, chat_memory)

        user = users.find_one({"user_id": user_id}) or {}
        user_memory = user.get("memory", {})

        all_history = [
            {"role": m.get("role", "user"), "content": m.get("content", "")}
            for m in raw_history
        ]

        count = len(all_history)
        stage = "early" if count < 3 else "middle" if count < 6 else "deep"

        # ---------------- AI ---------------- #
        try:
            reply = ask_paula(
                user_message=data.text,
                chat_history=all_history[-10:],
                session_id=chat_id,
                user_memory=user_memory,
                chat_memory=chat_memory,
                stage=stage
            )
        except Exception as ai_error:
            logger.error(f"❌ AI ERROR: {str(ai_error)}")
            logger.error(traceback.format_exc())
            reply = "Mi here wid yuh 💛… talk to me."

        if not reply:
            reply = "Mi deh yah fi yuh 💛"

        assistant_message = {
            "role": "assistant",
            "content": reply,
            "time": datetime.utcnow()
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": assistant_message}}
        )

        return MessageOut(
            response=reply,
            chat_id=chat_id,
            timestamp=datetime.utcnow(),
            emotion_detected=emotion
        )

    except Exception as e:
        logger.error(f"❌ ERROR: {str(e)}")
        logger.error(traceback.format_exc())

        return MessageOut(
            response="Mi sorry, something went wrong 💛",
            chat_id=chat_id if chat_id else "",
            timestamp=datetime.utcnow(),
            emotion_detected=None
        )