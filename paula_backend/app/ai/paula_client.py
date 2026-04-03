import logging
import random
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

# -----------------------------
# PHQ-9 SYSTEM
# -----------------------------

PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure?",
    "Trouble concentrating on things?",
    "Moving or speaking slowly or being restless?",
    "Thoughts that you would be better off dead or hurting yourself?"
]

PHQ9_OPTIONS = {
    "0": "Not at all",
    "1": "Several days",
    "2": "More than half the days",
    "3": "Nearly every day"
}

# -----------------------------
# HELPERS
# -----------------------------

def detect_crisis(message: str) -> bool:
    msg = message.lower()
    return any(word in msg for word in [
        "suicide", "kill myself", "want to die",
        "end my life", "self harm"
    ])

def detect_user_type(message: str) -> str:
    msg = message.lower()

    if any(w in msg for w in ["why", "how"]):
        return "analytical"
    if any(w in msg for w in ["feel", "sad", "hurt"]):
        return "emotional"
    if len(msg.split()) < 6:
        return "withdrawn"
    if "stress" in msg or "overwhelmed" in msg:
        return "overwhelmed"

    return "balanced"

def get_resource_link(resource_type: str) -> str:
    base = "https://hopepath.online/dashboard"

    links = {
        "therapy": f"{base}/therapists",
        "meditation": f"{base}/resources/self-help",
        "crisis": f"{base}/resources/crisis"
    }

    return links.get(resource_type, base)

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
# PAULA CLIENT
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

        # 🚨 CRISIS FIRST
        if detect_crisis(user_message):
            return (
                "Mi really glad yuh reached out 💛\n\n"
                "This sounds serious. Please talk to someone right now:\n"
                "📞 888-NEW-LIFE (639-5433)\n"
                "🚑 119\n\n"
                f"You can also get support here: {get_resource_link('crisis')}"
            )

        # ---------------- PHQ9 FLOW ---------------- #

        if state.phq9_active:
            return self._handle_phq9(user_message, state)

        if "assessment" in user_message.lower() or "test" in user_message.lower():
            state.phq9_active = True
            state.phq9_index = 0
            state.phq9_score = 0
            return self._ask_phq9_question(state)

        # ---------------- NORMAL FLOW ---------------- #

        user_type = detect_user_type(user_message)
        response = []

        OPENERS = [
            "Mi hear yuh…",
            "That sounds really tough…",
            "I can feel how heavy that is…"
        ]

        response.append(random.choice(OPENERS))

        # Emotion
        emotion = chat_memory.get("emotional_state") if chat_memory else None

        if emotion == "stressed":
            response.append("It feels like your mind just not getting a break.")

        # Memory awareness
        if user_memory:
            issues = user_memory.get("main_issues", [])
            if issues:
                response.append(f"This seems to keep coming up… especially around {issues[0]}.")

        # Adaptive behavior
        if user_type == "overwhelmed":
            response.append("Let’s slow it down a likkle…")
            response.append("What’s bothering you the most right now?")

        elif user_type == "emotional":
            response.append("That feeling makes sense.")
            response.append("What part is hitting you hardest?")

        else:
            response.append("Tell me more about what’s going on.")

        # Smart referral
        if user_memory and len(user_memory.get("main_issues", [])) > 1:
            response.append(
                f"You’ve been dealing with a lot… talking to someone might help:\n{get_resource_link('therapy')}"
            )

        # Offer PHQ9
        if "sad" in user_message.lower() or "hopeless" in user_message.lower():
            response.append(
                "Would you like to take a quick mental health check (PHQ-9)? It helps understand how you're feeling."
            )

        return "\n\n".join(response[:4])

    # ---------------- PHQ9 ---------------- #

    def _ask_phq9_question(self, state: SessionState):
        q = PHQ9_QUESTIONS[state.phq9_index]
        options = "\n".join([f"{k} - {v}" for k, v in PHQ9_OPTIONS.items()])
        return f"PHQ-9 Question {state.phq9_index + 1}:\n{q}\n\n{options}"

    def _handle_phq9(self, message: str, state: SessionState):
        if message not in PHQ9_OPTIONS:
            return "Please respond with 0, 1, 2, or 3."

        state.phq9_score += int(message)
        state.phq9_index += 1

        if state.phq9_index < len(PHQ9_QUESTIONS):
            return self._ask_phq9_question(state)

        return self._finish_phq9(state)

    def _finish_phq9(self, state: SessionState):
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
            response += (
                "It might really help to speak with a professional.\n"
                f"👉 {get_resource_link('therapy')}"
            )
        else:
            response += (
                "You may benefit from self-help tools.\n"
                f"👉 {get_resource_link('meditation')}"
            )

        from datetime import datetime
        
        from app.db.mongo import users
        
        # Save PHQ9 result
        try:
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
            logger.error(f"Failed to save PHQ9: {e}")
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