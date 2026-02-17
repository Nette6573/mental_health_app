# app/db/mongo.py
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        "MONGO_URI environment variable is not set. "
        "Please add it in your Hugging Face Space settings under 'Repository Secrets'."
    )

# Validate URI format
if not (MONGO_URI.startswith("mongodb://") or MONGO_URI.startswith("mongodb+srv://")):
    raise ValueError(f"Invalid MONGO_URI format. Must start with 'mongodb://' or 'mongodb+srv://'")

try:
    # Create MongoDB client
    client = MongoClient(MONGO_URI)
    
    # Test connection
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # OPTION A: Specify database name directly in code
    # Replace 'your_database_name' with your actual database name
    DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "paulachats_db")  # Default to "hopepath_db"
    db = client[DATABASE_NAME]
    print(f"✅ Using database: {DATABASE_NAME}")
    
    # OPTION B: If you prefer to use the database name from the URI
    # (Only works if you added it to the URI as shown in Option 1 above)
    # db = client.get_default_database()
    
except ConnectionFailure as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    raise
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    raise

# Export collections
# Replace 'chats' with your actual collection name
chats = db["paulachats"]  # or db.chats

print(f"✅ Ready to use collection: chats")
logger.info(f"Available databases: {client.list_database_names()}")
logger.info(f"Collections in {DATABASE_NAME}: {db.list_collection_names()}")