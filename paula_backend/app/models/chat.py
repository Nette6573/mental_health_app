# app/models/chat.py
from datetime import datetime
from typing import List, Dict, Optional

def new_chat(user_id: str) -> Dict:
    """Create a new chat document"""
    return {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "messages": [],
        "mood_log": [],
        "summary": None
    }

def chat_to_dict(chat) -> Dict:
    """Convert chat document to dictionary"""
    chat_dict = dict(chat)
    chat_dict["_id"] = str(chat_dict["_id"])
    return chat_dict