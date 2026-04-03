# app/db/mongo.py

import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "paulachats_db")

# Initialize all variables
client = None
db = None
chats = None
users = None
resources = None


def is_db_connected():
    """Check if database connection is active"""
    return client is not None and db is not None


if not MONGO_URI:
    logger.error(
        "❌ MONGO_URI is not set.\n"
        "Set it in Railway Variables or HuggingFace Secrets."
    )

else:
    try:
        # Create Mongo client with production-safe settings
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

        # Select database
        db = client[DATABASE_NAME]

        # Collection names
        CHATS_COLLECTION = "chats"
        USERS_COLLECTION = "users"
        RESOURCES_COLLECTION = "resources"

        # Initialize collections
        chats = db[CHATS_COLLECTION]
        users = db[USERS_COLLECTION]
        resources = db[RESOURCES_COLLECTION]

        # Create indexes
        try:
            chats.create_index("session_id", unique=True, sparse=True)
            chats.create_index("user_id")
            chats.create_index("created_at")
            chats.create_index("updated_at")

            users.create_index("email", unique=True, sparse=True)
            users.create_index("user_id", unique=True)
            users.create_index("created_at")

            resources.create_index("category")
            resources.create_index("type")
            resources.create_index("tags")
            resources.create_index("featured")

            logger.info("✅ Indexes created successfully")

        except Exception as e:
            logger.warning(f"⚠️ Index creation warning: {e}")

        logger.info(f"✅ Using database: {db.name}")
        logger.info("✅ Collections initialized: chats, users, resources")

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


# Export for other modules
__all__ = [
    "client",
    "db",
    "chats",
    "users",
    "resources",
    "is_db_connected"
]