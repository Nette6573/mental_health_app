# main.py
from fastapi import FastAPI
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

# Import database connection
try:
    from app.db.mongo import client, db, chats
    logger.info(f"✅ Database connected: {db.name}")
    logger.info(f"✅ Collection ready: {chats.name}")
except Exception as e:
    logger.error(f"❌ Failed to connect to database: {e}")
    raise

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

# Include routers
app.include_router(chat_router, prefix="/api", tags=["chats"])
logger.info("✅ Routers mounted successfully")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Paula Chats API",
        "version": "1.0.0",
        "status": "running",
        "database": db.name,
        "collection": chats.name,
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
    db_status = "connected"
    try:
        client.admin.command('ping')
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "hf_token": "configured" if HF_TOKEN else "missing",
        "secret_key": "configured" if SECRET_KEY else "missing"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("🚀 Paula Chats API is starting up...")
    logger.info(f"📚 Database: {db.name}")
    logger.info(f"📁 Collection: {chats.name}")
    logger.info(f"🔗 API endpoints available at /api")
    logger.info("📖 Documentation at /docs")  # Fixed: removed f=
    logger.info("=" * 50)

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Paula Chats API is shutting down...")
    # Close MongoDB connection
    client.close()
    logger.info("✅ Database connection closed")

# For debugging - print all registered routes
@app.on_event("startup")
async def print_routes():
    logger.info("📋 Registered routes:")
    for route in app.routes:
        logger.info(f"  {route.path} -> {route.name}")

logger.info("✅ Application initialization complete!")