import requests
import os

CHATBASE_API_KEY = os.getenv("CHATBASE_API_KEY")
CHATBASE_BOT_ID = os.getenv("CHATBASE_BOT_ID")

CHATBASE_URL = f"https://www.chatbase.co/api/v1/chat/{CHATBASE_BOT_ID}"

def chatbase_response(message: str, conversation_history: list):
    headers = {
        "Authorization": f"Bearer {CHATBASE_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "messages": [
            *[
                {"role": "user", "content": h["text"]}
                for h in conversation_history
            ],
            {"role": "user", "content": message},
        ]
    }

    r = requests.post(CHATBASE_URL, headers=headers, json=payload, timeout=30)
    r.raise_for_status()
    data = r.json()

    return data["text"]
