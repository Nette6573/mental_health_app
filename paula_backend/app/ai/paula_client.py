# app/ai/paula_client.py

import os
import requests
from typing import List, Dict

HF_API_TOKEN = os.getenv("HF_API_TOKEN")

MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"

HF_ENDPOINT = "https://router.huggingface.co/v1/chat/completions"


def call_llm(messages, max_tokens=500):

    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        HF_ENDPOINT,
        headers=headers,
        json={
            "model": MODEL_ID,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        },
        timeout=60
    )

    if response.status_code != 200:
        return None

    try:
        data = response.json()

        return data["choices"][0]["message"]["content"].strip()

    except Exception:
        return None


# -------------------------
# AI EMOTION DETECTION
# -------------------------

def detect_emotion_ai(text):

    messages = [
        {
            "role": "system",
            "content": "Classify the emotional tone of the message into one word: sad, anxious, stressed, angry, lonely, neutral."
        },
        {
            "role": "user",
            "content": text
        }
    ]

    result = call_llm(messages, 20)

    if not result:
        return "neutral"

    return result.lower().strip()


# -------------------------
# MEMORY SUMMARIZATION
# -------------------------

def summarize_memory(messages):

    formatted = "\n".join(
        [f"{m['role']}: {m['content']}" for m in messages]
    )

    prompt = [
        {
            "role": "system",
            "content": "Summarize the key emotional themes of this conversation briefly."
        },
        {
            "role": "user",
            "content": formatted
        }
    ]

    return call_llm(prompt, 150)


# -------------------------
# SUICIDE SAFETY
# -------------------------

CRISIS_TERMS = [
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "no reason to live",
    "better off dead"
]


def detect_crisis(text):

    text = text.lower()

    for word in CRISIS_TERMS:

        if word in text:
            return True

    return False


def crisis_response():

    return (
        "I'm really concerned about you.\n\n"
        "You deserve support and you are not alone.\n\n"
        "If you are in immediate danger please call **119**.\n\n"
        "You can also contact:\n"
        "Jamaica Mental Health Helpline: **888-639-5433**\n\n"
        "If you feel able, please consider reaching out to a trusted friend or family member."
    )


# -------------------------
# MAIN PAULA RESPONSE
# -------------------------

def ask_paula(user_message, chat_history=None, session_id=None, summary=None):

    if detect_crisis(user_message):
        return crisis_response()

    messages = [
        {
            "role": "system",
            "content":
            "You are Paula, a compassionate emotional support assistant for users in Jamaica."
        }
    ]

    if summary:

        messages.append(
            {
                "role": "system",
                "content": f"Conversation summary: {summary}"
            }
        )

    if chat_history:

        messages.extend(chat_history[-6:])

    messages.append(
        {
            "role": "user",
            "content": user_message
        }
    )

    result = call_llm(messages)

    if not result:
        return "I'm here to listen. Tell me what's on your mind."

    return result