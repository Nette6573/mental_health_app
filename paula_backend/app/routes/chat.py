# app/routes/chat.py
from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime
from app.db.mongo import chats
from app.ai.paula_client import ask_paula
from app.models.chat import new_chat
from app.models.message import MessageIn, MessageOut
import logging
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/send", response_model=MessageOut)
async def send_message(
    data: MessageIn,
    user_id: str = Query(..., description="User ID"),
    chat_id: Optional[str] = Query(None, description="Chat ID")
):
    try:
        chat = None
        chat_obj_id = None
        
        # Handle existing or new chat
        if chat_id:
            try:
                chat_obj_id = ObjectId(chat_id)
                chat = chats.find_one({"_id": chat_obj_id})
                if not chat:
                    raise HTTPException(status_code=404, detail="Chat not found")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid chat ID format: {str(e)}")
        else:
            # Create new chat
            chat = new_chat(user_id)
            result = chats.insert_one(chat)
            chat_obj_id = result.inserted_id
            chat["_id"] = chat_obj_id
            chat_id = str(chat_obj_id)
            logger.info(f"Created new chat with ID: {chat_id}")

        # Add user message
        user_message = {
            "role": "user",
            "content": data.text,
            "time": datetime.utcnow()
        }
        
        chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": user_message}}
        )
        logger.info(f"Added user message to chat {chat_id}")

        # Get AI response with error handling
        try:
            # Make sure chat has messages array
            messages = chat.get("messages", [])
            reply = ask_paula(data.text, messages)
            
            # Ensure we have a valid response
            if not reply:
                reply = "I'm here to listen. Please tell me more."
                
        except Exception as e:
            logger.error(f"Error getting Paula's response: {e}")
            reply = "Mi sorry, mi having some trouble thinking right now. Can yuh try again?"

        # Add assistant message
        assistant_message = {
            "role": "assistant",
            "content": reply,
            "time": datetime.utcnow()
        }
        
        chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": assistant_message}}
        )
        logger.info(f"Added assistant message to chat {chat_id}")

        # IMPORTANT: Always return a valid MessageOut object
        return MessageOut(
            response=reply,
            chat_id=chat_id,
            timestamp=datetime.utcnow()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in send_message: {e}")
        # Return a valid MessageOut even on error
        return MessageOut(
            response="Something went wrong. Please try again in a moment.",
            chat_id=chat_id if chat_id else None,
            timestamp=datetime.utcnow()
        )