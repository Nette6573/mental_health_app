import os
import requests
import json
from typing import Optional

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
        self.model = model
        self.endpoint = f"https://api-inference.huggingface.co/models/{model}"
        self.headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }

    def generate_response(
        self,
        user_message: str,
        max_tokens: int = 512,
        temperature: float = 0.7
    ) -> str:

        if not HF_API_TOKEN:
            raise ValueError("HF_API_TOKEN not set.")

        # 🔴 Crisis Detection Before Model Call
        if self._is_crisis(user_message):
            return self._crisis_response()

        prompt = self._format_prompt(user_message)

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": temperature,
                "return_full_text": False
            }
        }

        try:
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                data=json.dumps(payload),
                timeout=60
            )

            if response.status_code != 200:
                raise Exception(response.text)

            result = response.json()

            if isinstance(result, list) and len(result) > 0:
                return result[0]["generated_text"].strip()

            return "I'm here with you. Could you tell me a little more about what you're feeling?"

        except Exception:
            return "I'm having trouble responding right now. Please try again."

    def _format_prompt(self, user_message: str) -> str:
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
- Encourage visiting the in-app Safety page.
- Encourage reaching out to a trusted person nearby.

Do not provide instructions for self-harm.
Keep responses supportive, clear, and culturally appropriate.
"""

        return f"""<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
{system_prompt}
<|eot_id|>
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
            "You can visit the Safety page in this app for local hospitals and mental health services.\n\n"
            "If possible, please reach out to someone you trust and let them know how you're feeling."
        )
