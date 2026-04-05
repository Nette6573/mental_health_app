from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
import logging
import traceback

from app.db.mongo import chats, users
from app.ai.paula_client import ask_paula
from app.ai.emotion_engine import detect_emotion_ai
from app.models.chat import new_chat
from app.models.message import MessageIn, MessageOut

logger = logging.getLogger(__name__)
router = APIRouter()

# =========================================================
# 🧠 AI CHAT (UNCHANGED CORE LOGIC)
# =========================================================

@router.post("/send", response_model=MessageOut)
async def send_message(data: MessageIn):
    try:
        user_id = data.user_id
        chat_id = data.chat_id

        # ---------- CREATE OR LOAD AI CHAT ----------
        if chat_id:
            chat = chats.find_one({"_id": ObjectId(chat_id)})
        else:
            chat_data = new_chat(user_id)
            chat_data["type"] = "ai"  # ✅ IMPORTANT
            result = chats.insert_one(chat_data)
            chat_id = str(result.inserted_id)
            chat = chats.find_one({"_id": result.inserted_id})

        chat_obj_id = ObjectId(chat_id)

        # ---------- USER MESSAGE ----------
        emotion = detect_emotion_ai(data.text)

        user_message = {
            "sender": "user",
            "text": data.text,
            "created_at": datetime.utcnow(),
            "emotion": emotion
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": user_message}}
        )

        updated_chat = chats.find_one({"_id": chat_obj_id})
        history = updated_chat.get("messages", [])

        # ---------- AI ----------
        try:
            reply = ask_paula(
                user_message=data.text,
                chat_history=history[-10:],
                session_id=chat_id
            )
        except Exception as e:
            logger.error(str(e))
            reply = "Mi here wid yuh 💛"

        ai_message = {
            "sender": "ai",
            "text": reply,
            "created_at": datetime.utcnow()
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": ai_message}}
        )

        return MessageOut(
            response=reply,
            chat_id=chat_id,
            timestamp=datetime.utcnow(),
            emotion_detected=emotion
        )

    except Exception as e:
        logger.error(traceback.format_exc())

        return MessageOut(
            response="Something went wrong 💛",
            chat_id="",
            timestamp=datetime.utcnow(),
            emotion_detected=None
        )


# =========================================================
# 👩‍⚕️ THERAPIST CHAT — NEW SYSTEM
# =========================================================

# -------- SEND MESSAGE --------
@router.post("/therapist/send")
async def send_therapist_message(data: dict):
    try:
        user_id = data["user_id"]
        therapist_id = data["therapist_id"]
        sender = data["sender"]  # "user" or "therapist"
        text = data["text"]

        # ---------- FIND OR CREATE CHAT ----------
        chat = chats.find_one({
            "user_id": user_id,
            "therapist_id": therapist_id,
            "type": "therapist"
        })

        if not chat:
            chat_data = {
                "type": "therapist",
                "user_id": user_id,
                "therapist_id": therapist_id,
                "messages": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            result = chats.insert_one(chat_data)
            chat_id = result.inserted_id
        else:
            chat_id = chat["_id"]

        # ---------- MESSAGE ----------
        message = {
            "sender": sender,
            "text": text,
            "created_at": datetime.utcnow()
        }

        chats.update_one(
            {"_id": chat_id},
            {
                "$push": {"messages": message},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )

        return {"status": "success"}

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Failed to send message")


# -------- GET CHAT --------
@router.post("/therapist/get")
async def get_therapist_chat(data: dict):
    try:
        user_id = data["user_id"]
        therapist_id = data["therapist_id"]

        chat = chats.find_one({
            "user_id": user_id,
            "therapist_id": therapist_id,
            "type": "therapist"
        })

        if not chat:
            return {"messages": []}

        chat["_id"] = str(chat["_id"])
        return chat

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Failed to fetch chat")


# -------- THERAPIST DASHBOARD --------
@router.post("/therapist/list")
async def get_therapist_chats(data: dict):
    try:
        therapist_id = data["therapist_id"]

        chats_list = list(chats.find({
            "therapist_id": therapist_id,
            "type": "therapist"
        }).sort("updated_at", -1))

        for c in chats_list:
            c["_id"] = str(c["_id"])

        return chats_list

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Failed to fetch chats")