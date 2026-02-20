# app/ai/paula_client.py

import os
import requests
import json
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
        self.endpoint = f"https://api-inference.huggingface.co/models/{model}"
        self.headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }

    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict] = None,
        max_tokens: int = 512,
        temperature: float = 0.7
    ) -> str:

        # Crisis detection BEFORE model call
        if self._is_crisis(user_message):
            return self._crisis_response()

        prompt = self._format_prompt(user_message, conversation_history)

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": temperature,
                "return_full_text": False
            }
        }

        response = requests.post(
            self.endpoint,
            headers=self.headers,
            data=json.dumps(payload),
            timeout=60
        )

        if response.status_code != 200:
            raise Exception(f"HuggingFace API error: {response.text}")

        result = response.json()

        if isinstance(result, list) and len(result) > 0:
            return result[0]["generated_text"].strip()

        return "I'm here with you. Could you tell me a little more about what you're feeling?"

    def _format_prompt(self, user_message: str, history: List[Dict]) -> str:
        system_prompt = """
You are Paula, a calm and compassionate emotional support assistant serving users in Jamaica.

You provide supportive conversation and grounding suggestions.
You are not a licensed therapist or medical professional.

If a user expresses emotional distress:
- Respond with empathy.
- Encourage healthy coping strategies.
- Avoid medical diagnosis.

If a user expresses suicidal intent:
- Encourage calling 119 if in immediate danger.
- Encourage contacting Jamaica Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE (639-5433).
- Encourage reaching out to a trusted person nearby.

Do not provide instructions for self-harm.
Keep responses supportive, clear, and culturally appropriate.
"""

        formatted_history = ""

        if history:
            for message in history[-6:]:  # limit memory
                role = message.get("role")
                content = message.get("content")
                formatted_history += f"<|start_header_id|>{role}<|end_header_id|>\n{content}\n<|eot_id|>\n"

        return f"""<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
{system_prompt}
<|eot_id|>
{formatted_history}
<|start_header_id|>user<|end_header_id|>
{user_message}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""

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
        except Exception as e:
            return "Paula is temporarily unavailable. Please try again shortly."

    return _paula_client.generate_response(user_message)
