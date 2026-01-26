from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.chat import router as chat_router
from api.routes.health_info import router as health_router

app = FastAPI(
    title="Mental Health AI Assistant",
    description="Chatbot + Jamaican Mental Health Facility Finder",
    version="1.0"
)

# Allow frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # You can later restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat_router, prefix="/chat", tags=["Chatbot"])
app.include_router(health_router, prefix="/health", tags=["Health Facilities"])

@app.get("/")
def home():
    return {"message": "Mental Health API is running"}
