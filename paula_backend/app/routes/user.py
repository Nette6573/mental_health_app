from fastapi import APIRouter
from app.db.mongo import users

router = APIRouter()

@router.get("/user/{user_id}/assessments")
def get_user_assessments(user_id: str):
    user = users.find_one({"user_id": user_id}) or {}

    return {
        "phq9": user.get("assessments", {}).get("phq9", [])
    }