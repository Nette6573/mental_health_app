from fastapi import APIRouter, Request, Query
from datetime import datetime
import uuid

from api.services.inference import generate_response
from api.db.mongo import chats_collection

router = APIRouter()

# -----------------------------
# GET CHAT HISTORY
# FINAL URL: /chat/history
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
            # 🔐 GUARANTEE UNIQUE, NON-NULL ID
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
# FINAL URL: /chat/
# -----------------------------
@router.post("/")
async def chat(request: Request):
    body = await request.json()

    message = (body.get("message") or "").strip()
    user_id = body.get("user_id", "anonymous")
    session_id = body.get("session_id", "default")

    if not message:
        return {"response": "I didn’t quite catch that — try again for me?"}

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

    # 2️⃣ FETCH RECENT HISTORY (USER MESSAGES ONLY)
    history_cursor = (
        chats_collection
        .find(
            {
                "user_id": user_id,
                "session_id": session_id,
                "sender": "user",  # 🔑 CRITICAL: prevents Paula echo loops
            },
            {"_id": 0, "sender": 1, "text": 1},
        )
        .sort("timestamp", -1)
        .limit(10)
    )

    conversation_history = list(history_cursor)[::-1]

    # 3️⃣ GENERATE PAULA RESPONSE (SAFE)
    try:
        response_text = generate_response(
            user_message=message,
            conversation_history=conversation_history,
            session_id=session_id,
            user_id=user_id,
        )
    except Exception as e:
        print("Inference error:", e)
        response_text = (
            "I’m here with you. Something went wrong on my side — "
            "can you say that again in a short way?"
        )

    # 4️⃣ SAVE PAULA MESSAGE
    paula_message = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_id": session_id,
        "sender": "paula",
        "text": response_text,
        "timestamp": datetime.utcnow(),
    }

    chats_collection.insert_one(paula_message)

    return {
        "response": response_text,
        "message": {
            "id": paula_message["id"],
            "sender": "paula",
            "text": response_text,
            "timestamp": paula_message["timestamp"].isoformat(),
        },
    }


# -----------------------------
# RESET CHAT (NEW CONVERSATION)
# FINAL URL: /chat/reset
# -----------------------------
@router.post("/reset")
async def reset_chat(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    session_id = body.get("session_id")

    if not user_id or not session_id:
        return {
            "status": "error",
            "message": "Missing user_id or session_id",
        }

    chats_collection.delete_many(
        {"user_id": user_id, "session_id": session_id}
    )

    return {"status": "ok"}
