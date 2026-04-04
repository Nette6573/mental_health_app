import logging
from typing import Dict
from datetime import datetime

from app.ai.response_builder import build_response
from app.ai.safety_engine import detect_crisis, safe_crisis_response
from app.ai.session_manager import SessionState

logger = logging.getLogger(__name__)

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

        # Safety
        if detect_crisis(user_message):
            return safe_crisis_response()

        # PHQ9
        if state.phq9_active:
            return self._handle_phq9(user_message, state)

        if "assessment" in user_message.lower():
            state.phq9_active = True
            state.phq9_index = 0
            state.phq9_score = 0
            return self._ask_phq9_question(state)

        # Main AI
        return build_response(user_message, chat_memory, stage)

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
            response += "It might help to talk to a professional.\n👉 https://hopepath.online/dashboard/therapists"
        else:
            response += "You’re doing okay, but self-care still matters.\n👉 https://hopepath.online/dashboard/resources/self-help"

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