from .chatbase_client import send_to_chatbase

def get_reply(user_message: str, user_id: str, session_id: str):
    reply = send_to_chatbase(
        message=user_message,
        user_id=user_id,
        session_id=session_id
    )

    return {
        "id": session_id,
        "sender": "paula",
        "text": reply,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    }
