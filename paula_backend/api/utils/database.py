from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Read connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")

client = MongoClient(MONGO_URI)

db = client["paula_db"]
chat_collection = db["chats"]
