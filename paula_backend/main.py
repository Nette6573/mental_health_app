from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.chat import router as chat_router

app = FastAPI(title="Paula Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 THIS IS THE FIX
app.include_router(chat_router, prefix="/chat", tags=["chat"])

@app.get("/")
def root():
    return {"status": "Paula backend running"}
