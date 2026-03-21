# app/ai/paula_client.py

import requests
import logging
import random
from typing import List, Dict, Optional
from datetime import datetime
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

HF_API_TOKEN = HF_TOKEN
MODEL_ID = "microsoft/DialoGPT-medium"

# -----------------------------
# JAMAICAN MENTAL HEALTH RESOURCES
# -----------------------------

CRISIS_HELP = """Need extra support right now? 💛
• Mental Health & Suicide Prevention Helpline: **888-NEW-LIFE (639-5433)** - 24/7
• Emergency Services: **119**
• Crisis Centre of Jamaica: **876-631-5244**
• Visit your nearest hospital emergency room
• Reach out to a trusted family member or friend

You don't have to go through this alone. Please reach out to someone who can help right now."""

SUPPORT_FOOTER = """Need extra support?
• Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE (639-5433) - 24/7
• Your nearest public hospital or health centre
• A trusted family member, friend, or community leader

If you're in immediate danger, please contact emergency services (119) or go to the nearest hospital."""

# Jamaican parishes and their hospitals
PARISH_RESOURCES = {
    "kingston": "Kingston Public Hospital - 876-922-2200 | Bellevue Hospital - 876-938-1211",
    "st. andrew": "Kingston Public Hospital - 876-922-2200 | University Hospital of the West Indies - 876-927-1620",
    "st. catherine": "Spanish Town Hospital - 876-984-3241 | Linstead Hospital - 876-985-2267",
    "clarendon": "May Pen Hospital - 876-902-2000 | Lionel Town Hospital - 876-983-5253",
    "manchester": "Mandeville Regional Hospital - 876-962-2200",
    "st. elizabeth": "Black River Hospital - 876-965-2200",
    "westmoreland": "Savanna-la-Mar Hospital - 876-955-2200",
    "hanover": "Noel Holmes Hospital - 876-956-2200",
    "st. james": "Cornwall Regional Hospital - 876-952-5100",
    "trelawny": "Falmouth Hospital - 876-954-3200",
    "st. ann": "St. Ann's Bay Hospital - 876-972-2272",
    "st. mary": "Port Maria Hospital - 876-994-2200",
    "portland": "Port Antonio Hospital - 876-993-2646",
    "st. thomas": "Princess Margaret Hospital - 876-982-2200"
}

# Bible verses for gentle encouragement
BIBLE_VERSES = {
    "anxiety": ["Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. - Philippians 4:6",
                "Cast all your anxiety on him because he cares for you. - 1 Peter 5:7"],
    "sadness": ["The Lord is close to the brokenhearted and saves those who are crushed in spirit. - Psalm 34:18",
                "He heals the brokenhearted and binds up their wounds. - Psalm 147:3"],
    "strength": ["I can do all things through Christ who strengthens me. - Philippians 4:13",
                 "My grace is sufficient for you, for my power is made perfect in weakness. - 2 Corinthians 12:9"],
    "hope": ["For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11",
             "But those who hope in the Lord will renew their strength. - Isaiah 40:31"],
    "peace": ["Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid. - John 14:27"]
}

# Coping strategies by emotion
COPING_STRATEGIES = {
    "anxious": [
        "Take 5 deep breaths with me - breathe in for 4 counts, hold for 4, out for 4.",
        "Try grounding yourself: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
        "Sometimes stepping outside for a few minutes of fresh air can help calm the mind.",
        "Would writing down what's worrying you help to get it out of your head?"
    ],
    "sad": [
        "Be gentle with yourself today. Sometimes just getting through the day is enough.",
        "Is there a small thing you could do that might bring you a little comfort? A warm cup of tea, your favorite song?",
        "Reaching out to someone you trust can help lighten the load.",
        "Even small steps matter. What's one tiny thing you can do for yourself right now?"
    ],
    "angry": [
        "That anger is valid. Sometimes stepping away for a moment can help clear your head.",
        "Would going for a walk or moving your body help release some of that energy?",
        "Writing down what's frustrating you can sometimes help make sense of it.",
        "Taking slow, deep breaths can help when the anger feels overwhelming."
    ],
    "tired": [
        "Rest isn't a luxury - it's necessary. Give yourself permission to pause if you can.",
        "Sometimes tiredness is our body telling us we need to slow down. Can you take a short break?",
        "Be kind to yourself today. You're doing the best you can."
    ],
    "lost": [
        "Feeling lost is so hard. Sometimes just naming where we are helps. What's one thing you know for sure right now?",
        "When everything feels unclear, focusing on one small step can help. What's one thing you can do today?",
        "It's okay not to have all the answers right now. You don't have to figure everything out at once."
    ],
    "overwhelmed": [
        "When everything feels like too much, try focusing on just one thing at a time.",
        "Can you take 5 minutes just for yourself right now? Sometimes a short pause helps.",
        "Would breaking things down into smaller pieces make it feel more manageable?",
        "You don't have to carry all of this alone. Is there someone you can reach out to?"
    ]
}

# Crisis keywords
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "end my life",
    "self harm", "hurt myself", "no reason to live",
    "overdose", "hang myself", "don't want to be here"
]

JAMAICAN_PARISHES = list(PARISH_RESOURCES.keys()) + ["st andrew", "st catherine", "st james", "st ann", "st mary", "st thomas", "st elizabeth"]

# -----------------------------
# PAULA CLIENT
# -----------------------------

class PaulaClient:
    def __init__(self):
        self.endpoint = f"https://router.huggingface.co/hf-inference/models/{MODEL_ID}"
        self.headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        self.sessions = {}
        logger.info(f"✅ PaulaClient initialized")

    def generate_response(self, user_message: str, history=None, session_id=None, summary=None):
        """Main entry point for generating responses"""
        
        # Check for crisis first
        if self._is_crisis(user_message):
            return self._crisis_response()
        
        # Detect emotion and intent
        emotion = self._detect_emotion(user_message)
        intent = self._detect_intent(user_message)
        
        logger.info(f"🎭 Emotion: {emotion}, Intent: {intent}")
        
        # Build context-aware response
        response = self._build_response(user_message, emotion, intent, history)
        
        # Add appropriate support footer for emotional concerns
        if emotion in ["sad", "anxious", "angry", "overwhelmed", "lost"]:
            response += f"\n\n{SUPPORT_FOOTER}"
        
        return response
    
    def _is_crisis(self, text: str) -> bool:
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in CRISIS_KEYWORDS)
    
    def _crisis_response(self) -> str:
        return f"""I hear how much pain you're in right now, and I'm really concerned about you. 💛

Please reach out to someone who can help right away:
• Mental Health Helpline: **888-NEW-LIFE (639-5433)** - 24/7
• Emergency Services: **119**
• Crisis Centre of Jamaica: **876-631-5244**

You don't have to carry this alone. Please reach out to a trusted family member, friend, or go to your nearest hospital. You matter, and there are people who want to help you through this.

{CRISIS_HELP}"""
    
    def _detect_emotion(self, text: str) -> str:
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["lost", "don't know what to do", "no direction"]):
            return "lost"
        if any(word in text_lower for word in ["overwhelmed", "too much", "can't cope"]):
            return "overwhelmed"
        if any(word in text_lower for word in ["sad", "depressed", "down", "empty"]):
            return "sad"
        if any(word in text_lower for word in ["anxious", "worried", "nervous", "stressed"]):
            return "anxious"
        if any(word in text_lower for word in ["angry", "mad", "frustrated", "annoyed"]):
            return "angry"
        if any(word in text_lower for word in ["tired", "exhausted", "drained", "no energy"]):
            return "tired"
        if any(word in text_lower for word in ["falling behind", "behind", "not enough"]):
            return "overwhelmed"
        
        return "neutral"
    
    def _detect_intent(self, text: str) -> str:
        text_lower = text.lower()
        
        # Check for referral intent
        if any(word in text_lower for word in ["therapist", "counselor", "psychologist", "help near me", "where can i go", "professional help"]):
            return "referral"
        
        # Check for coping strategy request
        if any(word in text_lower for word in ["what can i do", "help me", "advice", "suggestion"]):
            return "coping"
        
        return "conversation"
    
    def _build_response(self, message: str, emotion: str, intent: str, history: List[Dict]) -> str:
        """Build a natural, empathetic response"""
        
        # First, try to get AI response
        ai_response = self._try_ai_response(message, history)
        if ai_response and len(ai_response) > 20:
            return ai_response
        
        # Fall back to crafted responses based on emotion and context
        return self._crafted_response(message, emotion, intent, history)
    
    def _try_ai_response(self, message: str, history: List[Dict]) -> Optional[str]:
        """Try to get AI-generated response, return None if fails"""
        try:
            conversation = self._system_prompt() + "\n\n"
            
            if history:
                for msg in history[-6:]:
                    if msg.get("role") == "user":
                        conversation += f"User: {msg.get('content')}\n"
                    else:
                        conversation += f"Paula: {msg.get('content')}\n"
            
            conversation += f"User: {message}\nPaula:"
            
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "inputs": conversation,
                    "parameters": {
                        "temperature": 0.8,
                        "max_new_tokens": 120,
                        "top_p": 0.9,
                        "do_sample": True,
                        "return_full_text": False
                    }
                },
                timeout=20
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated = result[0].get('generated_text', '')
                    if generated:
                        generated = generated.replace("User:", "").replace("Paula:", "").strip()
                        if len(generated) > 10:
                            return generated
            return None
            
        except Exception as e:
            logger.error(f"AI response error: {e}")
            return None
    
    def _crafted_response(self, message: str, emotion: str, intent: str, history: List[Dict]) -> str:
        """Create crafted responses when AI fails"""
        
        msg_lower = message.lower()
        
        # Handle referral intent
        if intent == "referral":
            return self._handle_referral(message)
        
        # Handle coping strategy requests
        if intent == "coping":
            return self._get_coping_strategy(emotion, message)
        
        # Handle different emotions with natural conversation flow
        if emotion == "lost":
            return self._handle_lost(message, history)
        
        elif emotion == "overwhelmed":
            return self._handle_overwhelmed(message, history)
        
        elif emotion == "sad":
            return self._handle_sad(message, history)
        
        elif emotion == "anxious":
            return self._handle_anxious(message, history)
        
        elif emotion == "angry":
            return self._handle_angry(message, history)
        
        elif emotion == "tired":
            return self._handle_tired(message, history)
        
        # Default empathetic response
        return self._default_response(message, history)
    
    def _handle_lost(self, message: str, history: List[Dict]) -> str:
        """Handle when user feels lost"""
        responses = [
            "Feeling lost can be so disorienting. You don't have to have it all figured out right now. What's one thing that feels clear to you, even if it's small? 💛",
            "It's okay not to know the next step. Sometimes just acknowledging where you are is enough for now. What's been on your mind most lately?",
            "I hear that you're feeling uncertain about your path. You're not alone in this. Would talking through what's on your mind help make things a bit clearer?"
        ]
        return random.choice(responses)
    
    def _handle_overwhelmed(self, message: str, history: List[Dict]) -> str:
        """Handle when user feels overwhelmed"""
        responses = [
            "When everything feels like too much, it helps to take a breath and focus on just one thing. What's the one thing weighing on you most right now?",
            "That feeling of being overwhelmed is so real. You don't have to carry all of this alone. Would breaking things down into smaller pieces help?",
            "I hear you. Life can feel so heavy sometimes. What would feel most helpful right now - talking it through, or finding a small step forward?",
            f"{random.choice(COPING_STRATEGIES['overwhelmed'])}"
        ]
        return random.choice(responses)
    
    def _handle_sad(self, message: str, history: List[Dict]) -> str:
        """Handle when user feels sad"""
        responses = [
            "I hear that sadness, and it's completely okay to feel this way. Sadness tells us that something matters to us. What's been on your heart lately?",
            "You're not alone in this. Even on the hard days, you matter. Is there anything that usually brings you a little comfort when you're feeling this way?",
            "It takes courage to share when you're feeling down. I'm here with you. Would talking about what's weighing on you help lighten the load even a little?"
        ]
        return random.choice(responses)
    
    def _handle_anxious(self, message: str, history: List[Dict]) -> str:
        """Handle when user feels anxious"""
        coping = random.choice(COPING_STRATEGIES['anxious'])
        responses = [
            f"That anxiety is real and valid. {coping}",
            "When anxiety shows up, it's your mind trying to protect you. Can we take a moment to breathe together? In... and out... What's one thing you notice around you right now?",
            "I hear that worry in your voice. Sometimes naming what we're anxious about helps it feel less big. What's the thought that's been circling your mind most?"
        ]
        return random.choice(responses)
    
    def _handle_angry(self, message: str, history: List[Dict]) -> str:
        """Handle when user feels angry"""
        coping = random.choice(COPING_STRATEGIES['angry'])
        responses = [
            f"Your anger makes sense. That energy needs somewhere to go. {coping}",
            "Anger often tells us that something important has been hurt or crossed. What's the thing that feels most unfair right now?",
            "I hear that frustration. You have every right to feel what you're feeling. Would moving your body for a few minutes help release some of that energy?"
        ]
        return random.choice(responses)
    
    def _handle_tired(self, message: str, history: List[Dict]) -> str:
        """Handle when user feels tired"""
        coping = random.choice(COPING_STRATEGIES['tired'])
        responses = [
            f"That tiredness sounds deep. {coping}",
            "When you're this tired, everything feels harder. Is there any way you can give yourself permission to rest right now, even for a few minutes?",
            "Your body and mind are telling you they need care. What's the kindest thing you could do for yourself in this moment?"
        ]
        return random.choice(responses)
    
    def _handle_referral(self, message: str) -> str:
        """Handle requests for professional help"""
        parish = self._extract_parish(message)
        
        if parish and parish in PARISH_RESOURCES:
            return f"""I appreciate you asking about getting support. That's a really important step. 💛

**In {parish.title()}:**
{PARISH_RESOURCES[parish]}

**For immediate support:**
• Mental Health Helpline: 888-NEW-LIFE (639-5433) - 24/7
• You can also visit your nearest public health centre for referrals to mental health services

Taking this step shows real strength. Would you like me to share more about what to expect when you reach out?"""
        
        else:
            return """I'm glad you're thinking about getting support. That's a brave step. 💛

**Here are some places to start:**
• Mental Health Helpline: 888-NEW-LIFE (639-5433) - 24/7
• Your nearest public hospital or health centre
• Ask your family doctor for a referral

If you're comfortable sharing which parish you're in, I can give you more specific resources. Would that help?"""
    
    def _get_coping_strategy(self, emotion: str, message: str) -> str:
        """Provide coping strategies based on emotion"""
        if emotion in COPING_STRATEGIES:
            strategy = random.choice(COPING_STRATEGIES[emotion])
            return f"{strategy} What feels manageable for you right now?"
        
        return "Sometimes taking just one small step can help. Is there one thing - even a tiny thing - you could do for yourself right now? 💛"
    
    def _default_response(self, message: str, history: List[Dict]) -> str:
        """Default empathetic response"""
        responses = [
            "I hear you. Tell me a little more about what's on your mind? 💛",
            "Thank you for sharing that with me. What's been weighing on you most lately?",
            "I'm here with you. What feels most important to talk about right now?"
        ]
        return random.choice(responses)
    
    def _extract_parish(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for parish in JAMAICAN_PARISHES:
            if parish in text_lower:
                return parish
        return None
    
    def _system_prompt(self) -> str:
        return """You are Paula, a warm, compassionate mental health support assistant serving people in Jamaica. You speak with empathy and cultural warmth.

Your role:
- Listen actively and validate feelings
- Offer gentle coping strategies when appropriate
- Guide users toward real-world support when needed
- Be natural and conversational, not robotic
- Use standard English with light Jamaican expressions naturally
- Keep responses warm, encouraging, and helpful

You are not a therapist, doctor, or crisis service. You don't diagnose or provide medical treatment.
For crisis situations, provide emergency resources immediately.

Be caring, present, and helpful. Respond like a supportive friend who truly cares."""
    
    def _extract_parish(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for parish in JAMAICAN_PARISHES:
            if parish in text_lower:
                return parish
        return None


# -----------------------------
# PUBLIC FUNCTIONS
# -----------------------------

_client = None

def ask_paula(user_message: str, chat_history=None, session_id=None, summary=None):
    global _client
    
    if _client is None:
        _client = PaulaClient()
        logger.info("✅ PaulaClient initialized")
    
    return _client.generate_response(user_message, chat_history, session_id, summary)


def detect_emotion_ai(text: str) -> str:
    return _client._detect_emotion(text) if _client else "neutral"


def summarize_memory(history: List[Dict]) -> str:
    if not history:
        return ""
    
    topics = set()
    for msg in history[-8:]:
        content = msg.get("content", "").lower()
        if "work" in content or "job" in content:
            topics.add("work")
        if "family" in content or "friend" in content:
            topics.add("relationships")
        if "anxious" in content or "stress" in content:
            topics.add("anxiety/stress")
        if "sad" in content or "lost" in content:
            topics.add("emotional struggles")
    
    if topics:
        return f"Previously discussed: {', '.join(topics)}"
    return ""