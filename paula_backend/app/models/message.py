# app/models/message.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageIn(BaseModel):
    """Incoming message schema"""
    text: str
    user_id: str
    chat_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Mi feeling down today",
                "user_id": "abc123",
                "chat_id": None
            }
        }

class MessageOut(BaseModel):
    """Outgoing message schema"""
    response: str
    chat_id: str
    timestamp: datetime
    emotion_detected: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Mi sorry yuh feeling down. Wah happen?",
                "chat_id": "507f1f77bcf86cd799439011",
                "timestamp": "2024-01-01T12:00:00Z",
                "emotion_detected": "sad"
            }
        }