from datetime import datetime
from typing import List
from api.db.mongo import memory_collection

# -------------------------
# In-memory session store
# -------------------------
SESSION_MEMORY = {}

def add_to_session_memory(session_id: str, sender: str, message: str):
    if session_id not in SESSION_MEMORY:
        SESSION_MEMORY[session_id] = []

    SESSION_MEMORY[session_id].append({
        "sender": sender,
        "message": message,
        "timestamp": datetime.utcnow()
    })

    # Keep session memory small (last 20 messages)
    SESSION_MEMORY[session_id] = SESSION_MEMORY[session_id][-20:]


def get_session_memory(session_id: str):
    return SESSION_MEMORY.get(session_id, [])


# -------------------------
# Long-term memory (MongoDB)
# -------------------------

def store_long_term_memory(user_id: str, memory: dict):
    """
    Stores a concise, meaningful user memory in MongoDB.

    Example:
    { "summary": "User is experiencing ongoing financial stress." }

    Prevents duplicate memory entries.
    """
    if not user_id or user_id == "anonymous":
        return

    summary = memory.get("summary")
    if not summary:
        return

    # Avoid storing duplicate memories
    existing = memory_collection.find_one({
        "user_id": user_id,
        "memory.summary": summary
    })

    if existing:
        return

    memory_collection.insert_one({
        "user_id": user_id,
        "memory": {
            "summary": summary
        },
        "created_at": datetime.utcnow()
    })


def fetch_long_term_memory(user_id: str, limit: int = 5) -> List[dict]:
    """
    Fetches recent long-term memories for a user
    """
    if not user_id or user_id == "anonymous":
        return []

    cursor = (
        memory_collection
        .find({"user_id": user_id}, {"_id": 0})
        .sort("created_at", -1)
        .limit(limit)
    )

    return list(cursor)
