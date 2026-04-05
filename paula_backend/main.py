from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import therapists
import logging

# ---------------- LOGGING ---------------- #
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("🚀 Starting Paula Chats API...")

# ---------------- CONFIG ---------------- #
try:
    from app.config import HF_TOKEN, MONGO_URI, SECRET_KEY
    logger.info("✅ Configuration loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load configuration: {e}")
    raise

# ---------------- DATABASE ---------------- #
try:
    from app.db.mongo import client, db, chats, users, resources

    if db is None:
        logger.error("❌ Database connection failed - db is None")
        db_name = "Not Connected"
        chats_name = "Not Connected"
        users_name = "Not Connected"
        resources_name = "Not Connected"
    else:
        db_name = db.name

        chats_name = chats.name if chats is not None else "Not Available"
        users_name = users.name if users is not None else "Not Available"
        resources_name = resources.name if resources is not None else "Not Available"

        logger.info(f"✅ Database connected: {db_name}")
        logger.info(f"✅ Chats collection ready: {chats_name}")
        logger.info(f"✅ Users collection ready: {users_name}")
        logger.info(f"✅ Resources collection ready: {resources_name}")

except Exception as e:
    logger.error(f"❌ Failed to import database module: {e}")
    client = None
    db = None
    chats = None
    users = None
    resources = None
    db_name = "Error"
    chats_name = "Error"
    users_name = "Error"
    resources_name = "Error"

# ---------------- CREATE APP (IMPORTANT) ---------------- #
app = FastAPI(
    title="Paula Chats API",
    description="AI Chat Assistant API powered by Hugging Face",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hopepath.online",
        "https://www.hopepath.online",
        "https://mentalhealthapp-production.up.railway.app",
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- IMPORT ROUTES ---------------- #
from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router
from app.routes.resources import router as resources_router
from app.routes.user import router as user_router
from app.routes.mood import router as mood_router

logger.info("✅ Routes imported successfully")

# ---------------- INCLUDE ROUTES ---------------- #
app.include_router(chat_router, prefix="/api", tags=["chats"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(resources_router, prefix="/api", tags=["resources"])
app.include_router(user_router, prefix="/api", tags=["user"])
app.include_router(mood_router, prefix="/api", tags=["mood"])
app.include_router(therapists.router, prefix="/api", tags=["therapists"])

logger.info("✅ Routers mounted successfully")

# ---------------- ROOT ---------------- #
@app.get("/")
async def root():
    return {
        "name": "Paula Chats API",
        "version": "1.0.0",
        "status": "running",
        "database": db_name,
        "collections": {
            "chats": chats_name,
            "users": users_name,
            "resources": resources_name
        },
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "chat": "/api/send"
        }
    }

# ---------------- HEALTH ---------------- #
@app.get("/health")
async def health_check():
    db_status = "unknown"

    if client is not None:
        try:
            client.admin.command('ping')
            db_status = "connected"
        except Exception as e:
            db_status = f"error: {str(e)}"
    else:
        db_status = "no client"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "hf_token": "configured" if HF_TOKEN else "missing",
        "secret_key": "configured" if SECRET_KEY else "missing"
    }

# ---------------- STARTUP ---------------- #
@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("🚀 Paula Chats API is starting...")
    logger.info(f"📚 Database: {db_name}")
    logger.info("📁 Collections: chats, users, resources")
    logger.info("🔗 API ready at /api")
    logger.info("=" * 50)

# ---------------- SHUTDOWN ---------------- #
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Shutting down API...")
    if client is not None:
        client.close()
        logger.info("✅ Database connection closed")