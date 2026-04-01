# app/db/mongo.py

import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")

# Initialize all variables
client = None
db = None
chats = None
users = None
resources = None

if not MONGO_URI:
    error_msg = (
        "MONGO_URI environment variable is not set. "
        "If running on Hugging Face Spaces, add it to Secrets.\n"
        "If running locally, create a .env file with MONGO_URI=your_connection_string"
    )
    logger.error(error_msg)
    client = None
    db = None
    chats = None
    users = None
    resources = None
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

        DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "paulachats_db")
        db = client[DATABASE_NAME]
        
        # Initialize collections
        CHATS_COLLECTION = "paulachats"
        chats = db[CHATS_COLLECTION]
        
        USERS_COLLECTION = "users"
        users = db[USERS_COLLECTION]
        
        RESOURCES_COLLECTION = "resources"
        resources = db[RESOURCES_COLLECTION]

        # Create indexes for better performance
        try:
            # Chats collection indexes
            chats.create_index("session_id", unique=True, sparse=True)
            chats.create_index("user_id")
            chats.create_index("created_at")
            chats.create_index("updated_at")
            
            # Users collection indexes
            users.create_index("email", unique=True, sparse=True)
            users.create_index("user_id", unique=True)
            users.create_index("created_at")
            
            # Resources collection indexes
            resources.create_index("category")
            resources.create_index("type")
            resources.create_index("tags")
            resources.create_index("featured")
            
            logger.info(f"✅ Indexes created successfully")
        except Exception as e:
            logger.warning(f"Index creation warning (may already exist): {e}")
        
        logger.info(f"✅ Using database: {DATABASE_NAME}")
        logger.info(f"✅ Collections: chats, users, resources")

    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        client = None
        db = None
        chats = None
        users = None
        resources = None
    except Exception as e:
        logger.error(f"❌ Unexpected MongoDB error: {e}")
        client = None
        db = None
        chats = None
        users = None
        resources = None

# Export these for use in other modules
__all__ = ['client', 'db', 'chats', 'users', 'resources']