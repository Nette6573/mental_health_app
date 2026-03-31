from fastapi import APIRouter
from pydantic import BaseModel
from app.db.mongo import db, users
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    uid: str
    email: str
    name: str

@router.post("/create-user")
def create_user(user: UserCreate):
    existing = db.users.find_one({"uid": user.uid})

    if existing:
        return {"message": "User already exists"}

    db.users.insert_one({
        "uid": user.uid,
        "email": user.email,
        "name": user.name,
        "streak": 0,
        "resources_used": 0,
        "resources_history": []
    })

    return {"message": "User created"}

@router.post("/update-streak/{uid}")
def update_streak(uid: str):
    users.update_one(
        {"uid": uid},
        {"$inc": {"streak": 1}}
    )

    return {"message": "Streak updated"}

from datetime import datetime, timedelta, timezone

@router.post("/log-mood/{uid}/{mood}")
def log_mood(uid: str, mood: int):

    from datetime import datetime, timedelta, timezone

    user = users.find_one({"uid": uid})

    if not user:
        return {"error": "User not found"}

    now = datetime.now(timezone.utc)
    today = now.date()
    yesterday = today - timedelta(days=1)

    last_date = None

    # get last mood date safely
    if "moods" in user and len(user["moods"]) > 0:
        last_entry = user["moods"][-1]
        last_date = last_entry["date"].date()

    # ---- STREAK LOGIC ----
    if last_date is None:
        new_streak = 1

    elif last_date == today:
        new_streak = user.get("streak", 0)

    elif last_date == yesterday:
        new_streak = user.get("streak", 0) + 1

    else:
        new_streak = 1

    # ---- UPDATE DB ----
    if last_date == today:
        # update today's mood (no duplicate entry)
        users.update_one(
            {
                "uid": uid,
                "moods.date": {
                    "$gte": now.replace(hour=0, minute=0, second=0, microsecond=0)
                }
            },
            {
                "$set": {
                    "last_mood": mood,
                    "moods.$.value": mood
                }
            }
        )

    else:
        # new day → add entry + update streak
        users.update_one(
            {"uid": uid},
            {
                "$set": {
                    "streak": new_streak,
                    "last_mood": mood
                },
                "$push": {
                    "moods": {
                        "value": mood,
                        "date": now
                    }
                }
            }
        )

    return {"message": "Mood logged", "streak": new_streak}

@router.get("/user/{uid}")
def get_user(uid: str):
    from app.db.mongo import users

    user = users.find_one({"uid": uid})

    if not user:
        return {"error": "User not found"}

    user["_id"] = str(user["_id"])  # fix ObjectId
    return user

from datetime import datetime

@router.post("/use-resource/{uid}")
def use_resource(uid: str):
    now = datetime.utcnow().isoformat()

    users.update_one(
        {"uid": uid},
        {
            "$inc": {"resources_used": 1},
            "$push": {
                "resources_history": {
                    "date": now,
                    "type": "resource"
                }
            }
        }
    )

    return {"message": "Resource tracked"}

class SessionData(BaseModel):
    date: str
    provider: str

@router.post("/set-session/{uid}")
def set_session(uid: str, data: SessionData):
    users.update_one(
        {"uid": uid},
        {
            "$set": {
                "next_session": {
                    "date": data.date,
                    "provider": data.provider
                }
            }
        }
    )

    return {"message": "Session saved"}

@router.get("/activity/{uid}")
def get_activity(uid: str):
    user = users.find_one({"uid": uid})

    activities = []

    # ---- MOODS ----
    for mood in user.get("moods", []):
        activities.append({
            "type": "mood",
            "text": f"You rated your mood {mood.get('value', '?')}/10",
            "date": mood.get("date")
        })

    # ---- RESOURCES ----
    for r in user.get("resources_history", []):
        if isinstance(r, dict):
            date = r.get("date")
        else:
            date = r  # string case

        activities.append({
            "type": "resource",
            "text": "Viewed a resource",
            "date": date
        })

    # ---- SESSION ----
    session = user.get("next_session")
    if session:
        activities.append({
            "type": "session",
            "text": f"Session with {session.get('provider', 'provider')}",
            "date": session.get("date")
        })

    # ---- SAFE SORT (IMPORTANT FIX) ----
    activities = [a for a in activities if a.get("date")]

    activities.sort(key=lambda x: str(x["date"]), reverse=True)

    return activities[:5]