# app/routes/chat.py
from fastapi import APIRouter, HTTPException, Query, Request
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
    request: Request,
    data: MessageIn,
    user_id: str = Query(...),
    chat_id: Optional[str] = Query(None)
):
    try:
        logger.info(f"📨 Received message from user {user_id}: {data.text[:50]}...")
        logger.info(f"📝 Chat ID provided: {chat_id}")
        
        # -------------------
        # CREATE OR LOAD CHAT
        # -------------------
        chat_obj_id = None

        if chat_id:
            try:
                chat_obj_id = ObjectId(chat_id)
                chat = chats.find_one({"_id": chat_obj_id})

                if not chat:
                    raise HTTPException(status_code=404, detail="Chat not found")
                logger.info(f"📝 Loaded existing chat: {chat_id}")
                logger.info(f"📊 Existing messages in DB: {len(chat.get('messages', []))}")
            except Exception as e:
                logger.error(f"Invalid chat ID: {chat_id} - {e}")
                raise HTTPException(status_code=400, detail="Invalid chat id")
        else:
            chat = new_chat(user_id)
            result = chats.insert_one(chat)
            chat_obj_id = result.inserted_id
            chat_id = str(chat_obj_id)
            chat["_id"] = chat_obj_id
            logger.info(f"🆕 Created new chat: {chat_id}")

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
        logger.info(f"💾 Saved user message to chat {chat_id}")

        # Get updated chat with complete history
        updated_chat = chats.find_one({"_id": chat_obj_id})
        raw_history = updated_chat.get("messages", [])
        
        logger.info(f"📚 Full conversation history length: {len(raw_history)}")

        # Format ALL history for AI (don't trim yet)
        all_history = [
            {
                "role": m.get("role"),
                "content": m.get("content")
            }
            for m in raw_history
        ]

        # Log the last few messages for debugging
        if len(all_history) > 0:
            last_messages = all_history[-3:] if len(all_history) >= 3 else all_history
            logger.info(f"🔄 Last {len(last_messages)} messages for context:")
            for i, msg in enumerate(last_messages):
                logger.info(f"   {i+1}. {msg['role']}: {msg['content'][:50]}...")

        # -------------------
        # MEMORY SUMMARIZATION
        # -------------------
        # Only summarize if history is VERY long (more than 20 messages)
        # This keeps more context available
        summary = None
        history_for_ai = all_history  # Start with all history
        
        if len(all_history) > 20:  # Increased from 12 to 20
            # Keep last 15 messages for full context, summarize older ones
            summary = summarize_memory(all_history[:-15])
            history_for_ai = all_history[-15:]  # Keep last 15 for context
            logger.info(f"📝 Using memory summary: {summary[:100] if summary else 'None'}...")
            logger.info(f"📝 Using last {len(history_for_ai)} messages for context")
        else:
            logger.info(f"📝 Using full conversation history ({len(history_for_ai)} messages)")

        # -------------------
        # AI EMOTION DETECTION
        # -------------------
        emotion = detect_emotion_ai(data.text)
        logger.info(f"😊 Detected emotion: {emotion}")

        # -------------------
        # GET AI RESPONSE
        # -------------------
        logger.info(f"🤖 Calling AI with history length: {len(history_for_ai)}")
        
        reply = ask_paula(
            user_message=data.text,
            chat_history=history_for_ai,  # Pass the full/untrimmed history
            session_id=chat_id,
            summary=summary
        )

        if not reply:
            reply = "Mi deh yah fi yuh. Tell me more? 💛"
            logger.warning("AI returned empty response, using fallback")

        logger.info(f"💬 AI Response: {reply[:100]}...")

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
        logger.info(f"💾 Saved AI message to chat {chat_id}")

        # -------------------
        # MOOD TRACKING
        # -------------------
        if emotion and emotion != "neutral":
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
            logger.info(f"📊 Logged mood: {emotion}")

        logger.info(f"✅ Response sent for chat {chat_id}")
        
        return MessageOut(
            response=reply,
            chat_id=chat_id,
            timestamp=datetime.utcnow()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error: {str(e)}", exc_info=True)
        return MessageOut(
            response="Mi sorry, something went wrong. Try again in a likkle bit? 💛",
            chat_id=chat_id if chat_id else "",
            timestamp=datetime.utcnow()
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "message": "Paula ready fi chat! 💛",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/chat/{chat_id}")
async def get_chat_history(chat_id: str):
    """Get full chat history by ID for debugging"""
    try:
        chat_obj_id = ObjectId(chat_id)
        chat = chats.find_one({"_id": chat_obj_id})
        
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        # Convert ObjectId to string for JSON
        chat["_id"] = str(chat["_id"])
        
        # Add message count for debugging
        messages = chat.get("messages", [])
        chat["message_count"] = len(messages)
        
        return chat
    except Exception as e:
        logger.error(f"Error fetching chat {chat_id}: {e}")
        raise HTTPException(status_code=400, detail="Invalid chat ID")


@router.get("/debug")
async def debug_info():
    """Debug endpoint to check configuration"""
    from app.config import HF_TOKEN, MONGO_URI, SECRET_KEY
    from app.ai.paula_client import _paula_client
    
    # Test MongoDB connection
    mongo_status = "unknown"
    try:
        from app.db.mongo import client
        client.admin.command('ping')
        mongo_status = "connected"
    except Exception as e:
        mongo_status = f"error: {str(e)}"
    
    # Test if Paula client is initialized
    paula_status = "initialized" if _paula_client else "not initialized"
    
    return {
        "status": "debug",
        "environment": {
            "hf_token": "set" if HF_TOKEN else "missing",
            "hf_token_length": len(HF_TOKEN) if HF_TOKEN else 0,
            "hf_token_preview": f"{HF_TOKEN[:5]}...{HF_TOKEN[-5:]}" if HF_TOKEN else None,
            "mongo_uri": "set" if MONGO_URI else "missing",
            "secret_key": "set" if SECRET_KEY else "using temporary",
        },
        "connections": {
            "mongodb": mongo_status,
            "paula_client": paula_status,
        },
        "timestamp": datetime.utcnow().isoformat()
    }