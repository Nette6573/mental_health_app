from api.models.chat import ChatMessage
from api.utils.database import chat_collection

def save_chat_message(user_message: str, paula_response: str, session_id: str | None = None):
    chat_entry = ChatMessage(
        user_message=user_message,
        paula_response=paula_response,
        session_id=session_id,
    )

    # Convert to dict for MongoDB
    chat_collection.insert_one(chat_entry.dict())
