# paula_backend/api/services/paula_brain.py
from __future__ import annotations
import re
from typing import Optional

JAMAICA_CRISIS = {
    "new_life": "1-888-NEW-LIFE (1-888-639-5433)",
    "u_matter": "(876) 838-4897",
}

def high_risk(text: str) -> bool:
    patterns = [
        r"\bkill myself\b",
        r"\bsuicide\b",
        r"\bend my life\b",
        r"\bdon't want to live\b",
        r"\bwant to die\b",
        r"\bcan't go on\b",
        r"\bnever wake up\b",
    ]
    return any(re.search(p, text) for p in patterns)

def wants_resources(text: str) -> bool:
    return any(k in text for k in [
        "hotline", "help line", "therapist",
        "counsellor", "counselor",
        "emergency", "hospital", "clinic"
    ])

def paula_rules_engine(user_message: str) -> Optional[str]:
    text = user_message.lower().strip()

    # 🔴 HIGH RISK ONLY
    if high_risk(text):
        return (
            "I’m really glad you said something. You don’t have to face this alone. "
            f"If you’re in Jamaica, please call {JAMAICA_CRISIS['new_life']} or "
            f"the U-Matter line at {JAMAICA_CRISIS['u_matter']} right now. "
            "If you’re in immediate danger, please contact emergency services. "
            "Are you somewhere safe at this moment?"
        )

    # 🟡 LET OPENAI HANDLE EVERYTHING ELSE
    return None
