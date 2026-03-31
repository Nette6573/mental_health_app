# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("🚀 Starting Paula Chats API...")

# Import configuration first to validate environment variables
try:
    from app.config import HF_TOKEN, MONGO_URI, SECRET_KEY
    logger.info("✅ Configuration loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load configuration: {e}")
    raise

# Import database connection with proper error handling
try:
    from app.db.mongo import client, db, chats
    
    # Check if database connection was successful
    if db is None:
        logger.error("❌ Database connection failed - db is None")
        db_status = "disconnected"
        db_name = "Not Connected"
        chats_name = "Not Connected"
    else:
        db_status = "connected"
        db_name = db.name
        chats_name = chats.name
        logger.info(f"✅ Database connected: {db_name}")
        logger.info(f"✅ Collection ready: {chats_name}")
        
except Exception as e:
    logger.error(f"❌ Failed to import database module: {e}")
    db_status = "error"
    db_name = "Import Error"
    chats_name = "Import Error"
    client = None
    db = None
    chats = None

# Import routes
try:
    from app.routes.chat import router as chat_router
    logger.info("✅ Chat router imported successfully")
except Exception as e:
    logger.error(f"❌ Failed to import chat router: {e}")
    raise

# Create FastAPI app instance
app = FastAPI(
    title="Paula Chats API",
    description="AI Chat Assistant API powered by Hugging Face",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc
)

# CORS Configuration - Updated for your domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hopepath.online",                      # Your custom domain
        "https://www.hopepath.online",                  # With www subdomain
        "https://mentalhealthapp-production.up.railway.app",  # Railway backend
        "http://localhost:3000",                        # Local development
        "http://localhost:8000",                        # Local backend
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(chat_router, prefix="/api", tags=["chats"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
logger.info("✅ Routers mounted successfully")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Paula Chats API",
        "version": "1.0.0",
        "status": "running",
        "database": db_name if 'db_name' in locals() else "Unknown",
        "collection": chats_name if 'chats_name' in locals() else "Unknown",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health",
            "api": "/api/send"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    # Check database connection
    db_status = "unknown"
    
    if 'client' in locals() and client is not None:
        try:
            client.admin.command('ping')
            db_status = "connected"
        except Exception as e:
            db_status = f"ping failed: {str(e)}"
    elif db is None:
        db_status = "disconnected (db is None)"
    else:
        db_status = "client not available"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "hf_token": "configured" if HF_TOKEN else "missing",
        "secret_key": "configured" if SECRET_KEY else "missing",
        "mongodb_details": {
            "uri_set": bool(MONGO_URI),
            "uri_preview": MONGO_URI[:20] + "..." if MONGO_URI else "Not set",
            "database_name": db_name if 'db_name' in locals() else "Unknown",
            "collection_name": chats_name if 'chats_name' in locals() else "Unknown"
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("🚀 Paula Chats API is starting up...")
    logger.info(f"📚 Database: {db_name if 'db_name' in locals() else 'Unknown'}")
    logger.info(f"📁 Collection: {chats_name if 'chats_name' in locals() else 'Unknown'}")
    logger.info(f"🔗 API endpoints available at /api")
    logger.info("📖 Documentation at /docs")
    logger.info("=" * 50)
    
    # Log MongoDB connection details for debugging
    if 'db' in locals() and db is None:
        logger.warning("⚠️  Database is not connected - some endpoints may not work properly")
        logger.warning("💡 Check your MONGO_URI secret in Hugging Face Spaces")
    else:
        logger.info("✅ Database connection verified")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Paula Chats API is shutting down...")
    # Close MongoDB connection if it exists
    if 'client' in locals() and client is not None:
        client.close()
        logger.info("✅ Database connection closed")
    else:
        logger.info("ℹ️  No database connection to close")

# For debugging - print all registered routes
@app.on_event("startup")
async def print_routes():
    logger.info("📋 Registered routes:")
    for route in app.routes:
        logger.info(f"  {route.path} -> {route.name}")

logger.info("✅ Application initialization complete!")