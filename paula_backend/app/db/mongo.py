# app/db/mongo.py

import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        "MONGO_URI environment variable is not set. "
        "Add it to HuggingFace Space Secrets."
    )

if not (
    MONGO_URI.startswith("mongodb://")
    or MONGO_URI.startswith("mongodb+srv://")
):
    raise ValueError("Invalid Mongo URI")

try:

    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000
    )

    client.admin.command("ping")
    print("✅ Connected to MongoDB Atlas")

    DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "paulachats_db")

    db = client[DATABASE_NAME]

    COLLECTION_NAME = "paulachats"
    chats = db[COLLECTION_NAME]

    print(f"✅ Using database: {DATABASE_NAME}")
    print(f"✅ Using collection: {COLLECTION_NAME}")

    logger.info(f"Available DBs: {client.list_database_names()}")
    logger.info(f"Collections: {db.list_collection_names()}")

except ConnectionFailure as e:
    print(f"❌ MongoDB connection failed: {e}")
    raise