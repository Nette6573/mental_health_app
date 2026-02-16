from fastapi import APIRouter
from bson import ObjectId
from datetime import datetime
from app.db.mongo import chats
from app.models.chat import new_chat
from app.ai.hf_client import ask_paula
from app.models.message import MessageIn, MessageOut
from app.services.encryption import encrypt, decrypt

router = APIRouter()

@router.post("/send", response_model=MessageOut)
async def send_message(data: MessageIn, user_id: str, chat_id: str = None):

    if chat_id:
        chat = chats.find_one({"_id": ObjectId(chat_id)})
    else:
        chat = new_chat(user_id)
        chat_id = chats.insert_one(chat).inserted_id
        chat = chats.find_one({"_id": chat_id})

    chats.update_one({"_id": ObjectId(chat_id)}, {"$push": {
        "messages": {
            "role": "user",
            "content": encrypt(data.text),
            "time": datetime.utcnow()
        }
    }})

    reply = ask_paula(data.text)

    chats.update_one({"_id": ObjectId(chat_id)}, {"$push": {
        "messages": {
            "role": "assistant",
            "content": encrypt(reply),
            "time": datetime.utcnow()
        }
    }})

    return MessageOut(response=reply)
