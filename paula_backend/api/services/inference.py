# paula_backend/api/services/inference.py
from __future__ import annotations

import os
import re
from typing import List, Dict, Optional

from openai import OpenAI, OpenAIError, RateLimitError

from api.services.paula_brain import (
    paula_rules_engine,
    wants_resources,
    JAMAICA_CRISIS,
)
from api.services.memory import fetch_long_term_memory, store_long_term_memory

# ----------------------------
# CONFIG
# ----------------------------
MODEL_NAME = "gpt-4o"  # ✅ stable + enabled
DEMO_MODE = os.getenv("PAULA_DEMO_MODE", "0") == "1"

_client: Optional[OpenAI] = None


def _get_client() -> Optional[OpenAI]:
    global _client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ OPENAI_API_KEY not set")
        return None

    if _client is None:
        _client = OpenAI(api_key=api_key, timeout=20.0)

    return _client


# ----------------------------
# SYSTEM PROMPT
# ----------------------------
SYSTEM_PROMPT = """
You are Paula, a warm, grounded mental health support companion for adults in Jamaica.

Guidelines:
- Sound natural, human, and emotionally present
- 2–4 sentences unless safety requires more
- Reflect the user's feelings before offering guidance
- Ask at most ONE open-ended question
- Avoid scripted or repetitive phrasing
- Do not diagnose or replace professional care
"""


def _clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    sentences = re.split(r"(?<=[.!?])\s+", text)
    return " ".join(sentences[:4]).strip()


def _history_to_messages(
    history: Optional[List[Dict]]
) -> List[Dict]:
    if not history:
        return []

    messages: List[Dict] = []

    for m in history[-8:]:
        if not m.get("text"):
            continue

        role = "assistant" if m.get("sender") == "paula" else "user"
        messages.append({
            "role": role,
            "content": m["text"]
        })

    return messages


# ----------------------------
# MAIN GENERATOR
# ----------------------------
def generate_response(
    user_message: str,
    conversation_history: Optional[List[Dict]] = None,
    session_id: str = "default",
    user_id: str = "anonymous",
) -> str:

    user_message = (user_message or "").strip()
    if not user_message:
        return "Could you say that again a bit differently?"

    # 🔴 SAFETY FIRST
    rule = paula_rules_engine(user_message)
    if rule:
        return rule

    client = _get_client()

    # 🟡 DEMO MODE
    if DEMO_MODE or client is None:
        return "Thanks for telling me that. What feels hardest right now?"

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += _history_to_messages(conversation_history)
    messages.append({"role": "user", "content": user_message})

    try:
        print("🔥 USING OPENAI API")

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.6,
            presence_penalty=0.6,
            frequency_penalty=0.5,
            max_tokens=180,
        )

        text = _clean(response.choices[0].message.content or "")

    except RateLimitError as e:
        print("❌ RateLimitError:", e)
        text = "I’m having a brief system issue, but we can still talk."

    except OpenAIError as e:
        print("❌ OpenAIError:", e)
        text = "I’m having trouble responding right now."

    except Exception as e:
        print("❌ Unexpected error:", e)
        text = "Tell me a little more about what’s going on."

    # 🔗 RESOURCES
    if wants_resources(user_message.lower()):
        text += (
            f" If you’re in Jamaica, you can reach "
            f"{JAMAICA_CRISIS['new_life']} or the U-Matter line at {JAMAICA_CRISIS['u_matter']}."
        )

    # 🧠 MEMORY (light)
    if user_id != "anonymous":
        store_long_term_memory(
            user_id,
            {"summary": f"User discussed: {user_message}"}
        )

    return text
