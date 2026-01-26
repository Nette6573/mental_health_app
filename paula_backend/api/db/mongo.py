from pymongo import MongoClient
import os

# 🔐 MongoDB connection string
# Replace this with your MongoDB Atlas URI if using Atlas
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017"
)

# 📦 Connect to MongoDB
client = MongoClient(MONGO_URI)

# 🧠 Database
db = client["paula_db"]

# 💬 Collections
chats_collection = db["chats"]
memory_collection = db["memory"]

# Optional startup test (safe)
try:
    client.admin.command("ping")
    print("✅ MongoDB connected successfully")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
