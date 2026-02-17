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

# Create router instance
router = APIRouter()

@router.post("/send", response_model=MessageOut)
async def send_message(
    data: MessageIn, 
    user_id: str = Query(..., description="User ID"), 
    chat_id: Optional[str] = Query(None, description="Chat ID")
):
    # ... your existing code ...
    pass

# Make sure router is exported
__all__ = ['router']