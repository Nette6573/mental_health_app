import os
import requests

CHATBASE_API_KEY = os.getenv("CHATBASE_API_KEY")
CHATBASE_BOT_ID = os.getenv("CHATBASE_BOT_ID")

def generate_response(user_message: str, conversation_history: list, session_id: str, user_id: str) -> str:
    if not CHATBASE_API_KEY or not CHATBASE_BOT_ID:
        return "Paula is not fully connected yet. Please try again shortly."

    messages = []

    # Add history
    for msg in conversation_history:
        messages.append({
            "role": "user",
            "content": msg["text"]
        })

    # Add current message
    messages.append({
        "role": "user",
        "content": user_message
    })

    try:
        response = requests.post(
            "https://www.chatbase.co/api/v1/chat",
            headers={
                "Authorization": f"Bearer {CHATBASE_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "chatbotId": CHATBASE_BOT_ID,
                "messages": messages,
                "userId": user_id,
            },
            timeout=15,
        )

        data = response.json()

        return data.get("text", "I'm here with you — could you rephrase that?")

    except Exception as e:
        print("Chatbase error:", e)
        return "I’m still with you. Something went wrong on my side — try again in a moment."
