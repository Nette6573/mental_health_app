# app/routes/chat.py

from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime
from typing import Optional
import logging

from app.db.mongo import chats
from app.ai.paula_client import ask_paula, detect_emotion_ai, summarize_memory
from app.models.chat import new_chat
from app.models.message import MessageIn, MessageOut

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/send", response_model=MessageOut)
async def send_message(
    data: MessageIn,
    user_id: str = Query(...),
    chat_id: Optional[str] = Query(None)
):

    try:

        # -------------------
        # CREATE OR LOAD CHAT
        # -------------------

        if chat_id:

            try:

                chat_obj_id = ObjectId(chat_id)

                chat = chats.find_one({"_id": chat_obj_id})

                if not chat:
                    raise HTTPException(status_code=404, detail="Chat not found")

            except Exception:
                raise HTTPException(status_code=400, detail="Invalid chat id")

        else:

            chat = new_chat(user_id)

            result = chats.insert_one(chat)

            chat_obj_id = result.inserted_id

            chat_id = str(chat_obj_id)

            chat["_id"] = chat_obj_id

            logger.info(f"Created chat {chat_id}")

        # -------------------
        # SAVE USER MESSAGE
        # -------------------

        user_message = {
            "role": "user",
            "content": data.text,
            "time": datetime.utcnow()
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": user_message}}
        )

        updated_chat = chats.find_one({"_id": chat_obj_id})

        raw_history = updated_chat.get("messages", [])

        history = [
            {
                "role": m.get("role"),
                "content": m.get("content")
            }
            for m in raw_history
        ]

        # -------------------
        # MEMORY SUMMARIZATION
        # -------------------

        summary = None

        if len(history) > 12:

            summary = summarize_memory(history[:-6])

            history = history[-6:]

        # -------------------
        # AI EMOTION DETECTION
        # -------------------

        emotion = detect_emotion_ai(data.text)

        logger.info(f"Detected emotion: {emotion}")

        # -------------------
        # GET AI RESPONSE
        # -------------------

        reply = ask_paula(
            user_message=data.text,
            chat_history=history,
            session_id=chat_id,
            summary=summary
        )

        if not reply:
            reply = "I'm here with you. Tell me more."

        # -------------------
        # SAVE AI MESSAGE
        # -------------------

        assistant_message = {
            "role": "assistant",
            "content": reply,
            "emotion_detected": emotion,
            "time": datetime.utcnow()
        }

        chats.update_one(
            {"_id": chat_obj_id},
            {"$push": {"messages": assistant_message}}
        )

        # -------------------
        # MOOD TRACKING
        # -------------------

        if emotion:

            chats.update_one(
                {"_id": chat_obj_id},
                {
                    "$push": {
                        "mood_log": {
                            "emotion": emotion,
                            "time": datetime.utcnow()
                        }
                    }
                }
            )

        return MessageOut(
            response=reply,
            chat_id=chat_id,
            timestamp=datetime.utcnow()
        )

    except HTTPException:
        raise

    except Exception as e:

        logger.error("Unexpected error", exc_info=True)

        return MessageOut(
            response="Something went wrong. Please try again.",
            chat_id=chat_id,
            timestamp=datetime.utcnow()
        )