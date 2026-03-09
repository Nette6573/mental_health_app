# app/ai/paula_client.py

import os
import requests
from typing import List, Dict, Optional

# Configuration
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"

# Crisis keywords and responses
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "end my life",
    "self harm", "hurt myself", "no reason to live", "overdose",
    "hang myself", "life not worth living", "wish i was dead", 
    "better off dead"
]

POSITIVE_RESPONSES = [
    "yes", "yeah", "yep", "sure", "ok", "okay",
    "please", "that would help", "i would like that"
]

NEGATIVE_RESPONSES = [
    "no", "nah", "not really", "no thanks", "maybe later", "i'm good"
]

EMOTION_KEYWORDS = {
    "stress": ["stressed", "overwhelmed", "pressure", "too much"],
    "sad": ["sad", "down", "depressed", "empty", "hopeless"],
    "anxiety": ["anxious", "worried", "panic", "nervous", "fear"],
    "lonely": ["lonely", "alone", "isolated", "no one"]
}

APP_RESOURCES = {
    "stress": {
        "title": "Guided Breathing Exercise",
        "description": "A short breathing exercise designed to calm your body and reduce stress.",
        "link": "/resources/breathing"
    },
    "anxiety": {
        "title": "Grounding Exercise",
        "description": "A simple grounding technique that can help when your thoughts feel overwhelming.",
        "link": "/resources/grounding"
    },
    "sad": {
        "title": "Reflection Journal",
        "description": "Writing your thoughts can help you process emotions and gain clarity.",
        "link": "/resources/journal"
    },
    "lonely": {
        "title": "Faith and Encouragement Resources",
        "description": "Scriptures and reflections that many people find comforting during difficult times.",
        "link": "/resources/faith"
    }
}

# Jamaican mental health resources
JAMAICAN_RESOURCES = {
    "counselors": [
        {
            "name": "Dr. Pearnel Bell",
            "specialty": "Clinical Psychologist",
            "location": "Kingston, Jamaica"
        },
        {
            "name": "Dr. Herbert Gayle",
            "specialty": "Social Anthropologist & Youth Violence Specialist",
            "location": "Kingston, Jamaica"
        },
        {
            "name": "Dr. Karen Carpenter",
            "specialty": "Psychologist",
            "location": "Jamaica Psychological Society"
        }
    ],
    "hotlines": [
        {
            "name": "Jamaica Mental Health Helpline",
            "phone": "888-NEW-LIFE (639-5433)"
        },
        {
            "name": "Ministry of Health Mental Health Support Line",
            "phone": "888-639-5433"
        },
        {
            "name": "Emergency Services",
            "phone": "119"
        }
    ]
}


class PaulaClient:
    def __init__(self, model: str = MODEL_ID):
        if not HF_API_TOKEN:
            # Fallback to rule-based mode if no API token
            self.use_api = False
            print("Warning: HF_API_TOKEN not set. Using rule-based responses.")
        else:
            self.use_api = True
            self.model = model
            self.endpoint = "https://router.huggingface.co/v1/chat/completions"
            self.headers = {
                "Authorization": f"Bearer {HF_API_TOKEN}",
                "Content-Type": "application/json"
            }
        
        self.referral_contexts = {}

    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict] = None,
        max_tokens: int = 600,
        temperature: float = 0.7,
        session_id: str = None
    ) -> str:
        """Main entry point for generating responses"""
        
        text = user_message.lower()

        # Check for crisis first (always use crisis response regardless of mode)
        if self._is_crisis(text):
            return self._crisis_response()

        # If API is not available, use rule-based responses
        if not self.use_api:
            return self._rule_based_response(text, conversation_history, session_id)

        # Otherwise use the Hugging Face API
        return self._api_based_response(
            user_message, conversation_history, max_tokens, temperature, session_id, text
        )

    def _api_based_response(self, user_message, conversation_history, max_tokens, temperature, session_id, text):
        """Handle API-based responses"""
        
        emotion = self._detect_emotion(text)

        # Check referral flow
        if session_id and session_id in self.referral_contexts:
            stage = self.referral_contexts[session_id]["stage"]
            
            if stage == "offer_referral":
                if self._is_positive(text):
                    self.referral_contexts[session_id]["stage"] = "awaiting_parish"
                    return self._parish_request_response()
                
                if self._is_negative(text):
                    del self.referral_contexts[session_id]
                    return self._decline_referral_response()

        # Get AI response
        ai_response = self._get_empathetic_response(
            user_message, conversation_history, max_tokens, temperature
        )

        # Add app resource suggestion
        resource = self._suggest_app_resource(emotion)
        if resource:
            ai_response += f"\n\n{resource}"

        # Suggest professional referral if needed
        if self._should_suggest_referral(conversation_history):
            if session_id:
                self.referral_contexts[session_id] = {"stage": "offer_referral"}
            ai_response += self._referral_suggestion()

        return ai_response

    def _rule_based_response(self, text: str, conversation_history=None, session_id=None) -> str:
        """Fallback rule-based responses when API is unavailable"""
        
        # Check for stress-related keywords
        if any(word in text for word in ["stress", "overwhelmed", "pressure"]):
            return self._stress_response()
        
        # Check for sadness/depression keywords
        elif any(word in text for word in ["sad", "depressed", "lonely", "alone"]):
            return self._sadness_response()
        
        # Check for anxiety
        elif any(word in text for word in ["anxious", "worry", "panic", "nervous"]):
            return self._anxiety_response()
        
        # Default response
        else:
            return self._default_response()

    def _get_empathetic_response(
        self,
        user_message: str,
        conversation_history: List[Dict],
        max_tokens: int,
        temperature: float
    ) -> str:
        """Get response from Hugging Face API"""
        
        messages = [
            {"role": "system", "content": self._system_prompt()}
        ]

        if conversation_history:
            for msg in conversation_history[-6:]:
                messages.append({
                    "role": msg.get("role"),
                    "content": msg.get("content")
                })

        messages.append({
            "role": "user",
            "content": user_message
        })

        try:
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
                return self._fallback()

            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

        except Exception as e:
            print(f"Error calling Hugging Face API: {e}")
            return self._fallback()

    # ========== Response Templates ==========
    
    def _crisis_response(self):
        return (
            "I am really concerned about you. You do not have to go through this alone.\n\n"
            "**If you are in immediate danger, please contact emergency services: 119**\n\n"
            "You can also reach the Jamaica Mental Health Helpline at:\n"
            "📞 **888-NEW-LIFE (639-5433)**\n\n"
            "If possible, consider reaching out to a trusted friend, family member, "
            "or someone nearby who can support you right now.\n\n"
            "Would you like me to provide more resources or just listen?"
        )

    def _stress_response(self):
        return (
            "I'm sorry you're feeling stressed right now. Stress can come from many different pressures in life.\n\n"
            "Sometimes it helps to pause and talk through what is causing the pressure. If you'd like, you can tell me more about what is happening.\n\n"
            "You may also find it helpful to try some tools available in this app:\n"
            "• **Guided Journaling** – Get thoughts out of your head and onto paper\n"
            "• **Breathing Exercises** – Quick techniques to calm your nervous system\n"
            "• **Daily Reflection Prompts** – Gentle questions to help you process\n\n"
            f"{self._jamaican_resources_text()}"
        )

    def _sadness_response(self):
        return (
            "I'm really glad you shared that with me. Feeling sad or lonely can be very difficult, and you don't have to carry that feeling by yourself.\n\n"
            "Sometimes it helps to talk about what may be contributing to those feelings. If you're comfortable, you can share more about what has been on your mind.\n\n"
            "You might also consider using some of the resources in this app such as:\n"
            "• **Reflection Journal** – Writing can help process emotions\n"
            "• **Faith-Based Encouragement** – Words of comfort and hope\n"
            "• **Community Support** – Connect with others who understand\n\n"
            f"{self._jamaican_resources_text()}"
        )

    def _anxiety_response(self):
        return (
            "Anxiety can feel overwhelming when it shows up. I want you to know that what you're feeling is valid, and you're not alone in this.\n\n"
            "When anxiety feels intense, sometimes grounding techniques can help:\n"
            "• Take 5 slow, deep breaths\n"
            "• Name 5 things you can see around you\n"
            "• Place your hand on your chest and notice your heartbeat\n\n"
            "In this app, you can find:\n"
            "• **Grounding Exercises** – Step-by-step guides\n"
            "• **Anxiety Tracking** – Notice patterns over time\n\n"
            f"{self._jamaican_resources_text()}"
        )

    def _default_response(self):
        return (
            "Thank you for sharing that with me. I'm here to listen.\n\n"
            "If you're dealing with something difficult, you don't have to handle it alone. You can tell me more about what you're experiencing, and we can talk through it together.\n\n"
            "You may also find support through tools inside this app such as:\n"
            "• **Guided Journaling** – Process your thoughts\n"
            "• **Reflection Exercises** – Gentle self-discovery\n"
            "• **Stress Management Resources** – Practical tools\n\n"
            f"{self._jamaican_resources_text()}"
        )

    def _parish_request_response(self):
        return (
            "I can help you find a mental health professional. "
            "Which parish in Jamaica are you located in? (Kingston, St. Andrew, St. Catherine, Clarendon, etc.)"
        )

    def _decline_referral_response(self):
        return (
            "That's completely fine. If you prefer, we can continue talking here. "
            "Would you like to share more about what has been happening?"
        )

    def _referral_suggestion(self):
        return (
            "\n\nIf these feelings continue or begin to feel overwhelming, "
            "speaking with a licensed mental health professional may also be helpful. "
            "If you would like, I can help you find counselors or psychologists in your parish."
        )

    def _jamaican_resources_text(self):
        """Return Jamaican-specific resources text"""
        return (
            "**🇯🇲 Jamaican Mental Health Resources:**\n"
            "• Jamaica Mental Health Helpline: **888-NEW-LIFE (639-5433)**\n"
            "• Ministry of Health Support Line: **888-639-5433**\n"
            "• Emergency Services: **119**"
        )

    # ========== Helper Methods ==========
    
    def _detect_emotion(self, text):
        for emotion, words in EMOTION_KEYWORDS.items():
            if any(w in text for w in words):
                return emotion
        return None

    def _suggest_app_resource(self, emotion):
        if emotion and emotion in APP_RESOURCES:
            resource = APP_RESOURCES[emotion]
            return (
                f"You might also find this helpful inside the app:\n\n"
                f"**{resource['title']}**\n"
                f"{resource['description']}\n"
                f"Open it here: {resource['link']}"
            )
        return ""

    def _should_suggest_referral(self, history):
        if not history:
            return False

        distress_words = [
            "stressed", "overwhelmed", "hopeless", "can't cope",
            "very anxious", "very sad", "can't take it", "too much"
        ]

        distress_count = 0
        for msg in history[-4:]:
            text = msg["content"].lower()
            if any(word in text for word in distress_words):
                distress_count += 1

        return distress_count >= 2

    def _is_positive(self, text):
        return any(word in text for word in POSITIVE_RESPONSES)

    def _is_negative(self, text):
        return any(word in text for word in NEGATIVE_RESPONSES)

    def _is_crisis(self, text):
        return any(word in text for word in CRISIS_KEYWORDS)

    def _system_prompt(self):
        return (
            "You are Paula, a compassionate emotional support assistant for users in Jamaica.\n\n"
            "Your role is to listen carefully, validate emotions, and encourage healthy reflection.\n\n"
            "Important guidelines:\n"
            "- You are not a doctor, psychologist, or therapist.\n"
            "- Never diagnose mental health conditions.\n"
            "- Offer supportive listening and practical coping suggestions.\n"
            "- Encourage professional help if distress continues.\n"
            "- Include Jamaican resources when appropriate.\n\n"
            "Communication style:\n"
            "- Warm, calm, and respectful\n"
            "- Clear standard English (Jamaican expressions are okay when appropriate)\n"
            "- Ask thoughtful follow-up questions\n"
            "- Focus on emotional support and practical guidance"
        )

    def _fallback(self):
        return (
            "I'm here with you. Sometimes talking things through can help. "
            "Would you like to share more about what's been on your mind?"
        )


# Singleton instance
_paula_client = None


def ask_paula(user_message: str, chat_history=None, session_id: str = None):
    """Main function to interact with Paula"""
    global _paula_client

    if _paula_client is None:
        _paula_client = PaulaClient()

    return _paula_client.generate_response(
        user_message,
        chat_history,
        session_id=session_id
    )