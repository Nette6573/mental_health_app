# app/ai/paula_client.py
import requests
import logging
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

# UPDATED: New Hugging Face endpoint
API_URL = "https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3-8B-Instruct"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def ask_paula(prompt, history):
    try:
        logger.info(f"Calling Hugging Face API with prompt: {prompt[:50]}...")
        
        if not HF_TOKEN:
            logger.error("HF_TOKEN is missing")
            return "Mi need to connect to my brain first. Check back soon!"

        # Format conversation history
        conversation = ""
        if history:
            for msg in history[-3:]:  # Last 3 messages for context
                role = msg.get("role", "user")
                content = msg.get("content", "")
                conversation += f"{role}: {content}\n"

        payload = {
            "inputs": f"You are Paula, a friendly Jamaican AI assistant. Keep responses warm and supportive.\n{conversation}User: {prompt}\nPaula:",
            "parameters": {
                "max_new_tokens": 150,
                "temperature": 0.7,
                "return_full_text": False
            }
        }

        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        logger.info(f"API Response Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            logger.info(f"API Response received")
            
            if isinstance(data, list) and len(data) > 0:
                if "generated_text" in data[0]:
                    generated = data[0]["generated_text"]
                    # Clean up the response
                    if "Paula:" in generated:
                        return generated.split("Paula:")[-1].strip()
                    return generated.strip()
            return "Mi hear yuh. Tell mi more."
            
        elif response.status_code == 503:
            logger.warning("Model is loading")
            return "Paula warming up - try again in a few seconds!"
        else:
            logger.error(f"API Error: {response.status_code}")
            return "Mi having trouble right now. Can yuh try again?"

    except requests.exceptions.Timeout:
        logger.error("Request timed out")
        return "Mi thinking too long - try again?"
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return "Something went wrong. Please try again."

    # Always return a string, never None
    return "Mi here fi yuh. What yuh want to talk about?"