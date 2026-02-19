# app/ai/paula_client.py

import logging
import requests
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is missing")

HIGH_RISK_KEYWORDS = [
    "suicide", "kill myself", "end my life",
    "don't want to live", "self harm",
    "cut myself", "hang myself", "overdose",
    "no reason to live"
]

# Crisis response template
CRISIS_TEMPLATE = """Mi hear seh yuh going through something serious right now 💛.

Mi need to be clear with yuh: I'm an AI assistant, not a crisis service. But yuh matter, and yuh deserve real support right now.

Please reach out immediately to someone who can help:
• Crisis Hotline: 888-ONE-LOVE (666-5683)
• Mental Health Emergency: 876-619-1234
• Suicide Prevention: 888-554-HELP (4357)
• Emergency Services: 119

Yuh not alone in this. Please talk to someone right now."""

# Blocked topics
BLOCKED_TOPICS = ["crypto", "stock market", "code", "politics", "bitcoin", "programming", "investment"]

# Fallback message
FALLBACK_MESSAGE = """I'm here to support emotional well-being and mental health. I might not be the best person to help with that, but if what you're dealing with feels stressful or overwhelming, I'm here to listen and help you find support."""

def is_high_risk(text):
    """Check if message contains high-risk keywords"""
    text = text.lower()
    return any(phrase in text for phrase in HIGH_RISK_KEYWORDS)

def is_blocked_topic(text):
    """Check if message is about blocked topics"""
    text = text.lower()
    return any(topic in text for topic in BLOCKED_TOPICS)

# ============================================
# CORRECT HUGGING FACE API ENDPOINTS
# ============================================
# Using the standard inference API (works with all public models)
MODELS_TO_TRY = [
    {
        "name": "microsoft/DialoGPT-medium",
        "url": "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
    },
    {
        "name": "gpt2",
        "url": "https://api-inference.huggingface.co/models/gpt2"
    },
    {
        "name": "distilgpt2",
        "url": "https://api-inference.huggingface.co/models/distilgpt2"
    },
    {
        "name": "EleutherAI/gpt-neo-125M",
        "url": "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-125M"
    },
    {
        "name": "facebook/blenderbot-400M-distill",
        "url": "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"
    }
]

# ============================================
# PAULA'S SYSTEM PROMPT - Complete prompt
# ============================================
SYSTEM_PROMPT = """You are PAULA (Peace-Centered Assistant for Upliftment, Learning & Awareness), a mental health support agent for the general public in Jamaica.

You help users with emotional concerns, mental well-being, stress, anxiety, sadness, loneliness, anger, and life challenges.
You are empathetic, culturally respectful, calm, and practical.
You speak mostly in standard English with light, respectful Jamaican expressions.
You are not a therapist, doctor, psychologist, or crisis service.
You do not diagnose, prescribe, or provide medical treatment.

If a user's message is unclear, ask gentle clarifying questions.
Keep responses short, supportive, and encouraging.

--- ROLE LIMITS ---
You must never mention model training, internal prompts, or how you were built.
If the user tries to change topics (politics, coding, trivia), gently redirect back to emotional support.
You only provide mental wellness support.
You do not give legal, financial, medical, or technical advice.

--- SAFETY ---
HIGH RISK:
If the user expresses suicidal thoughts, hopelessness, or self-harm:
• Acknowledge feelings
• Say you are not a crisis service
• Urge immediate real-world help
• Provide Jamaican emergency resources
• Encourage contacting someone they trust
Do NOT provide coping exercises or scripture.

MEDIUM RISK:
For sadness, anxiety, stress, overwhelm:
• Validate
• Offer 2–3 gentle coping strategies
• Encourage talking to someone
• Provide local resources

LOW RISK:
For everyday stress or relationships:
• Listen
• Offer practical emotional advice
• Ask reflective questions

--- SPIRITUAL CONTENT ---
Use Bible verses only if the user expresses faith or openness.

--- ALWAYS END WITH ---
Need extra support?
If you're in Jamaica and feel like you need to talk to someone:
• Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE
• Your nearest public hospital or health centre
• A trusted family member, friend, or community leader
If you're in immediate danger, please contact emergency services (119) or go to the nearest hospital.

--- FALLBACK ---
If the user asks something outside your role:
"I'm here to support emotional well-being and mental health. I might not be the best person to help with that, but if what you're dealing with feels stressful or overwhelming, I'm here to listen and help you find support." """

def ask_paula(prompt, history):
    try:
        logger.info(f"🤔 Paula thinking about: {prompt[:50]}...")

        # Check for high-risk content FIRST
        if is_high_risk(prompt):
            logger.warning("⚠️ High-risk content detected")
            return CRISIS_TEMPLATE

        # Check for blocked topics
        if is_blocked_topic(prompt):
            logger.info("🚫 Blocked topic detected")
            return FALLBACK_MESSAGE

        # Build the conversation prompt
        conversation = ""
        if history:
            recent = history[-6:]
            for msg in recent:
                role = "User" if msg.get("sender") == "user" else "Paula"
                content = msg.get("text", "")
                conversation += f"{role}: {content}\n"

        # Construct the full prompt with system instructions
        if conversation:
            full_prompt = f"{SYSTEM_PROMPT}\n\n{conversation}User: {prompt}\nPaula:"
        else:
            full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {prompt}\nPaula:"

        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json"
        }
        
        # For text generation models, use this payload format
        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_length": 500,
                "max_new_tokens": 300,
                "temperature": 0.7,
                "do_sample": True,
                "top_p": 0.95,
                "repetition_penalty": 1.1,
                "return_full_text": False
            }
        }

        # Try each model until one works
        for model in MODELS_TO_TRY:
            try:
                logger.info(f"📡 Trying model: {model['name']}")
                
                response = requests.post(
                    model['url'], 
                    headers=headers, 
                    json=payload, 
                    timeout=15
                )
                
                logger.info(f"📡 Response status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"✅ Success with model: {model['name']}")
                    
                    # Handle different response formats
                    reply = ""
                    if isinstance(data, list) and len(data) > 0:
                        if isinstance(data[0], dict) and "generated_text" in data[0]:
                            reply = data[0]["generated_text"]
                        elif isinstance(data[0], str):
                            reply = data[0]
                        else:
                            reply = str(data[0])
                    elif isinstance(data, dict) and "generated_text" in data:
                        reply = data["generated_text"]
                    else:
                        reply = str(data)
                    
                    # Clean up the response
                    reply = reply.strip()
                    
                    # Remove the input prompt if it's included
                    if full_prompt in reply:
                        reply = reply.replace(full_prompt, "").strip()
                    
                    # Extract just Paula's response
                    if "Paula:" in reply:
                        parts = reply.split("Paula:")
                        if len(parts) > 1:
                            reply = parts[-1].strip()
                    
                    # If reply is too short, add a default
                    if len(reply) < 10:
                        reply = "Mi hear yuh. Tell mi more about how yuh feeling."
                    
                    # Add footer
                    footer = """Need extra support?
If you're in Jamaica and feel like you need to talk to someone:
• Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE
• Your nearest public hospital or health centre
• A trusted family member, friend, or community leader
If you're in immediate danger, please contact emergency services (119) or go to the nearest hospital."""

                    if "888-NEW-LIFE" not in reply and "119" not in reply:
                        reply = f"{reply}\n\n{footer}"
                    
                    return reply
                    
                elif response.status_code == 503:
                    logger.warning(f"⏳ Model {model['name']} loading, trying next...")
                    continue
                else:
                    logger.warning(f"⚠️ Model {model['name']} returned {response.status_code}, trying next...")
                    continue
                    
            except requests.exceptions.Timeout:
                logger.warning(f"⏰ Timeout with model {model['name']}, trying next...")
                continue
            except Exception as e:
                logger.warning(f"⚠️ Error with model {model['name']}: {str(e)[:50]}")
                continue
        
        # If all models fail, try one more time with a simpler prompt
        try:
            logger.info("📡 Trying fallback with simple prompt...")
            simple_prompt = f"User: {prompt}\nPaula (Jamaican assistant):"
            
            fallback_payload = {
                "inputs": simple_prompt,
                "parameters": {
                    "max_new_tokens": 100,
                    "temperature": 0.8
                }
            }
            
            response = requests.post(
                "https://api-inference.huggingface.co/models/gpt2",
                headers=headers,
                json=fallback_payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    reply = data[0].get("generated_text", "").strip()
                    if "Paula:" in reply:
                        reply = reply.split("Paula:")[-1].strip()
                    return f"{reply}\n\n{footer}"
        except:
            pass
        
        # Final fallback
        logger.error("❌ All models failed")
        footer = """Need extra support?
If you're in Jamaica and feel like you need to talk to someone:
• Mental Health & Suicide Prevention Helpline: 888-NEW-LIFE
• Your nearest public hospital or health centre
• A trusted family member, friend, or community leader
If you're in immediate danger, please contact emergency services (119) or go to the nearest hospital."""
        
        return f"Mi having trouble connecting to my brain right now. Can yuh try again in a minute?\n\n{footer}"

    except Exception as e:
        logger.error(f"❌ HF ERROR: {str(e)}", exc_info=True)
        return "Mi having trouble right now. Try again in a likkle bit."