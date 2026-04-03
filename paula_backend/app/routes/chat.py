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
        "habits": []
    }

    if "stress" in msg or "overwhelmed" in msg:
        memory["emotional_state"] = "stressed"

    if "exam" in msg:
        if "exam pressure" not in memory["main_issues"]:
            memory["main_issues"].append("exam pressure")

    if "break" in msg and "no" in msg:
        if "not taking breaks" not in memory["habits"]:
            memory["habits"].append("not taking breaks")

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
        "habits": list(set(
            existing.get("habits", []) + new_memory.get("habits", [])
        )),
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
            if not chat:
                raise HTTPException(status_code=404, detail="Chat not found")

        else:
            chat = new_chat(user_id)
            result = chats.insert_one(chat)
            chat_obj_id = result.inserted_id
            chat_id = str(chat_obj_id)
            chat["_id"] = chat_obj_id

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

        # ---------------- LOAD UPDATED CHAT ---------------- #
        updated_chat = chats.find_one({"_id": chat_obj_id})

        if not updated_chat:
            raise Exception("Chat not found after update")

        raw_history = updated_chat.get("messages", [])
        chat_memory = updated_chat.get("memory", {})

        # ---------------- UPDATE MEMORY ---------------- #
        chat_memory = extract_memory(data.text, chat_memory)

        chats.update_one(
            {"_id": chat_obj_id},
            {"$set": {"memory": chat_memory}}
        )

        update_user_memory(user_id, chat_memory)

        # ---------------- LOAD USER MEMORY ---------------- #
        user = users.find_one({"user_id": user_id}) or {}
        user_memory = user.get("memory", {})

        # ---------------- SAFE HISTORY FORMAT ---------------- #
        all_history = [
            {
                "role": m.get("role", "user"),
                "content": m.get("content", "")
            }
            for m in raw_history
        ]

        # ---------------- STAGE ---------------- #
        count = len(all_history)
        stage = "early" if count < 3 else "middle" if count < 6 else "deep"

        # ---------------- AI CALL ---------------- #
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

        # ---------------- SAVE AI MESSAGE ---------------- #
        assistant_message = {
            "role": "assistant",
            "content": reply,
            "time": datetime.utcnow()
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": assistant_message}}
        )

        # ---------------- RESPONSE ---------------- #
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