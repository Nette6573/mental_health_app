# app/ai/paula_client.py

import requests
import logging
from typing import List, Dict, Optional
from datetime import datetime
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

HF_API_TOKEN = HF_TOKEN
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"

# -----------------------------
# 🔥 CORE DATA
# -----------------------------

CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "end my life",
    "self harm", "hurt myself", "no reason to live",
    "overdose", "hang myself"
]

JAMAICAN_PARISHES = [
    "kingston", "st. andrew", "st andrew", "st. catherine", "st catherine",
    "clarendon", "manchester", "st. elizabeth", "st elizabeth", "westmoreland",
    "hanover", "st. james", "st james", "trelawny", "st. ann", "st ann",
    "st. mary", "st mary", "portland", "st. thomas", "st thomas"
]

# Parish-based directory (kept your structure, just cleaned)
DIRECTORY = {
    "Kingston": [
        {
            "name": "Dr. Karen Brown",
            "type": "Clinical Psychologist",
            "contact": "876-555-0123",
            "address": "20 Hope Road, Kingston 6",
            "specialties": ["Depression", "Anxiety"]
        },
        {
            "name": "Dr. Patricia Williams",
            "type": "Psychiatrist",
            "contact": "876-555-0789",
            "address": "3 Gibraltar Road, Kingston 8",
            "specialties": ["Mood Disorders"]
        }
    ],
    "St. Catherine": [
        {
            "name": "Dr. Susan Campbell",
            "type": "Clinical Psychologist",
            "contact": "876-555-0891",
            "address": "10 Burke Road, Spanish Town",
            "specialties": ["PTSD", "Grief"]
        }
    ],
    "Manchester": [
        {
            "name": "Dr. Mark Taylor",
            "type": "Clinical Psychologist",
            "contact": "876-555-0654",
            "address": "7 Manchester Road, Mandeville",
            "specialties": ["Depression"]
        }
    ]
}

# -----------------------------
# 🧠 INTELLIGENCE LAYERS
# -----------------------------

def detect_intent(text: str) -> str:
    t = text.lower()

    if any(k in t for k in CRISIS_KEYWORDS):
        return "crisis"

    if any(k in t for k in ["therapist", "counselor", "psychologist", "help near me"]):
        return "referral"

    if any(k in t for k in ["sad", "tired", "empty", "stressed", "overwhelmed"]):
        return "emotional"

    return "general"


def detect_emotion(text: str) -> str:
    t = text.lower()

    if "sad" in t or "down" in t:
        return "sad"
    if "anxious" in t or "worried" in t:
        return "anxious"
    if "angry" in t or "frustrated" in t:
        return "angry"
    if "tired" in t or "exhausted" in t:
        return "tired"

    return "neutral"


# -----------------------------
# 🤖 PAULA CLIENT
# -----------------------------

class PaulaClient:

    def __init__(self):
        self.endpoint = f"https://router.huggingface.co/hf-inference/models/{MODEL_ID}"
        self.headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        self.sessions = {}

    # -----------------------------
    # MAIN ENTRY
    # -----------------------------

    def generate_response(self, user_message: str, history=None, session_id=None):

        intent = detect_intent(user_message)

        if intent == "crisis":
            return self._crisis_response()

        if intent == "referral":
            return self._handle_referral(user_message, session_id)

        return self._ai_response(user_message, history)

    # -----------------------------
    # AI RESPONSE
    # -----------------------------

    def _ai_response(self, message: str, history: List[Dict]):

        messages = [{"role": "system", "content": self._system_prompt()}]

        if history:
            messages.extend(history[-6:])

        messages.append({"role": "user", "content": message})

        try:
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "inputs": self._format(messages),
                    "parameters": {
                        "temperature": 0.75,
                        "max_new_tokens": 400
                    }
                },
                timeout=20
            )

            if response.status_code == 200:
                return response.json()[0]["generated_text"].strip()

        except Exception as e:
            logger.error(e)

        return self._fallback(message)

    # -----------------------------
    # REFERRAL SYSTEM (PARISH BASED)
    # -----------------------------

    def _handle_referral(self, message: str, session_id: str):

        parish = self._extract_parish(message)

        if not parish:
            return "Which parish are you located in? (e.g., Kingston, St. Catherine)"

        if parish not in DIRECTORY:
            return "I couldn't find a listing for that parish yet, but I can still help you explore options."

        doctors = DIRECTORY[parish]

        response = f"Here are professionals in {parish}:\n\n"

        for d in doctors:
            response += (
                f"{d['name']} - {d['type']}\n"
                f"📍 {d['address']}\n"
                f"📞 {d['contact']}\n"
                f"Focus: {', '.join(d['specialties'])}\n\n"
            )

        return response

    # -----------------------------
    # HELPERS
    # -----------------------------

    def _extract_parish(self, text: str) -> Optional[str]:
        t = text.lower()
        for p in JAMAICAN_PARISHES:
            if p in t:
                return p.title().replace("St ", "St. ")
        return None

    def _crisis_response(self):
        return (
            "I'm really concerned about you.\n\n"
            "Please reach out immediately:\n"
            "• Emergency: 119\n"
            "• 888-NEW-LIFE (24/7)\n\n"
            "You don’t have to go through this alone."
        )

    def _fallback(self, message: str):
        return "I'm here with you. Tell me a little more about what you're dealing with."

    def _format(self, messages):
        formatted = ""
        for m in messages:
            formatted += f"<|{m['role']}|>\n{m['content']}\n"
        return formatted + "<|assistant|>\n"

    def _system_prompt(self):
        return (
            "You are Paula, an emotionally intelligent support assistant.\n"
            "Be natural, warm, and human.\n"
            "Do not sound robotic.\n"
            "Do not repeat phrases.\n"
            "Do not diagnose.\n"
            "Focus on understanding the user's feelings deeply."
        )


# -----------------------------
# PUBLIC FUNCTION
# -----------------------------

_client = None

def ask_paula(user_message: str, chat_history=None, session_id=None):
    global _client

    if _client is None:
        _client = PaulaClient()

    return _client.generate_response(user_message, chat_history, session_id)