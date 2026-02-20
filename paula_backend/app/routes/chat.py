# app/routes/chat.py

from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime
from typing import Optional
import logging

from app.db.mongo import chats
from app.ai.paula_client import ask_paula
from app.models.chat import new_chat
from app.models.message import MessageIn, MessageOut

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/send", response_model=MessageOut)
async def send_message(
    data: MessageIn,
    user_id: str = Query(..., description="User ID"),
    chat_id: Optional[str] = Query(None, description="Chat ID")
):
    try:
        # -----------------------------
        # CREATE OR LOAD CHAT
        # -----------------------------
        if chat_id:
            try:
                chat_obj_id = ObjectId(chat_id)
                chat = chats.find_one({"_id": chat_obj_id})
                if not chat:
                    raise HTTPException(status_code=404, detail="Chat not found")
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid chat ID format")
        else:
            chat = new_chat(user_id)
            result = chats.insert_one(chat)
            chat_obj_id = result.inserted_id
            chat_id = str(chat_obj_id)
            chat["_id"] = chat_obj_id
            logger.info(f"Created new chat: {chat_id}")

        # -----------------------------
        # SAVE USER MESSAGE
        # -----------------------------
        user_message = {
            "role": "user",
            "content": data.text,
            "time": datetime.utcnow()
        }

        chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": user_message}}
        )

        # Reload updated chat to get latest history
        updated_chat = chats.find_one({"_id": ObjectId(chat_id)})
        history = updated_chat.get("messages", [])

        # -----------------------------
        # GET AI RESPONSE
        # -----------------------------
        try:
            reply = ask_paula(data.text, history)
            if not reply:
                reply = "I'm here to listen. Please tell me more."
        except Exception as e:
            logger.error(f"AI error: {e}")
            reply = "Mi sorry, mi having some trouble thinking right now. Can yuh try again?"

        # -----------------------------
        # SAVE ASSISTANT MESSAGE
        # -----------------------------
        assistant_message = {
            "role": "assistant",
            "content": reply,
            "time": datetime.utcnow()
        }

        chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": assistant_message}}
        )

        return MessageOut(
            response=reply,
            chat_id=chat_id,
            timestamp=datetime.utcnow()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return MessageOut(
            response="Something went wrong. Please try again in a moment.",
            chat_id=chat_id if chat_id else None,
            timestamp=datetime.utcnow()
        )
