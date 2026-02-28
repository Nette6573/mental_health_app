# app/routes/chat.py

from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime
from typing import Optional
import logging
import uuid

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
        # GET AI RESPONSE WITH SESSION ID
        # -----------------------------
        try:
            # Use chat_id as the session_id for context management
            reply = ask_paula(data.text, history, session_id=chat_id)
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


@router.get("/history/{chat_id}")
async def get_chat_history(chat_id: str):
    """Get full chat history for a specific chat"""
    try:
        chat = chats.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        # Convert ObjectId to string for JSON serialization
        chat["_id"] = str(chat["_id"])
        return chat
    except Exception as e:
        logger.error(f"Error fetching chat history: {e}")
        raise HTTPException(status_code=400, detail="Invalid chat ID")


@router.delete("/{chat_id}")
async def delete_chat(chat_id: str):
    """Delete a chat session"""
    try:
        result = chats.delete_one({"_id": ObjectId(chat_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return {"message": "Chat deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting chat: {e}")
        raise HTTPException(status_code=400, detail="Invalid chat ID")


@router.get("/user/{user_id}")
async def get_user_chats(user_id: str):
    """Get all chats for a specific user"""
    try:
        user_chats = list(chats.find({"user_id": user_id}).sort("created_at", -1))
        
        # Convert ObjectId to string for each chat
        for chat in user_chats:
            chat["_id"] = str(chat["_id"])
        
        return {"chats": user_chats}
    except Exception as e:
        logger.error(f"Error fetching user chats: {e}")
        raise HTTPException(status_code=400, detail="Error fetching chats")