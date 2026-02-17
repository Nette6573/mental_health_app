# app/ai/paula_client.py
import requests
import logging
from typing import List, Dict, Any
from app.config import HF_TOKEN

logger = logging.getLogger(__name__)

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct"
# Alternative models you could try:
# API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
# API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def format_conversation_history(history: List[Dict[str, Any]]) -> str:
    """Format the conversation history for the prompt"""
    if not history:
        return ""
    
    formatted = ""
    for msg in history:
        role = msg.get("role", "unknown")
        content = msg.get("content", "")
        formatted += f"{role.capitalize()}: {content}\n"
    
    return formatted

def ask_paula(prompt: str, history: List[Dict[str, Any]] = None) -> str:
    """
    Send a prompt to the Hugging Face API and get Paula's response
    """
    if history is None:
        history = []
    
    # Format the conversation history
    conversation_history = format_conversation_history(history)
    
    # Create a proper prompt for the model
    system_prompt = """You are Paula, a helpful, friendly, and knowledgeable AI assistant. 
    You provide clear, accurate, and engaging responses. You maintain context from the conversation history."""
    
    # Construct the full prompt
    if conversation_history:
        full_prompt = f"{system_prompt}\n\n{conversation_history}User: {prompt}\nPaula:"
    else:
        full_prompt = f"{system_prompt}\n\nUser: {prompt}\nPaula:"
    
    payload = {
        "inputs": full_prompt,
        "parameters": {
            "max_new_tokens": 500,
            "temperature": 0.7,
            "top_p": 0.95,
            "do_sample": True,
            "return_full_text": False  # Don't return the input prompt
        }
    }
    
    try:
        logger.info(f"Sending request to Hugging Face API with prompt length: {len(full_prompt)}")
        
        # Add timeout to prevent hanging
        res = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        
        logger.info(f"API Response Status: {res.status_code}")
        
        if res.status_code == 200:
            data = res.json()
            logger.debug(f"API Response: {data}")
            
            # Handle different response formats
            if isinstance(data, list) and len(data) > 0:
                if "generated_text" in data[0]:
                    # Extract only Paula's response (remove the prompt)
                    response = data[0]["generated_text"].strip()
                    
                    # Try to extract just the assistant's response
                    if "Paula:" in response:
                        response = response.split("Paula:")[-1].strip()
                    
                    return response
                else:
                    return str(data[0])
            elif isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"].strip()
            else:
                return str(data)
        
        elif res.status_code == 503:
            # Model is loading
            logger.info("Model is loading, waiting...")
            return "I'm warming up my brain! Please try again in a few seconds."
        
        else:
            error_msg = f"API Error {res.status_code}: {res.text}"
            logger.error(error_msg)
            return f"I'm having trouble connecting to my brain right now. Please try again later."
            
    except requests.exceptions.Timeout:
        logger.error("Request to Hugging Face API timed out")
        return "I'm taking too long to think. Please try again."
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Request to Hugging Face API failed: {e}")
        return "I'm having connection issues. Please check your internet and try again."
        
    except Exception as e:
        logger.error(f"Unexpected error in ask_paula: {e}")
        return "I encountered an unexpected error. Please try again."

# Optional: Add a function to test the connection
def test_connection():
    """Test the Hugging Face API connection"""
    try:
        test_prompt = "Hello, are you working?"
        response = ask_paula(test_prompt, [])
        logger.info(f"Test response: {response}")
        return True
    except Exception as e:
        logger.error(f"Connection test failed: {e}")
        return False

# Optional: Add a function to get model info
def get_model_info():
    """Get information about the current model"""
    try:
        res = requests.get(API_URL.replace("/inference", ""), headers=headers, timeout=10)
        if res.status_code == 200:
            return res.json()
        else:
            return {"error": f"Could not fetch model info: {res.status_code}"}
    except Exception as e:
        return {"error": str(e)}