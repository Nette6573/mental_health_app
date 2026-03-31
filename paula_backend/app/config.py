from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# app/config.py
import os
import secrets


# Required variables (will raise error if missing)
HF_TOKEN = os.getenv("HF_TOKEN")
MONGO_URI = os.getenv("MONGO_URI")

if not HF_TOKEN:
    print("⚠️ HF_TOKEN missing - skipping AI for now")
    HF_TOKEN = ""

if not MONGO_URI:
    print("⚠️ MONGO_URI missing - using empty (may fail DB)")
    MONGO_URI = ""

# Optional variables with defaults
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    print("⚠️  WARNING: SECRET_KEY not set. Using a temporary key (sessions will reset on restart)")
    SECRET_KEY = secrets.token_urlsafe(32)  # Generate a temporary key

print("✅ Configuration loaded successfully")
print(f"✓ HF_TOKEN: {'Set' if HF_TOKEN else 'Missing'}")
print(f"✓ MONGO_URI: {'Set' if MONGO_URI else 'Missing'}")
print(f"✓ SECRET_KEY: {'Set' if os.getenv('SECRET_KEY') else 'Using temporary key'}")