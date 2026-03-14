import os
import requests
from typing import List, Dict, Optional
from datetime import datetime

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"

# Crisis keywords for immediate detection
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "end my life", 
    "self harm", "hurt myself", "no reason to live", 
    "overdose", "hang myself"
]

# Behavioral indicators that might suggest professional support would be beneficial
BEHAVIORAL_INDICATORS = {
    "sleep_changes": ["can't sleep", "insomnia", "sleeping too much", "tired all the time", "no energy"],
    "appetite_changes": ["not eating", "lost appetite", "eating too much", "weight loss", "weight gain"],
    "mood_changes": ["always sad", "feel empty", "numb", "hopeless", "no interest", "nothing matters"],
    "anxiety": ["always worried", "can't relax", "panic", "racing thoughts", "on edge"],
    "withdrawal": ["don't want to see people", "isolating", "avoid friends", "stay in bed"],
    "concentration": ["can't focus", "forgetful", "scattered", "can't concentrate"],
    "hopelessness": ["what's the point", "no future", "never get better", "give up"]
}

# Jamaican parishes list for validation
JAMAICAN_PARISHES = [
    "kingston", "st. andrew", "st andrew", "st. catherine", "st catherine", 
    "clarendon", "manchester", "st. elizabeth", "st elizabeth", "westmoreland", 
    "hanover", "st. james", "st james", "trelawny", "st. ann", "st ann", 
    "st. mary", "st mary", "portland", "st. thomas", "st thomas"
]

# Sample psychologist database (in production, this would come from a real database)
JAMAICA_PSYCHOLOGISTS = [
    {
        "name": "Dr. Karen Brown",
        "type": "Clinical Psychologist",
        "location": "Kingston",
        "contact": "876-555-0123",
        "address": "20 Hope Road, Kingston 6",
        "specialties": ["Depression", "Anxiety", "Trauma"],
        "parish": "Kingston"
    },
    {
        "name": "Michael Thompson, MSc",
        "type": "Counseling Psychologist",
        "location": "Montego Bay",
        "contact": "876-555-0456",
        "address": "15 Market Street, Montego Bay",
        "specialties": ["Stress Management", "Relationship Issues", "Grief"],
        "parish": "St. James"
    },
    {
        "name": "Dr. Patricia Williams",
        "type": "Psychiatrist",
        "location": "Kingston",
        "contact": "876-555-0789",
        "address": "3 Gibraltar Road, Kingston 8",
        "specialties": ["Mood Disorders", "Anxiety Disorders"],
        "parish": "Kingston"
    },
    {
        "name": "Sarah Johnson, MSc",
        "type": "Therapist",
        "location": "Ocho Rios",
        "contact": "876-555-0321",
        "address": "42 Main Street, Ocho Rios",
        "specialties": ["Cognitive Behavioral Therapy", "Panic Disorders"],
        "parish": "St. Ann"
    },
    {
        "name": "Dr. Mark Taylor",
        "type": "Clinical Psychologist",
        "location": "Mandeville",
        "contact": "876-555-0654",
        "address": "7 Manchester Road, Mandeville",
        "specialties": ["Depression", "Bipolar Disorder"],
        "parish": "Manchester"
    },
    {
        "name": "Dr. Susan Campbell",
        "type": "Clinical Psychologist",
        "location": "Spanish Town",
        "contact": "876-555-0891",
        "address": "10 Burke Road, Spanish Town",
        "specialties": ["Anxiety", "PTSD", "Grief"],
        "parish": "St. Catherine"
    },
    {
        "name": "Robert Francis, MSc",
        "type": "Counselor",
        "location": "Portmore",
        "contact": "876-555-0234",
        "address": "5 Portmore Pines Plaza, Portmore",
        "specialties": ["Stress Management", "Relationship Issues"],
        "parish": "St. Catherine"
    }
]

class PaulaClient:
    def __init__(self, model: str = MODEL_ID):
        self.model = model
        self.endpoint = f"https://api-inference.huggingface.co/models/{model}"
        self.headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        # Store referral contexts for users (in production, use a better session store)
        self.referral_contexts = {}

    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict] = None,
        max_tokens: int = 600,
        temperature: float = 0.7,
        session_id: str = None
    ) -> str:

        # Crisis detection FIRST - always prioritize
        if self._is_crisis(user_message):
            return self._crisis_response()

        # Check if we're in the middle of a referral conversation
        if session_id and session_id in self.referral_contexts:
            context = self.referral_contexts[session_id]
            
            if context["stage"] == "awaiting_parish":
                # User has responded with their parish
                parish = self._validate_parish(user_message)
                if parish:
                    # Clear the context
                    del self.referral_contexts[session_id]
                    return self._get_professional_referrals(parish)
                else:
                    # Invalid parish, ask again
                    return self._ask_for_parish(attempt=2)
            
            elif context["stage"] == "offer_referral":
                # User responded to the offer of referral
                if self._is_positive_response(user_message):
                    self.referral_contexts[session_id]["stage"] = "awaiting_parish"
                    return self._ask_for_parish(attempt=1)
                else:
                    # User doesn't want referral, clear context and continue conversation
                    del self.referral_contexts[session_id]
                    # Continue with normal conversation

        # Check if user is explicitly asking for professional referrals
        if self._asking_for_referral(user_message):
            # Extract location if mentioned
            location = self._extract_location(user_message)
            if location and location != "Jamaica":
                # If location is specific, provide referrals directly
                return self._get_professional_referrals(location)
            else:
                # If no specific location, ask for parish
                if session_id:
                    self.referral_contexts[session_id] = {"stage": "awaiting_parish"}
                return self._ask_for_parish(attempt=1)

        # Check if user is asking about mental health resources in general
        if self._asking_about_resources(user_message):
            return self._get_general_resources()

        # Generate empathetic response with gentle referral suggestion if appropriate
        ai_response = self._get_empathetic_response(user_message, conversation_history)
        
        # Check for behavioral indicators and add gentle referral suggestion if multiple signs present
        if self._has_multiple_indicators(user_message):
            # Set up referral context for follow-up
            if session_id:
                self.referral_contexts[session_id] = {"stage": "offer_referral"}
            
            referral_suggestion = self._get_gentle_referral_suggestion(user_message)
            ai_response += f"\n\n{referral_suggestion}"
            
            # Add prompt to ask about location
            if session_id:
                ai_response += "\n\nWould you like me to help you find professionals in your area? If so, just let me know and I'll ask for your parish."

        return ai_response

    def _get_empathetic_response(self, user_message: str, conversation_history: List[Dict]) -> str:
        """Get the main empathetic response from the AI model"""
        
        messages = [
            {"role": "system", "content": self._system_prompt()}
        ]

        # Add conversation history if available
        if conversation_history:
            for msg in conversation_history[-6:]:
                messages.append({
                    "role": msg.get("role"),
                    "content": msg.get("content")
                })

        # Add latest user message
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
                # Fallback response if API fails
                return self._get_fallback_response(user_message)

            result = response.json()
            return result["choices"][0]["message"]["content"].strip()
            
        except Exception:
            return self._get_fallback_response(user_message)

    def _get_fallback_response(self, user_message: str) -> str:
        """Provide a fallback response if the API fails"""
        return (
            "I hear you, and I want you to know that your feelings are valid. "
            "While I'm here to listen, I also want to remind you that speaking with "
            "a mental health professional can provide additional support. "
            "Would you like me to share some resources for counselors in Jamaica?"
        )

    def _system_prompt(self) -> str:
        return (
            "You are Paula, a calm and compassionate emotional support assistant serving users in Jamaica. "
            "Respond in clear standard English. Encourage users to reply in English. "
            "Provide supportive, empathetic conversation and healthy coping suggestions. "
            "Do not provide medical diagnoses. "
            "If a user expresses suicidal intent, encourage calling 119 immediately and contacting "
            "Jamaica Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE (639-5433). "
            "Encourage reaching out to a trusted person nearby. "
            "Never provide instructions for self-harm.\n\n"

            "IMPORTANT GUIDELINES:\n"
            "1. NEVER diagnose or label the user's condition\n"
            "2. NEVER say things like 'you have depression' or 'you seem anxious'\n"
            "3. Instead, reflect back what they've shared: 'It sounds like you're experiencing difficulty sleeping' or 'You've mentioned feeling sad frequently'\n"
            "4. Respond in clear standard English\n"
            "5. Provide supportive, empathetic conversation and healthy coping suggestions\n"
            "6. If users share multiple struggles, gently suggest they might benefit from speaking with a professional who can provide personalized support\n"
            "7. Frame suggestions as observations, not diagnoses: 'Many people find it helpful to speak with a counselor when they experience ongoing sleep difficulties and low mood'\n"
            "8. For crisis situations, immediately provide emergency contact information\n\n"
            "Respond in a warm, empathetic tone while maintaining these boundaries."
        )

    def _is_crisis(self, text: str) -> bool:
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in CRISIS_KEYWORDS)

    def _crisis_response(self) -> str:
        return (
            "🚨 **I'm really concerned about you and want to make sure you're safe.** 🚨\n\n"
            "These feelings can be overwhelming, and you don't have to face them alone.\n\n"
            "**Immediate Help Available:**\n"
            "• Emergency Services: 119\n"
            "• Jamaica Mental Health Helpline: 888-NEW-LIFE (639-5433) - 24/7\n"
            "• Crisis Centre of Jamaica: 876-631-5244\n\n"
            "Please reach out to someone who can help right now - a crisis counselor, a trusted friend, or family member. "
            "You deserve support, and there are people who genuinely want to help you through this."
        )

    def _ask_for_parish(self, attempt: int = 1) -> str:
        """Ask the user which parish they are located in"""
        if attempt == 1:
            return (
                "To help me find mental health professionals near you, could you please tell me which parish you're located in? "
                "For example: Kingston, St. Andrew, St. Catherine, Manchester, etc."
            )
        else:
            return (
                "I want to make sure I find professionals in your area. "
                "Which parish are you currently located in? "
                "You can say something like 'I'm in Kingston' or 'St. James'."
            )

    def _validate_parish(self, text: str) -> Optional[str]:
        """Validate if the user's response contains a valid Jamaican parish"""
        text_lower = text.lower()
        
        # Direct parish matching
        for parish in JAMAICAN_PARISHES:
            if parish in text_lower:
                # Format the parish name properly
                if parish.startswith("st"):
                    parts = parish.split()
                    if len(parts) > 1:
                        return f"St. {parts[1].title()}"
                else:
                    return parish.title()
        
        return None

    def _is_positive_response(self, text: str) -> bool:
        """Check if user responded positively to referral offer"""
        positive_keywords = [
            "yes", "sure", "okay", "ok", "please", "would love", "help me find",
            "send me", "share", "yes please", "that would be helpful", "i'd like that"
        ]
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in positive_keywords)

    def _asking_for_referral(self, text: str) -> bool:
        """Check if user is explicitly asking for professional referrals"""
        referral_keywords = [
            "find a psychologist", "need a therapist", "counselor near me",
            "psychologist in", "therapist in", "mental health professional",
            "counselor in", "therapy near me", "referral to", "psychiatrist",
            "need someone to talk to", "professional help", "see a therapist",
            "counselling", "counseling", "find help", "get support"
        ]
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in referral_keywords)

    def _asking_about_resources(self, text: str) -> bool:
        """Check if user is asking about general mental health resources"""
        resource_keywords = [
            "mental health resources", "support groups", "help available",
            "what help is there", "resources in jamaica", "mental health services",
            "free counseling", "low cost therapy", "community support"
        ]
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in resource_keywords)

    def _has_multiple_indicators(self, text: str) -> bool:
        """Check if the user's message contains multiple behavioral indicators"""
        text_lower = text.lower()
        indicator_count = 0
        
        for category, keywords in BEHAVIORAL_INDICATORS.items():
            if any(keyword in text_lower for keyword in keywords):
                indicator_count += 1
        
        # Suggest referral if multiple categories are present
        return indicator_count >= 2

    def _get_gentle_referral_suggestion(self, user_message: str) -> str:
        """Provide a gentle, non-diagnostic suggestion to consider professional help"""
        
        # Extract what the user is experiencing to personalize the suggestion
        text_lower = user_message.lower()
        experiences = []
        
        if any(word in text_lower for word in ["sleep", "tired", "insomnia"]):
            experiences.append("sleep difficulties")
        if any(word in text_lower for word in ["sad", "empty", "hopeless"]):
            experiences.append("low mood")
        if any(word in text_lower for word in ["worry", "anxious", "panic"]):
            experiences.append("feeling worried or anxious")
        if any(word in text_lower for word in ["eat", "appetite", "weight"]):
            experiences.append("changes in appetite")
        if any(word in text_lower for word in ["focus", "concentrate", "forget"]):
            experiences.append("difficulty concentrating")
        
        if experiences:
            experience_text = " and ".join(experiences)
            suggestion = (
                f"I hear that you're experiencing {experience_text}. While these feelings are valid, "
                f"many people find it helpful to speak with a professional who can provide personalized strategies and support. "
                f"A counselor or psychologist can work with you to better understand these experiences and develop coping approaches "
                f"that fit your unique situation."
            )
        else:
            suggestion = (
                "Many people find that speaking with a mental health professional provides valuable support and perspective. "
                "A counselor can offer a safe space to explore your feelings and develop coping strategies together."
            )
        
        return suggestion

    def _extract_location(self, text: str) -> str:
        """Extract location information from user message"""
        text_lower = text.lower()
        
        # Jamaican parishes
        parishes = {
            "kingston": "Kingston",
            "st andrew": "St. Andrew", "st. andrew": "St. Andrew",
            "st catherine": "St. Catherine", "st. catherine": "St. Catherine",
            "clarendon": "Clarendon",
            "manchester": "Manchester",
            "st elizabeth": "St. Elizabeth", "st. elizabeth": "St. Elizabeth",
            "westmoreland": "Westmoreland",
            "hanover": "Hanover",
            "st james": "St. James", "st. james": "St. James",
            "trelawny": "Trelawny",
            "st ann": "St. Ann", "st. ann": "St. Ann",
            "st mary": "St. Mary", "st. mary": "St. Mary",
            "portland": "Portland",
            "st thomas": "St. Thomas", "st. thomas": "St. Thomas"
        }
        
        # Towns/cities
        towns = {
            "montego bay": "Montego Bay",
            "ocho rios": "Ocho Rios",
            "spanish town": "Spanish Town",
            "portmore": "Portmore",
            "mandeville": "Mandeville",
            "may pen": "May Pen",
            "savanna-la-mar": "Savanna-la-Mar",
            "port antonio": "Port Antonio",
            "falmouth": "Falmouth",
            "lucea": "Lucea"
        }
        
        for key, value in {**parishes, **towns}.items():
            if key in text_lower:
                return value
        
        return "Jamaica"  # Default

    def _get_professional_referrals(self, location: str = "Jamaica") -> str:
        """Provide a list of mental health professionals based on location"""
        
        # Normalize location for matching
        location_lower = location.lower()
        
        # Filter professionals by location
        nearby_professionals = []
        
        for prof in JAMAICA_PSYCHOLOGISTS:
            if (location_lower in prof["location"].lower() or 
                location_lower in prof["parish"].lower() or
                (location_lower == "jamaica")):
                nearby_professionals.append(prof)
        
        # If no exact matches, show a few from nearby areas
        if not nearby_professionals:
            nearby_professionals = JAMAICA_PSYCHOLOGISTS[:3]
        
        response = f"**Here are some mental health professionals in or near {location}:**\n\n"
        
        for prof in nearby_professionals[:3]:
            response += f"**{prof['name']}** - {prof['type']}\n"
            response += f"📍 {prof['address']}\n"
            response += f"📞 {prof['contact']}\n"
            response += f"🔹 Areas of focus: {', '.join(prof['specialties'])}\n\n"
        
        response += "**A few things to keep in mind:**\n"
        response += "• You can call to ask about their approach and see if they might be a good fit\n"
        response += "• Many offer an initial phone consultation to discuss your needs\n"
        response += "• It's okay to speak with a few different professionals to find the right match\n\n"
        
        response += "**Additional support options:**\n"
        response += "• Jamaica Mental Health Helpline: 888-NEW-LIFE (639-5433) - for immediate support\n"
        response += "• Ministry of Health & Wellness: 876-633-8175 - for information about public mental health services\n\n"
        
        response += "Taking the step to reach out shows real strength. I hope you find the support you're looking for."
        
        return response

    def _get_general_resources(self) -> str:
        """Provide general mental health resources in Jamaica"""
        
        return (
            "**Mental Health Resources in Jamaica**\n\n"
            
            "**Crisis Support:**\n"
            "• Jamaica Mental Health Helpline: 888-NEW-LIFE (639-5433) - 24/7\n"
            "• Crisis Centre of Jamaica: 876-631-5244\n"
            "• Emergency Services: 119\n\n"
            
            "**Public Mental Health Services:**\n"
            "• Ministry of Health & Wellness Mental Health Unit: 876-633-8175\n"
            "• Bellevue Hospital (Kingston): 876-938-1211-9\n"
            "• Western Regional Health Authority (Montego Bay): 876-952-5100\n\n"
            
            "**Private Practitioners:**\n"
            "You can search for psychologists and counselors through:\n"
            "• Jamaica Psychological Society\n"
            "• Local directories and health insurance providers\n\n"
            
            "**Community Support:**\n"
            "• Support groups for various concerns\n"
            "• Faith-based counseling services\n"
            "• University counseling centers (for students)\n\n"
            
            "Would you like me to help you find professionals in a specific area of Jamaica? "
            "Just let me know which parish or town you're in."
        )


# --- PUBLIC FUNCTION USED BY ROUTES ---

_paula_client = None

def ask_paula(user_message: str, chat_history=None, session_id: str = None, summary: str = None) -> str:
    """Public function for routes to call"""
    global _paula_client

    if _paula_client is None:
        try:
            _paula_client = PaulaClient()
        except Exception as e:
            return "I'm having trouble connecting right now. Please try again in a moment. If this persists, you can reach out to the Jamaica Mental Health Helpline at 888-NEW-LIFE (639-5433) for immediate support."

    return _paula_client.generate_response(user_message, chat_history, session_id=session_id)

def detect_emotion_ai(text: str) -> str:
    """Simple emotion detection based on keywords"""
    text_lower = text.lower()
    
    emotion_keywords = {
        "sad": ["sad", "depressed", "down", "unhappy", "blue", "heartbroken", "grieving"],
        "anxious": ["anxious", "worried", "nervous", "panic", "stressed", "overwhelmed"],
        "angry": ["angry", "mad", "frustrated", "irritated", "annoyed", "upset"],
        "hopeful": ["hopeful", "optimistic", "positive", "better", "improving"],
        "tired": ["tired", "exhausted", "drained", "fatigue", "burnout"],
        "lonely": ["lonely", "alone", "isolated", "abandoned", "forgotten"]
    }
    
    for emotion, keywords in emotion_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            return emotion
    
    return "neutral"

def summarize_memory(history: List[Dict]) -> str:
    """Summarize conversation history for memory"""
    if not history:
        return ""
    
    # Simple summarization - in production, you might use an AI model
    topics = set()
    for msg in history[-10:]:  # Look at last 10 messages
        content = msg.get("content", "").lower()
        if "work" in content or "job" in content:
            topics.add("work")
        if "family" in content or "mother" in content or "father" in content:
            topics.add("family")
        if "friend" in content:
            topics.add("friends")
        if "relationship" in content or "partner" in content:
            topics.add("relationships")
        if "health" in content or "sleep" in content or "eat" in content:
            topics.add("health concerns")
    
    if topics:
        return f"Previous conversation covered: {', '.join(topics)}"
    return "Previous conversation context available"