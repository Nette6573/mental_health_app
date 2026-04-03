from fastapi import APIRouter
from datetime import datetime
from app.db.mongo import users

router = APIRouter()

# SAVE MOOD
@router.post("/mood/{user_id}")
def save_mood(user_id: str, mood: dict):
    entry = {
        "mood": mood.get("mood"),
        "note": mood.get("note", ""),
        "date": datetime.utcnow()
    }

    users.update_one(
        {"user_id": user_id},
        {"$push": {"mood_log": entry}},
        upsert=True
    )

    return {"status": "saved"}


# GET MOOD
@router.get("/mood/{user_id}")
def get_mood(user_id: str):
    user = users.find_one({"user_id": user_id}) or {}
    return {"mood_log": user.get("mood_log", [])}