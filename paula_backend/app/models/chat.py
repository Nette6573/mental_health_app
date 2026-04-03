from datetime import datetime
from typing import Dict

def new_chat(user_id: str) -> Dict:
    return {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "messages": [],
        "mood_log": [],
        "summary": None,

        # ✅ NEW MEMORY SYSTEM
        "memory": {
            "emotional_state": None,
            "main_issues": [],
            "habits": []
        },

        "context": {
            "user_name": None,
            "topics_discussed": [],
            "last_emotion": None,
            "resource_offered": False
        }
    }

def chat_to_dict(chat) -> Dict:
    chat_dict = dict(chat)
    chat_dict["_id"] = str(chat_dict["_id"])
    return chat_dict