# app/db/mongo.py

import os
import logging
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    error_msg = (
        "MONGO_URI environment variable is not set. "
        "If running on Hugging Face Spaces, add it to Secrets.\n"
        "If running locally, create a .env file with MONGO_URI=your_connection_string"
    )
    logger.error(error_msg)
    # Don't raise here, let the app try to connect and fail gracefully
    client = None
    db = None
    chats = None
else:
    try:
        # Add connection options for better reliability
        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=30000,
            maxPoolSize=10,
            minPoolSize=1
        )

        # Test connection
        client.admin.command("ping")
        logger.info("✅ Connected to MongoDB Atlas")

        DATABASE_NAME = "hopepath"
        db = client[DATABASE_NAME]
        COLLECTION_NAME = "paulachats"
        chats = db[COLLECTION_NAME]
        users = db["users"]

        # Create indexes for better performance
        chats.create_index("session_id", unique=True, sparse=True)
        chats.create_index("user_id")
        chats.create_index("created_at")
        
        logger.info(f"✅ Using database: {DATABASE_NAME}")
        logger.info(f"✅ Using collection: {COLLECTION_NAME}")
        logger.info(f"✅ Indexes created")

    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        client = None
        db = None
        chats = None
        users = None  # ← add this
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"❌ Unexpected MongoDB error: {e}")
        client = None  # ← add these
        db = None
        chats = None
        users = None

# Export these for use in other modules
__all__ = ['client', 'db', 'chats', 'users']  # ← add users here