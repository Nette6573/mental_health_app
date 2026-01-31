import os
from fastapi import FastAPI
import httpx

app = FastAPI()

CHATBASE_API_KEY = os.getenv("CHATBASE_API_KEY")
CHATBASE_AGENT_ID = os.getenv("CHATBASE_AGENT_ID")

@app.post("/chat")
async def chat(message: str):
    if not CHATBASE_API_KEY or not CHATBASE_AGENT_ID:
        return {"response": "Fallback: Chatbase API key or agent ID missing"}

    url = "https://api.chatbase.co/v1/query"
    headers = {"Authorization": f"Bearer {CHATBASE_API_KEY}"}
    payload = {"message": message, "agent": CHATBASE_AGENT_ID}

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            return {"response": data.get("response", "No reply")}
        else:
            return {"response": "Fallback: Chatbase API failed"}
