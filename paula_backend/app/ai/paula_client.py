# app/ai/paula_client.py

import os
import requests
from typing import List, Dict

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"


CRISIS_KEYWORDS = [
    "kill myself",
    "suicide",
    "want to die",
    "end my life",
    "self harm",
    "hurt myself",
    "no reason to live",
    "overdose",
    "hang myself"
]


class PaulaClient:
    def __init__(self, model: str = MODEL_ID):
        if not HF_API_TOKEN:
            raise ValueError("HF_API_TOKEN not set.")

        self.model = model
        self.endpoint = "https://router.huggingface.co/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }

    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict] = None,
        max_tokens: int = 400,
        temperature: float = 0.7
    ) -> str:

        # Crisis detection BEFORE model call
        if self._is_crisis(user_message):
            return self._crisis_response()

        messages = [
            {"role": "system", "content": self._system_prompt()}
        ]

        # Add conversation history if available
        if conversation_history:
            for msg in conversation_history[-6:]:
                messages.append({
                    "role": msg.get("role"),
                    "content": msg.get("content")
                })

        # Add latest user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        response = requests.post(
            self.endpoint,
            headers=self.headers,
            json={
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature
            },
            timeout=60
        )

        if response.status_code != 200:
            raise Exception(f"HuggingFace API error: {response.text}")

        result = response.json()
        return result["choices"][0]["message"]["content"].strip()

    def _system_prompt(self) -> str:
        return (
            "You are Paula, a calm and compassionate emotional support assistant serving users in Jamaica. "
            "Respond in clear standard English. Encourage users to reply in English. "
            "Provide supportive, empathetic conversation and healthy coping suggestions. "
            "Do not provide medical diagnoses. "
            "If a user expresses suicidal intent, encourage calling 119 immediately and contacting "
            "Jamaica Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE (639-5433). "
            "Encourage reaching out to a trusted person nearby. "
            "Never provide instructions for self-harm."
        )

    def _is_crisis(self, text: str) -> bool:
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in CRISIS_KEYWORDS)

    def _crisis_response(self) -> str:
        return (
            "I'm really sorry you're feeling this way. You deserve support and care.\n\n"
            "If you're in immediate danger, please call 119 right now.\n\n"
            "You can also contact the Jamaica Mental Health & Suicide Prevention Helpline:\n"
            "📞 888-NEW-LIFE (639-5433) — available 24/7 nationwide.\n\n"
            "If possible, please reach out to someone you trust and let them know how you're feeling."
        )


# --- PUBLIC FUNCTION USED BY ROUTES ---

_paula_client = None

def ask_paula(user_message: str, chat_history=None) -> str:
    global _paula_client

    if _paula_client is None:
        try:
            _paula_client = PaulaClient()
        except Exception:
            return "Paula is temporarily unavailable. Please try again shortly."

    return _paula_client.generate_response(user_message, chat_history)
