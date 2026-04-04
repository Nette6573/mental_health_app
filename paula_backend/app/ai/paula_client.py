import logging
import random
from typing import List, Dict
from datetime import datetime
from app.ai.emotion_engine import analyze_emotional_trend
from app.ai.therapy_engine import (
    detect_need,
    cbt_reframe,
    grounding_exercise,
    breathing_exercise
)

logger = logging.getLogger(__name__)

# -----------------------------
# PHQ-9 SYSTEM
# -----------------------------

PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble sleeping?",
    "Feeling tired or low energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself?",
    "Trouble concentrating?",
    "Moving slowly or being restless?",
    "Thoughts of self-harm or death?"
]

PHQ9_OPTIONS = {
    "0": "Not at all",
    "1": "Several days",
    "2": "More than half the days",
    "3": "Nearly every day"
}

# -----------------------------
# SAFETY SYSTEM
# -----------------------------

def detect_crisis(message: str) -> bool:
    msg = message.lower()
    return any(word in msg for word in [
        "suicide", "kill myself", "want to die",
        "end my life", "self harm", "better off dead"
    ])

def safe_crisis_response():
    return (
        "Mi really glad yuh reached out 💛\n\n"
        "What you're going through sounds serious. You don’t have to handle this alone.\n\n"
        "Please reach out right now:\n"
        "📞 888-NEW-LIFE (639-5433)\n"
        "🚑 119\n\n"
        "https://hopepath.online/dashboard/resources/crisis\n\n"
        "If you can, try to stay near someone you trust."
    )

# -----------------------------
# USER UNDERSTANDING
# -----------------------------

def detect_user_type(message: str) -> str:
    msg = message.lower()

    if len(msg.split()) < 5:
        return "withdrawn"
    if any(w in msg for w in ["sad", "hurt", "feel"]):
        return "emotional"
    if any(w in msg for w in ["why", "how"]):
        return "analytical"
    if "stress" in msg or "overwhelmed" in msg:
        return "overwhelmed"

    return "balanced"

# -----------------------------
# EMOTIONAL INTELLIGENCE
# -----------------------------

def get_tone(user_type, trend, stage):
    if user_type == "withdrawn":
        tone = "gentle"
    elif user_type == "emotional":
        tone = "warm"
    elif user_type == "analytical":
        tone = "structured"
    else:
        tone = "balanced"

    if trend == "declining":
        tone += " and extra supportive"

    if trend == "chronic_stress":
        tone += " and calming"

    if stage == "deep":
        tone += " and reflective"

    return tone


def empathy_reflection(user_message):
    msg = user_message.lower()

    if "fail" in msg:
        return "That can really shake your confidence."
    if "tired" in msg:
        return "That kind of tiredness goes deeper than just sleep."
    if "stress" in msg:
        return "That kind of pressure builds up quietly."
    if "overwhelmed" in msg:
        return "When everything piles up, it can feel like too much at once."

    return None

# -----------------------------
# RESOURCE ROUTING
# -----------------------------

def get_resource_link(resource_type: str) -> str:
    base = "https://hopepath.online/dashboard"

    return {
        "therapy": f"{base}/therapists",
        "meditation": f"{base}/resources/self-help",
        "crisis": f"{base}/resources/crisis"
    }.get(resource_type, base)

# -----------------------------
# SESSION STATE
# -----------------------------

class SessionState:
    def __init__(self):
        self.phq9_active = False
        self.phq9_index = 0
        self.phq9_score = 0
        self.user_id = None

# -----------------------------
# SAFETY LAYER
# -----------------------------

def add_safety_layer(response_text):
    return (
        response_text +
        "\n\n💛 Just a reminder: I'm here to support you, but I'm not a licensed therapist. "
        "If things feel overwhelming, speaking with a professional can really help."
    )

# -----------------------------
# CORE AI ENGINE
# -----------------------------

class PaulaClient:

    def __init__(self):
        self.sessions: Dict[str, SessionState] = {}
        logger.info("✅ PaulaClient initialized")

    def get_session(self, session_id: str) -> SessionState:
        if session_id not in self.sessions:
            self.sessions[session_id] = SessionState()
        return self.sessions[session_id]

    def generate_response(
        self,
        user_message: str,
        history=None,
        session_id=None,
        user_memory=None,
        chat_memory=None,
        stage=None
    ):

        state = self.get_session(session_id) if session_id else SessionState()
        state.user_id = session_id

        # ---------------- CRISIS ---------------- #
        if detect_crisis(user_message):
            return safe_crisis_response()

        # ---------------- PHQ9 ---------------- #
        if state.phq9_active:
            return self._handle_phq9(user_message, state)

        if "assessment" in user_message.lower():
            state.phq9_active = True
            state.phq9_index = 0
            state.phq9_score = 0
            return self._ask_phq9_question(state)

        # ---------------- CONTEXT ---------------- #
        emotion = (chat_memory or {}).get("emotional_state")
        issues = (chat_memory or {}).get("main_issues", [])
        risk_flags = (chat_memory or {}).get("risk_flags", [])

        user_type = detect_user_type(user_message)
        trend = analyze_emotional_trend(chat_memory or {})
        tone = get_tone(user_type, trend, stage)

        response = []

        # ---------------- OPENING ---------------- #
        response.append(random.choice([
            "Mi hear yuh 💛",
            "That sounds heavy…",
            "I’m really glad yuh said that."
        ]))

        # ---------------- EMOTIONAL REFLECTION ---------------- #
        if trend == "declining":
            response.append("I’ve noticed things have been feeling heavier over time…")

        if trend == "chronic_stress":
            response.append("It seems like your mind hasn’t had a real break in a while.")

        if emotion:
            response.append(f"It sounds like you're feeling {emotion}.")

        reflection = empathy_reflection(user_message)
        if reflection:
            response.append(reflection)

        if issues:
            response.append(f"This keeps coming up, especially around {issues[0]}.")

        # ---------------- RISK HANDLING ---------------- #
        if "burnout_risk" in risk_flags:
            response.append("You might be reaching burnout. Your body needs real rest.")

        if "depression_risk" in risk_flags:
            response.append(
                f"You don’t have to carry this alone.\n👉 {get_resource_link('therapy')}"
            )

        # ---------------- ADAPTIVE RESPONSE ---------------- #
        if user_type == "withdrawn":
            response.append("You don’t have to say much… I’m here with you.")
        elif user_type == "emotional":
            response.append("That feeling makes sense. What part is hitting you most?")
        elif user_type == "analytical":
            response.append("Let’s break it down step by step.")
        else:
            response.append("Tell me more about what’s going on.")

        # ---------------- THERAPEUTIC INTERVENTION ---------------- #
        intervention = detect_need(user_message)

        # ✅ ONLY TRIGGER DEEP INTERVENTIONS LATER
        if stage == "deep":

            if intervention == "grounding":
                response.append(grounding_exercise())

            elif intervention == "cbt":
                response.append(cbt_reframe())

            elif intervention == "breathing":
                response.append(breathing_exercise())

        # ---------------- PHQ9 OFFER ---------------- #
        if "sad" in user_message.lower() or "hopeless" in user_message.lower():
            response.append("Would you like to do a quick mental check-in together?")

        final_response = "\n\n".join(response[:5])
        return add_safety_layer(final_response)

    # ---------------- PHQ9 ---------------- #

    def _ask_phq9_question(self, state):
        q = PHQ9_QUESTIONS[state.phq9_index]
        options = "\n".join([f"{k} - {v}" for k, v in PHQ9_OPTIONS.items()])
        return f"PHQ-9 Question {state.phq9_index + 1}:\n{q}\n\n{options}"

    def _handle_phq9(self, message, state):

        if message not in PHQ9_OPTIONS:
            return "Please respond with 0, 1, 2, or 3."

        state.phq9_score += int(message)
        state.phq9_index += 1

        if state.phq9_index < len(PHQ9_QUESTIONS):
            return self._ask_phq9_question(state)

        return self._finish_phq9(state)

    def _finish_phq9(self, state):

        score = state.phq9_score
        state.phq9_active = False

        if score <= 4:
            level = "Minimal"
        elif score <= 9:
            level = "Mild"
        elif score <= 14:
            level = "Moderate"
        elif score <= 19:
            level = "Moderately Severe"
        else:
            level = "Severe"

        response = f"Your score is {score} ({level}).\n\n"

        if score >= 10:
            response += f"👉 {get_resource_link('therapy')}"
        else:
            response += f"👉 {get_resource_link('meditation')}"

        try:
            from app.db.mongo import users

            users.update_one(
                {"user_id": state.user_id},
                {
                    "$push": {
                        "assessments.phq9": {
                            "score": score,
                            "level": level,
                            "date": datetime.utcnow()
                        }
                    }
                },
                upsert=True
            )
        except Exception as e:
            logger.error(f"PHQ9 save error: {e}")

        return response

# -----------------------------
# PUBLIC FUNCTIONS
# -----------------------------

_client = None

def ask_paula(user_message, chat_history=None, session_id=None, user_memory=None, chat_memory=None, stage=None):
    global _client

    if _client is None:
        _client = PaulaClient()

    return _client.generate_response(
        user_message,
        chat_history,
        session_id,
        user_memory,
        chat_memory,
        stage
    )

def detect_emotion_ai(text: str) -> str:
    text = text.lower()
    if "stress" in text:
        return "stressed"
    if "sad" in text:
        return "sad"
    return "neutral"

def summarize_memory(history: List[Dict]) -> str:
    return ""