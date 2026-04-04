from fastapi import APIRouter
from datetime import datetime
from app.db.mongo import users
from app.ai.insights_engine import generate_insights
from app.ai.proactive_engine import analyze_user_behavior, generate_proactive_message
import uuid

router = APIRouter()

# ---------------- GET USER ---------------- #

@router.get("/user/{user_id}")
def get_user(user_id: str):
    user = users.find_one({"user_id": user_id}) or {}
    user["_id"] = str(user.get("_id", ""))
    return user


# ---------------- GET ASSESSMENTS ---------------- #

@router.get("/user/{user_id}/assessments")
def get_user_assessments(user_id: str):
    user = users.find_one({"user_id": user_id}) or {}

    return {
        "phq9": user.get("assessments", {}).get("phq9", [])
    }


# ---------------- GET PROACTIVE MESSAGES ---------------- #

@router.get("/user/{user_id}/proactive")
def get_proactive_message(user_id: str):

    user = users.find_one({"user_id": user_id}) or {}

    signals = analyze_user_behavior(user)
    message = generate_proactive_message(signals)

    return {
        "signals": signals,
        "message": message
    }


# =====================================================
# 🟣 GOALS SYSTEM
# =====================================================

# ---------------- CREATE GOAL ---------------- #

@router.post("/user/{user_id}/goals")
def create_goal(user_id: str, goal: dict):
    goal["id"] = str(uuid.uuid4())
    goal["current"] = 0
    goal["created_at"] = datetime.utcnow()
    goal["updated_at"] = datetime.utcnow()

    users.update_one(
        {"user_id": user_id},
        {"$push": {"goals": goal}},
        upsert=True
    )

    return {"status": "goal created", "goal": goal}


# ---------------- GET GOALS ---------------- #

@router.get("/user/{user_id}/goals")
def get_goals(user_id: str):
    user = users.find_one({"user_id": user_id}) or {}
    return {"goals": user.get("goals", [])}


# ---------------- UPDATE GOAL ---------------- #

@router.put("/user/{user_id}/goals/{goal_id}")
def update_goal(user_id: str, goal_id: str, data: dict):

    increment = data.get("increment", 1)

    user = users.find_one({"user_id": user_id}) or {}
    goals = user.get("goals", [])

    for goal in goals:
        if goal["id"] == goal_id:
            goal["current"] = min(goal["current"] + increment, goal["target"])
            goal["updated_at"] = datetime.utcnow()

    users.update_one(
        {"user_id": user_id},
        {"$set": {"goals": goals}}
    )

    return {"status": "updated"}


# ---------------- DELETE GOAL ---------------- #

@router.delete("/user/{user_id}/goals/{goal_id}")
def delete_goal(user_id: str, goal_id: str):

    users.update_one(
        {"user_id": user_id},
        {"$pull": {"goals": {"id": goal_id}}}
    )

    return {"status": "deleted"}


# =====================================================
# 🔵 HISTORY SYSTEM (NEW)
# =====================================================

@router.get("/user/{user_id}/history")
def get_user_history(user_id: str):

    user = users.find_one({"user_id": user_id}) or {}

    history = []

    # -------- MOODS --------
    for m in user.get("mood_log", []):
        history.append({
            "type": "mood",
            "text": f"Mood {m.get('mood')}/10",
            "date": m.get("date")
        })

    # -------- GOALS --------
    for g in user.get("goals", []):
        history.append({
            "type": "goal",
            "text": f"Goal created: {g.get('title')}",
            "date": g.get("created_at")
        })

    # -------- SORT --------
    history = [h for h in history if h.get("date") is not None]
    history.sort(key=lambda x: x["date"], reverse=True)

    return {"history": history}


# =====================================================
# 🟢 AI INSIGHTS SYSTEM (NEW)
# =====================================================

@router.get("/user/{user_id}/insights")
def get_insights(user_id: str):

    user = users.find_one({"user_id": user_id}) or {}

    insights = generate_insights(user)

    return {"insights": insights}