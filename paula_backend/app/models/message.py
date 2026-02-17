# app/models/message.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageIn(BaseModel):
    text: str

class MessageOut(BaseModel):
    response: str
    chat_id: Optional[str] = None
    timestamp: Optional[datetime] = None