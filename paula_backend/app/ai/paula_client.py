# app/ai/paula_client.py
import requests
import logging
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

# Try these endpoints in order until one works
MODEL_ENDPOINTS = [
    "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8B-Instruct",
    "https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3-8B-Instruct",
    "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
    "https://api-inference.huggingface.co/models/gpt2"
]

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def ask_paula(prompt, history):
    logger.info(f"🤔 Paula thinking about: {prompt[:50]}...")
    
    if not HF_TOKEN:
        logger.error("❌ HF_TOKEN is missing")
        return "Mi need to connect to my brain first. Check back soon!"

    # Format conversation
    conversation = ""
    if history:
        for msg in history[-3:]:
            role = msg.get("sender", "user")
            content = msg.get("text", "")
            conversation += f"{role}: {content}\n"

    # Try each endpoint until one works
    for endpoint in MODEL_ENDPOINTS:
        try:
            logger.info(f"🔄 Trying endpoint: {endpoint}")
            
            payload = {
                "inputs": f"You are Paula, a friendly Jamaican AI assistant. Keep responses warm and supportive.\n{conversation}User: {prompt}\nPaula:",
                "parameters": {
                    "max_new_tokens": 150,
                    "temperature": 0.7,
                    "return_full_text": False
                }
            }

            response = requests.post(endpoint, headers=headers, json=payload, timeout=10)
            logger.info(f"📡 Status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ Success with {endpoint}")
                
                if isinstance(data, list) and len(data) > 0:
                    if "generated_text" in data[0]:
                        generated = data[0]["generated_text"]
                        if "Paula:" in generated:
                            return generated.split("Paula:")[-1].strip()
                        return generated.strip()
                return "Mi hear yuh. Tell mi more."
                
            elif response.status_code == 401:
                logger.warning("⛔ Unauthorized - token issue")
                continue  # Try next endpoint
            elif response.status_code == 404:
                logger.warning("🔍 Endpoint not found")
                continue  # Try next endpoint
            else:
                logger.warning(f"⚠️ Error {response.status_code}")
                continue
                
        except Exception as e:
            logger.warning(f"💥 Error with {endpoint}: {str(e)[:50]}")
            continue

    # If all endpoints fail
    logger.error("❌ All endpoints failed")
    return "Mi having trouble right now. Can yuh try again in a minute?"