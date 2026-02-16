import requests
from app.config import OLLAMA_URL, OLLAMA_MODEL
from pathlib import Path

PROMPT_PATH = Path(__file__).parent / "paula_prompt.txt"

SYSTEM_PROMPT = PROMPT_PATH.read_text(encoding="utf-8")

def ask_paula(user_message: str, history: list) -> str:
    convo = ""
    for m in history:
        role = "User" if m["role"] == "user" else "Paula"
        convo += f"{role}: {m['content']}\n"

    prompt = f"{SYSTEM_PROMPT}\n\n{convo}User: {user_message}\nPaula:"

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=300)
    response.raise_for_status()
    return response.json().get("response", "").strip()

