# app/models/chat.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

def new_chat(user_id: str):
    return {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "messages": [],
        "title": "New Chat"
    }