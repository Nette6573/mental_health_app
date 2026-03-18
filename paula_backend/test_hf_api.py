# test_hf_api.py

import os
import requests
import sys
from dotenv import load_dotenv

# Try to load .env if it exists (for local testing)
load_dotenv()

# For Hugging Face Spaces, it will use the secrets automatically
HF_TOKEN = os.getenv("HF_TOKEN")

print("=" * 50)
print("PAULA - Hugging Face API Test")
print("=" * 50)

if not HF_TOKEN:
    print("❌ ERROR: HF_TOKEN not found!")
    print("\nIf running locally:")
    print("1. Create a .env file with: HF_TOKEN=hf_your_token_here")
    print("\nIf on Hugging Face Spaces:")
    print("1. Go to your Space Settings → Repository Secrets")
    print("2. Add HF_TOKEN with your Hugging Face token")
    sys.exit(1)

# Show token info (first few chars only for security)
print(f"✅ HF_TOKEN found: {HF_TOKEN[:5]}...{HF_TOKEN[-5:]}")
print(f"✅ Token length: {len(HF_TOKEN)}")

# Test 1: Validate token with Hugging Face
print("\n📡 Test 1: Validating token with Hugging Face...")
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

try:
    response = requests.get(
        "https://huggingface.co/api/whoami",
        headers=headers,
        timeout=10
    )
    
    if response.status_code == 200:
        user_info = response.json()
        print(f"✅ Token valid! Logged in as: {user_info.get('name', 'Unknown')}")
    else:
        print(f"❌ Token invalid! Status: {response.status_code}")
        print(f"Response: {response.text}")
        sys.exit(1)
        
except requests.exceptions.RequestException as e:
    print(f"❌ Error validating token: {e}")
    sys.exit(1)

# Test 2: Test model access
print("\n📡 Test 2: Testing model access...")

# Try different models in order of preference
models_to_try = [
    "meta-llama/Meta-Llama-3-8B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.1",
    "HuggingFaceH4/zephyr-7b-beta",
    "microsoft/Phi-3-mini-4k-instruct"
]

working_model = None

for model in models_to_try:
    print(f"\nTrying model: {model}")
    
    api_url = f"https://api-inference.huggingface.co/models/{model}"
    
    # Simple test prompt
    payload = {
        "inputs": "Hello, are you working?",
        "parameters": {
            "max_new_tokens": 50,
            "temperature": 0.7
        }
    }
    
    try:
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Model {model} is accessible!")
            print(f"Response: {str(result)[:100]}...")
            working_model = model
            break
        elif response.status_code == 503:
            print(f"⏳ Model {model} is loading (this is normal for first use)")
            # Don't break, try next model
        else:
            print(f"❌ Model {model} error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing {model}: {e}")

if working_model:
    print(f"\n✅ Found working model: {working_model}")
    print("\nUpdate your paula_client.py to use this model.")
else:
    print("\n❌ No working models found!")
    print("\nPossible issues:")
    print("1. Your HF_TOKEN might not have access to these models")
    print("2. You might need to accept model terms on Hugging Face")
    print("3. Visit: https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct")
    print("   and accept the terms if required")

print("\n" + "=" * 50)