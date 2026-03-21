# app/ai/paula_client.py

import requests
import logging
from typing import List, Dict, Optional
from datetime import datetime
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

HF_API_TOKEN = HF_TOKEN
MODEL_ID = "microsoft/DialoGPT-medium"

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
    if "heavy" in t or "overwhelmed" in t:
        return "overwhelmed"

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
        logger.info(f"✅ PaulaClient initialized with model: {MODEL_ID}")
        logger.info(f"🔗 Endpoint: {self.endpoint}")

    def generate_response(self, user_message: str, history=None, session_id=None, summary=None):

        intent = detect_intent(user_message)

        if intent == "crisis":
            return self._crisis_response()

        if intent == "referral":
            return self._handle_referral(user_message, session_id)

        # Try AI first, fallback to enhanced context-aware responses
        ai_response = self._ai_response(user_message, history)
        if ai_response and "Tell me a little more" not in ai_response:
            return ai_response
        
        # If AI failed or gave generic response, use enhanced fallback
        return self._enhanced_fallback(user_message, history)

    def _ai_response(self, message: str, history: List[Dict]):

        # Build conversation context
        conversation = self._system_prompt() + "\n\n"
        
        if history:
            for msg in history[-8:]:
                if msg.get("role") == "user":
                    conversation += f"User: {msg.get('content')}\n"
                else:
                    conversation += f"Paula: {msg.get('content')}\n"
        
        conversation += f"User: {message}\nPaula:"

        try:
            logger.info(f"📤 Sending request to Hugging Face API")
            
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "inputs": conversation,
                    "parameters": {
                        "temperature": 0.8,
                        "max_new_tokens": 150,
                        "top_p": 0.9,
                        "do_sample": True,
                        "return_full_text": False
                    }
                },
                timeout=30
            )

            logger.info(f"📥 API Response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated = result[0].get('generated_text', '')
                    if generated and len(generated) > 10:
                        generated = generated.replace("User:", "").replace("Paula:", "").strip()
                        return generated
                return None
            else:
                logger.error(f"API Error: {response.status_code}")
                return None

        except Exception as e:
            logger.error(f"Error in _ai_response: {e}")
            return None

    def _enhanced_fallback(self, message: str, history: List[Dict] = None) -> str:
        """Enhanced context-aware fallback with varied responses"""
        
        msg_lower = message.lower()
        
        # Track how many times we've responded to avoid repetition
        if history:
            recent_responses = [m.get("content", "") for m in history[-3:] if m.get("role") == "assistant"]
            last_response = recent_responses[-1] if recent_responses else ""
        
        # Responses based on emotional keywords
        if "tired" in msg_lower or "exhausted" in msg_lower:
            responses = [
                "I hear that tiredness. Sometimes rest is exactly what we need. Have you been able to get any quiet time for yourself lately? 💛",
                "Feeling tired can really weigh you down. Is it physical tiredness, or more like emotional exhaustion?",
                "That tired feeling can be so heavy. Remember it's okay to rest when you need to. What usually helps you recharge?"
            ]
            return responses[hash(message) % len(responses)]
        
        if "heavy" in msg_lower or "overwhelmed" in msg_lower:
            responses = [
                "That heaviness you're carrying sounds really difficult. Sometimes just naming it helps lighten the load a bit. What's weighing on you most right now?",
                "When everything feels heavy, it can be hard to know where to start. Take a deep breath with me. We can work through this together. 💛",
                "I hear that heaviness. You're not alone in feeling this way. Would you like to share what's making things feel so overwhelming?"
            ]
            return responses[hash(message) % len(responses)]
        
        if "sad" in msg_lower or "depressed" in msg_lower:
            responses = [
                "I hear that sadness, and it's completely okay to feel that way. What's been on your mind lately?",
                "Sadness can feel so isolating, but you're not alone. I'm here with you. Want to tell me more about what's been happening?",
                "Those sad feelings are valid. Sometimes talking about them can help lighten the load just a bit. I'm listening."
            ]
            return responses[hash(message) % len(responses)]
        
        if "friend" in msg_lower or "people" in msg_lower:
            responses = [
                "Relationships can be so complicated. It sounds like something's happened with people close to you. Would you like to share?",
                "I hear that something's going on with people around you. That can be really tough to navigate. I'm here to listen.",
                "Dealing with people we care about can be hard. Want to tell me what's been happening?"
            ]
            return responses[hash(message) % len(responses)]
        
        if "betray" in msg_lower or "trust" in msg_lower:
            responses = [
                "Betrayal cuts deep. When people we trust let us down, it's incredibly painful. I'm sorry you're going through this.",
                "Trust is so precious, and when it's broken, it hurts deeply. I'm here for you. Would you like to talk about what happened?",
                "That feeling of betrayal is so hard to carry alone. I'm listening if you want to share more."
            ]
            return responses[hash(message) % len(responses)]
        
        # If user is just saying hi or starting conversation
        if any(word in msg_lower for word in ["hello", "hi", "hey", "greetings"]):
            responses = [
                "Hello! I'm here with you. How are you feeling today? 💛",
                "Hey there! I'm glad you reached out. What's on your mind?",
                "Hi! I'm here to listen. How has your day been?"
            ]
            return responses[hash(message) % len(responses)]
        
        # If this is a follow-up to a previous response
        if history and len(history) > 1:
            previous_user = None
            for msg in reversed(history):
                if msg.get("role") == "user" and msg.get("content") != message:
                    previous_user = msg.get("content")
                    break
            
            if previous_user:
                responses = [
                    f"I remember you mentioned earlier: '{previous_user[:80]}...' Let's continue from there. How are you feeling about that now?",
                    f"Earlier you were sharing about something that was on your mind. Would you like to talk more about that?",
                    f"I'm here to listen about what you shared before, or if something new is on your mind, I'm here for that too."
                ]
                return responses[hash(message) % len(responses)]
        
        # Default varied responses
        default_responses = [
            "I'm here with you. What's been on your mind lately? 💛",
            "I'm listening. Would you like to share more about what you're feeling?",
            "Tell me what's on your heart right now. I'm here to listen.",
            "I'm here for you. What would be helpful to talk about?"
        ]
        
        # Avoid repeating the same response
        if history and last_response in default_responses:
            for resp in default_responses:
                if resp != last_response:
                    return resp
        
        return default_responses[hash(message) % len(default_responses)]

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

    def _extract_parish(self, text: str) -> Optional[str]:
        t = text.lower()
        for p in JAMAICAN_PARISHES:
            if p in t:
                return p.title().replace("St ", "St. ")
        return None

    def _crisis_response(self):
        return (
            "🚨 I'm really concerned about you.\n\n"
            "Please reach out immediately:\n"
            "• Emergency: 119\n"
            "• 888-NEW-LIFE (639-5433) - 24/7\n\n"
            "You don't have to go through this alone. Please talk to someone who can help right now."
        )

    def _system_prompt(self):
        return (
            "You are Paula, a warm and compassionate emotional support assistant.\n"
            "Be natural, warm, and human. Keep responses to 2-3 sentences.\n"
            "Do not sound robotic or repeat phrases.\n"
            "Do not diagnose or label conditions.\n"
            "Focus on understanding the user's feelings and providing support.\n"
            "Use Jamaican warmth and empathy in your tone."
        )


# -----------------------------
# PUBLIC FUNCTIONS
# -----------------------------

_client = None

def ask_paula(user_message: str, chat_history=None, session_id=None, summary=None):
    global _client

    if _client is None:
        _client = PaulaClient()
        logger.info("✅ PaulaClient initialized successfully")

    if chat_history:
        logger.info(f"📚 Using conversation history with {len(chat_history)} messages")

    return _client.generate_response(user_message, chat_history, session_id, summary)


def detect_emotion_ai(text: str) -> str:
    emotion = detect_emotion(text)
    logger.info(f"🎭 Emotion detected: {emotion}")
    return emotion


def summarize_memory(history: List[Dict]) -> str:
    if not history:
        return ""
    
    topics = set()
    for msg in history[-10:]:
        content = msg.get("content", "").lower()
        if "friend" in content or "relationship" in content:
            topics.add("relationships")
        if "sad" in content or "tired" in content or "heavy" in content:
            topics.add("emotional struggles")
        if "work" in content or "job" in content:
            topics.add("work concerns")
    
    if topics:
        return f"Previous conversation covered: {', '.join(topics)}"
    return "Previous conversation context available"