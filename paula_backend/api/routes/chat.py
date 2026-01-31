from fastapi import APIRouter, Request, Query
from datetime import datetime
import uuid
import os
import requests

from api.db.mongo import chats_collection

router = APIRouter()

CHATBASE_API_KEY = os.getenv("CHATBASE_API_KEY")
CHATBASE_BOT_ID = os.getenv("CHATBASE_BOT_ID")
CHATBASE_URL = "https://www.chatbase.co/api/v1/chat"


# -----------------------------
# GET CHAT HISTORY
# -----------------------------
@router.get("/history")
async def get_chat_history(
    user_id: str = Query(...),
    session_id: str = Query(...),
    limit: int = Query(50),
):
    cursor = (
        chats_collection
        .find(
            {"user_id": user_id, "session_id": session_id},
            {
                "_id": 0,
                "id": 1,
                "sender": 1,
                "text": 1,
                "timestamp": 1,
            },
        )
        .sort("timestamp", 1)
        .limit(limit)
    )

    messages = []
    for doc in cursor:
        messages.append({
            "id": doc.get("id") or str(uuid.uuid4()),
            "sender": doc.get("sender"),
            "text": doc.get("text"),
            "timestamp": (
                doc["timestamp"].isoformat()
                if isinstance(doc.get("timestamp"), datetime)
                else doc.get("timestamp")
            ),
        })

    return {"messages": messages}


# -----------------------------
# SEND MESSAGE
# -----------------------------
@router.post("/")
async def chat(request: Request):
    body = await request.json()

    message = (body.get("message") or "").strip()
    user_id = body.get("user_id", "anonymous")
    session_id = body.get("session_id", "default")

    if not message:
        return {
            "message": {
                "id": str(uuid.uuid4()),
                "sender": "paula",
                "text": "I didn’t quite catch that — try again for me?",
                "timestamp": datetime.utcnow().isoformat(),
            }
        }

    # 1️⃣ SAVE USER MESSAGE
    user_message = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_id": session_id,
        "sender": "user",
        "text": message,
        "timestamp": datetime.utcnow(),
    }
    chats_collection.insert_one(user_message)

    # 2️⃣ SEND TO CHATBASE
    try:
        res = requests.post(
            CHATBASE_URL,
            headers={
                "Authorization": f"Bearer {CHATBASE_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "botId": CHATBASE_BOT_ID,
                "messages": [{"role": "user", "content": message}],
                "conversationId": session_id,
            },
            timeout=30,
        )

        data = res.json()
        response_text = (
            data.get("text")
            or data.get("answer")
            or "Mi deh yah wid yuh. Try again."
        )

    except Exception as e:
        print("Chatbase error:", e)
        response_text = "Mi deh yah wid yuh. Something went wrong."

    # 3️⃣ SAVE PAULA MESSAGE
    paula_message = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_id": session_id,
        "sender": "paula",
        "text": response_text,
        "timestamp": datetime.utcnow(),
    }
    chats_collection.insert_one(paula_message)

    # 4️⃣ ALWAYS RETURN SAME SHAPE
    return {
        "message": {
            "id": paula_message["id"],
            "sender": "paula",
            "text": response_text,
            "timestamp": paula_message["timestamp"].isoformat(),
        }
    }


# -----------------------------
# RESET CHAT
# -----------------------------
@router.post("/reset")
async def reset_chat(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    session_id = body.get("session_id")

    if not user_id or not session_id:
        return {"status": "error", "message": "Missing user_id or session_id"}

    chats_collection.delete_many(
        {"user_id": user_id, "session_id": session_id}
    )

    return {"status": "ok"}
