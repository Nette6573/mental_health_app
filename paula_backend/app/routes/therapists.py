from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.db.mongo import users
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


# =========================================================
# 👩‍⚕️ GET ALL THERAPISTS
# =========================================================
@router.get("/therapists")
def get_therapists():
    try:
        therapists = list(users.find({
            "role": "therapist"   # IMPORTANT
        }))

        for t in therapists:
            t["_id"] = str(t["_id"])

        return therapists

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch therapists")


# =========================================================
# 👩‍⚕️ GET SINGLE THERAPIST
# =========================================================
@router.get("/therapists/{therapist_id}")
def get_therapist(therapist_id: str):
    try:
        therapist = users.find_one({
            "user_id": therapist_id   # Firebase UID
        })

        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")

        therapist["_id"] = str(therapist["_id"])
        return therapist

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch therapist")