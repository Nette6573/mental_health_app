# app/ai/paula_client.py - Updated with HTML clickable links

import requests
import logging
import random
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

HF_API_TOKEN = HF_TOKEN
MODEL_ID = "microsoft/DialoGPT-medium"

# -----------------------------
# COMPREHENSIVE MENTAL HEALTH SCENARIOS
# -----------------------------

# Crisis Keywords - Immediate emergency response
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "end my life", "self harm", 
    "hurt myself", "no reason to live", "overdose", "hang myself", 
    "don't want to be here", "better off dead"
]

# All possible mental health scenarios with appropriate responses
MENTAL_HEALTH_SCENARIOS = {
    "depression": {
        "keywords": ["depressed", "depression", "hopeless", "worthless", "empty", "numb", "no motivation", "can't get out of bed"],
        "validation": "Depression is more than just sadness - it's a heavy weight that affects everything. What you're feeling is real and valid.",
        "coping": [
            "Even small steps matter. Can you do one tiny thing for yourself today? Just one.",
            "Depression lies to us. It tells us nothing matters. But you matter, even when you can't feel it.",
            "Reaching out is hard when you're depressed. I'm proud of you for being here."
        ],
        "resource_type": "professional"
    },
    "anxiety": {
        "keywords": ["anxious", "anxiety", "panic", "worried", "racing thoughts", "can't relax", "on edge", "fear"],
        "validation": "Anxiety is your body's alarm system going off when it doesn't need to. It's exhausting and overwhelming.",
        "coping": [
            "Take 5 deep breaths with me. In for 4, hold for 4, out for 4.",
            "Try grounding: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
            "Anxiety feels urgent, but you're safe right now. Let's breathe together."
        ],
        "resource_type": "professional"
    },
    "stress": {
        "keywords": ["stressed", "overwhelmed", "too much", "pressure", "burnout", "can't cope", "falling behind"],
        "validation": "Stress is real and it affects everything - your body, your mind, your spirit.",
        "coping": [
            "Pick just ONE thing to focus on. Forget the rest for now.",
            "When everything is urgent, nothing is. What can wait until tomorrow?",
            "Your body needs rest to handle stress. When did you last take a real break?"
        ],
        "resource_type": "self_help"
    },
    "grief": {
        "keywords": ["grief", "loss", "died", "passed away", "mourning", "lost someone", "bereavement"],
        "validation": "Grief is love with nowhere to go. There's no right way to grieve, and no timeline.",
        "coping": [
            "Grief comes in waves. Let yourself feel whatever comes - sadness, anger, numbness. All of it is okay.",
            "Would sharing a memory of your loved one help? Sometimes remembering helps us carry them with us.",
            "Be gentle with yourself. Grief takes as long as it takes.",
            "Many find comfort in faith during times of loss. Our Faith Resources section has scriptures, prayers, and spiritual support that may help."
        ],
        "resource_type": "faith_based"
    },
    "relationship_issues": {
        "keywords": ["relationship", "partner", "boyfriend", "girlfriend", "marriage", "breakup", "cheating", "trust issues", "arguing"],
        "validation": "Relationship pain cuts deep. When someone we care about hurts us, it shakes our foundation.",
        "coping": [
            "Your feelings are valid. Take space to feel them before making any big decisions.",
            "Healthy relationships require trust, respect, and communication. What do you need right now?",
            "It's okay to set boundaries. Your peace matters."
        ],
        "resource_type": "faith_based"
    },
    "family_conflict": {
        "keywords": ["family", "parent", "mother", "father", "sibling", "home", "arguing with family", "family issues"],
        "validation": "Family can be both our greatest support and our deepest pain. It's complicated.",
        "coping": [
            "Sometimes the healthiest thing is space. It's okay to step back when you need to.",
            "Family dynamics are hard. What would feel most helpful right now?",
            "You can love your family AND set boundaries. Both can be true."
        ],
        "resource_type": "faith_based"
    },
    "friendship_betrayal": {
        "keywords": ["friend", "friends", "betrayed", "backstab", "gossip", "trust", "behind my back", "friend let me down"],
        "validation": "Betrayal by someone you trust cuts deep. Your hurt is completely understandable.",
        "coping": [
            "Trust broken takes time to heal. Give yourself permission to feel hurt.",
            "Real friends don't make you question your worth. You deserve people who see your value.",
            "Sometimes losing a friend makes room for healthier connections."
        ],
        "resource_type": "faith_based"
    },
    "exam_stress": {
        "keywords": ["exam", "test", "study", "notes", "remember", "forget", "principles of marketing", "fail", "pass", "grades"],
        "validation": "Exam pressure is intense. Your brain is working hard, even when it doesn't feel like it.",
        "coping": [
            "Study for 25 minutes, then take a 5-minute break. Your brain needs rest to absorb.",
            "Try explaining what you're learning out loud. Teaching helps memory.",
            "Sleep is when your brain organizes what you've learned. Don't skip rest for cramming.",
            "You know more than you think. Anxiety is blocking it, not your ability."
        ],
        "resource_type": "self_help"
    },
    "work_stress": {
        "keywords": ["work", "job", "boss", "coworker", "deadline", "pressure", "career", "unemployed", "laid off"],
        "validation": "Work stress follows you home. It's hard to separate your worth from your work.",
        "coping": [
            "Your job doesn't define your value as a person. You are more than your work.",
            "Set boundaries. You can't pour from an empty cup.",
            "What's one boundary you can set this week to protect your peace?"
        ],
        "resource_type": "self_help"
    },
    "low_self_esteem": {
        "keywords": ["worthless", "not good enough", "failure", "useless", "can't do anything right", "hate myself"],
        "validation": "When you're carrying that voice that says you're not enough, it's exhausting. That voice is lying to you.",
        "coping": [
            "Would you talk to a friend the way you talk to yourself? Try being as kind to yourself as you are to others.",
            "You are worthy. Not because of what you do, but because you exist.",
            "What's one thing you did today, no matter how small, that you can acknowledge?",
            "Our Faith Resources section has encouraging scriptures about your worth and value."
        ],
        "resource_type": "faith_based"
    },
    "loneliness": {
        "keywords": ["lonely", "alone", "isolated", "no one cares", "no friends", "nobody understands"],
        "validation": "Loneliness hurts even when you're surrounded by people. Connection matters deeply.",
        "coping": [
            "You're not alone in feeling alone. So many people feel this way. Reaching out is brave.",
            "Sometimes one small connection - a text, a call, a shared smile - can help.",
            "Would you be willing to reach out to one person today, even just to say hello?",
            "Our Faith Resources section also has community support and spiritual connection options."
        ],
        "resource_type": "faith_based"
    },
    "anger": {
        "keywords": ["angry", "mad", "frustrated", "rage", "annoyed", "furious"],
        "validation": "Anger tells us something important has been crossed or hurt. Your anger is valid.",
        "coping": [
            "Anger needs to move. Try walking, running, or even squeezing a pillow.",
            "Write down what's making you angry. Sometimes getting it out helps release it.",
            "Step away before responding. Give yourself space to breathe."
        ],
        "resource_type": "self_help"
    },
    "hopelessness": {
        "keywords": ["hopeless", "no future", "never get better", "what's the point", "give up"],
        "validation": "Hopelessness is heavy. When you can't see a way forward, even getting through the day takes everything.",
        "coping": [
            "Hopelessness lies. It says things won't change. But feelings aren't facts.",
            "Can you focus on just the next hour? The next 10 minutes? You don't have to see the whole path.",
            "You've made it through 100% of your hardest days so far. That's strength.",
            "Sometimes faith can provide a light when everything feels dark. Our Faith Resources section offers spiritual encouragement."
        ],
        "resource_type": "faith_based",
        "crisis_risk": True
    }
}

# Comprehensive Resource Links with HTML clickable links
BASE_URL = "https://hopepath.online"  # Your domain

# Helper function to create HTML clickable link
def make_link(text: str, url: str) -> str:
    return f'<a href="{url}" target="_blank" rel="noopener noreferrer" style="color: #8b5cf6; text-decoration: underline;">{text}</a>'

RESOURCES = {
    "professional": {
        "title": "Professional Mental Health Support",
        "description": "Licensed counselors, psychologists, and mental health services in Jamaica.",
        "url": f"{BASE_URL}/dashboard/therapists",
        "display_text": "View Professional Mental Health Support"
    },
    "faith_based": {
        "title": "Faith-Based Support & Counseling",
        "description": "Spiritual guidance, pastoral counseling, and faith communities. Find scripture, prayer support, and encouragement.",
        "url": f"{BASE_URL}/dashboard/resources/faith",
        "display_text": "View Faith-Based Support & Counseling",
        "features": ["Daily Devotional", "Prayer Wall", "Scripture Study", "Faith Community", "Spiritual Practices"]
    },
    "self_help": {
        "title": "Self-Help Tools & Coping Strategies",
        "description": "Practical tools, exercises, and techniques for managing mental health.",
        "url": f"{BASE_URL}/dashboard/resources/self-help",
        "display_text": "View Self-Help Tools"
    },
    "crisis": {
        "title": "Crisis Support - Immediate Help",
        "description": "24/7 crisis support and emergency services.",
        "url": f"{BASE_URL}/dashboard/resources/crisis",
        "display_text": "View Crisis Support"
    },
    "community": {
        "title": "Community Support Groups",
        "description": "Connect with others who understand what you're going through.",
        "url": f"{BASE_URL}/dashboard/resources/community",
        "display_text": "View Community Support"
    }
}

# Parish resources for local referrals
PARISH_RESOURCES = {
    "kingston": "Kingston Public Hospital - 876-922-2200 | Bellevue Hospital - 876-938-1211",
    "st. andrew": "Kingston Public Hospital - 876-922-2200 | University Hospital - 876-927-1620",
    "st. catherine": "Spanish Town Hospital - 876-984-3241 | Linstead Hospital - 876-985-2267",
    "clarendon": "May Pen Hospital - 876-902-2000",
    "manchester": "Mandeville Regional Hospital - 876-962-2200",
    "st. james": "Cornwall Regional Hospital - 876-952-5100",
    "st. ann": "St. Ann's Bay Hospital - 876-972-2272",
    "st. mary": "Port Maria Hospital - 876-994-2200",
    "portland": "Port Antonio Hospital - 876-993-2646",
    "st. thomas": "Princess Margaret Hospital - 876-982-2200",
    "st. elizabeth": "Black River Hospital - 876-965-2200",
    "westmoreland": "Savanna-la-Mar Hospital - 876-955-2200",
    "hanover": "Noel Holmes Hospital - 876-956-2200",
    "trelawny": "Falmouth Hospital - 876-954-3200"
}

# Mental health screening questions
SCREENING_QUESTIONS = [
    "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
    "Over the past two weeks, how often have you had little interest or pleasure in doing things?",
    "Over the past two weeks, how often have you felt nervous, anxious, or on edge?",
    "Over the past two weeks, how often have you had trouble sleeping?",
    "Over the past two weeks, how often have you felt tired or had little energy?"
]

# Referral prompts
REFERRAL_PROMPTS = [
    "💛 Would you like me to share some resources that might help?",
    "You don't have to go through this alone. Would you like to see some resources we have available?",
    "Sometimes having the right resources makes all the difference. Would you like me to share some support options?",
    "We have resources designed to help with exactly what you're going through. Would you like to see them?",
    "Your feelings matter, and you deserve support. Would you like me to share some resources?"
]

JAMAICAN_PARISHES = list(PARISH_RESOURCES.keys())

# Session state tracking
class SessionState:
    def __init__(self):
        self.waiting_for_parish = False
        self.referral_offered = False
        self.resource_offered = False
        self.screening_asked = False
        self.detected_scenario = None
        self.resource_type_shown = set()

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
        self.sessions: Dict[str, SessionState] = {}
        logger.info(f"✅ PaulaClient initialized")

    def get_session(self, session_id: str) -> SessionState:
        if session_id not in self.sessions:
            self.sessions[session_id] = SessionState()
        return self.sessions[session_id]

    def generate_response(self, user_message: str, history=None, session_id=None, summary=None):
        """Main entry point - handles ALL mental health scenarios"""
        
        # CRISIS FIRST - always prioritize
        if self._is_crisis(user_message):
            return self._crisis_response()
        
        # Get session state
        state = self.get_session(session_id) if session_id else None
        
        # Handle parish response if waiting
        if state and state.waiting_for_parish:
            response = self._handle_parish_response(user_message, session_id)
            if response:
                return response
        
        # Handle response to resource offer
        if state and state.resource_offered and self._is_positive_response(user_message):
            state.resource_offered = False
            return self._show_resources(state)
        
        # Detect which scenario the user is experiencing
        scenario = self._detect_scenario(user_message)
        if scenario:
            state.detected_scenario = scenario
        
        # Build appropriate response
        if scenario:
            response = self._handle_scenario(user_message, scenario, state, history)
        else:
            response = self._handle_general(user_message, state, history)
        
        return response
    
    def _is_crisis(self, text: str) -> bool:
        return any(k in text.lower() for k in CRISIS_KEYWORDS)
    
    def _crisis_response(self) -> str:
        crisis = RESOURCES["crisis"]
        return f"""🚨 **I'm really concerned about you.** 🚨

What you're feeling right now is heavy, and you don't have to carry it alone.

**Please reach out immediately:**
• 📞 **Mental Health Helpline:** 888-NEW-LIFE (639-5433) - 24/7
• 🚑 **Emergency Services:** 119
• 🏥 **Your nearest hospital emergency room**
• 👥 **A trusted family member or friend**

**Crisis resources:**
{make_link(crisis['display_text'], crisis['url'])}

You matter. Please reach out to someone who can help right now. 💛"""
    
    def _detect_scenario(self, text: str) -> Optional[str]:
        """Detect which mental health scenario the user is experiencing"""
        text_lower = text.lower()
        
        for scenario, data in MENTAL_HEALTH_SCENARIOS.items():
            for keyword in data["keywords"]:
                if keyword in text_lower:
                    return scenario
        return None
    
    def _handle_scenario(self, message: str, scenario: str, state: SessionState, history: List[Dict]) -> str:
        """Handle specific mental health scenario"""
        scenario_data = MENTAL_HEALTH_SCENARIOS[scenario]
        
        # Get validation and coping
        validation = scenario_data["validation"]
        coping = random.choice(scenario_data["coping"])
        
        # Build response
        response = f"{validation}\n\n{coping}"
        
        # Ask follow-up question
        follow_up = self._get_follow_up(scenario, message)
        if follow_up:
            response += f"\n\n{follow_up}"
        
        # Add screening question (if not already asked)
        if not state.screening_asked and random.random() < 0.3:
            screening = random.choice(SCREENING_QUESTIONS)
            response += f"\n\n💭 **Quick check-in:** {screening}"
            state.screening_asked = True
        
        # Offer resources (if not already offered)
        if not state.resource_offered and random.random() < 0.4:
            response += f"\n\n{random.choice(REFERRAL_PROMPTS)}"
            state.resource_offered = True
            state.detected_scenario = scenario
        
        return response
    
    def _get_follow_up(self, scenario: str, message: str) -> str:
        """Get appropriate follow-up question based on scenario"""
        follow_ups = {
            "depression": "What's been weighing on your heart most lately?",
            "anxiety": "What's the thought that's been circling your mind most?",
            "stress": "What's the one thing weighing on you most right now?",
            "grief": "Would sharing a memory of your loved one help?",
            "relationship_issues": "What would feel most helpful to talk about right now?",
            "friendship_betrayal": "What happened? I'm here to listen.",
            "exam_stress": "What's one topic you feel you know even a little about?",
            "low_self_esteem": "What's one thing you did today, no matter how small, that you can acknowledge?",
            "loneliness": "Would you be willing to reach out to one person today, even just to say hello?",
            "anger": "What's the thing that feels most unfair right now?",
            "hopelessness": "Can we focus on just the next hour? You don't have to see the whole path."
        }
        return follow_ups.get(scenario, "What's on your mind right now?")
    
    def _handle_general(self, message: str, state: SessionState, history: List[Dict]) -> str:
        """Handle general conversation when no specific scenario detected"""
        
        # Check if user is asking about resources
        if any(w in message.lower() for w in ["resources", "help", "support", "what can i do", "where can i go"]):
            return self._show_resources(state)
        
        # Check if user wants professional help
        if any(w in message.lower() for w in ["therapist", "counselor", "psychologist", "professional"]):
            if state:
                state.waiting_for_parish = True
            return "I'm glad you're asking about professional support. Which parish are you located in? I can share resources in your area."
        
        # Default empathetic responses
        responses = [
            "I'm here for you. What's been on your mind lately? 💛",
            "Thank you for sharing. What would feel most helpful to talk about right now?",
            "I'm listening. Tell me what's weighing on you today.",
            "You're not alone in this. What's been happening?"
        ]
        response = random.choice(responses)
        
        # Offer resources after a few exchanges
        if state and not state.resource_offered and history and len(history) > 4:
            response += f"\n\n{random.choice(REFERRAL_PROMPTS)}"
            state.resource_offered = True
        
        return response
    
    def _handle_parish_response(self, text: str, session_id: str) -> Optional[str]:
        """Handle user's parish response and provide local resources"""
        parish = self._extract_parish(text)
        
        if parish and parish in PARISH_RESOURCES:
            if session_id in self.sessions:
                self.sessions[session_id].waiting_for_parish = False
            
            return f"""Thank you. Here are resources in {parish.title()}:

🏥 **Hospital/Health Centre:** {PARISH_RESOURCES[parish]}

📞 **Mental Health Helpline:** 888-NEW-LIFE (639-5433) - 24/7

You can also visit your nearest public health centre and ask about mental health services.

Would you like to see the resources available on our platform?"""
        
        elif parish:
            return f"I don't have specific resources for {parish} yet, but you can contact the Mental Health Helpline at 888-NEW-LIFE (639-5433) for support in your area. Would you like to see the resources on our platform instead?"
        
        else:
            return "I want to help you find the right resources. Which parish are you located in? (e.g., Kingston, St. Catherine, Manchester, St. James, etc.)"
    
    def _show_resources(self, state: SessionState) -> str:
        """Show appropriate resources with HTML clickable links"""
        
        # Determine which resource types to show
        resource_types = ["faith_based", "professional", "self_help", "community"]
        
        # Build response with HTML clickable links
        response = "**Here are resources that might help:**\n\n"
        
        for rt in resource_types:
            if rt in RESOURCES:
                res = RESOURCES[rt]
                response += f"**📌 {res['title']}**\n"
                response += f"{res['description']}\n"
                
                # Special handling for faith resources with features
                if rt == "faith_based" and "features" in res:
                    response += f"✨ **Includes:** "
                    response += ", ".join(res['features'][:4])
                    response += "\n"
                
                # Create HTML clickable link
                response += f"🔗 {make_link(res['display_text'], res['url'])}\n\n"
        
        # Add helpline
        response += "---\n\n"
        response += "📞 **Need to talk to someone right now?**\n"
        response += "Call **888-NEW-LIFE (639-5433)** - 24/7, 365 days a year\n\n"
        response += "Would you like me to help you find professional support in your area? (You can tell me your parish)"
        
        state.resource_offered = True
        return response
    
    def _is_positive_response(self, text: str) -> bool:
        positive = ["yes", "sure", "okay", "ok", "please", "would love", "help me", "yes please", "that would be helpful", "yeah", "yep", "definitely", "show me", "share"]
        return any(w in text.lower() for w in positive)
    
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
    scenario = _client._detect_scenario(text) if _client else None
    if scenario:
        emotion_map = {
            "depression": "sad",
            "anxiety": "anxious",
            "stress": "stressed",
            "anger": "angry",
            "grief": "sad",
            "hopelessness": "sad",
            "loneliness": "sad",
            "low_self_esteem": "sad"
        }
        return emotion_map.get(scenario, "neutral")
    return "neutral"


def summarize_memory(history: List[Dict]) -> str:
    if not history:
        return ""
    
    scenarios = set()
    for msg in history[-10:]:
        content = msg.get("content", "").lower()
        for scenario, data in MENTAL_HEALTH_SCENARIOS.items():
            for keyword in data["keywords"]:
                if keyword in content:
                    scenarios.add(scenario.replace("_", " "))
                    break
    
    if scenarios:
        return f"Previously discussed: {', '.join(list(scenarios)[:3])}"
    return ""