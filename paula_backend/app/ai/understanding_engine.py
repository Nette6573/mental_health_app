def detect_user_type(message: str) -> str:
    msg = message.lower()

    if any(w in msg for w in ["sad", "hurt", "feel", "stressed", "overwhelmed"]):
        return "emotional"

    if len(msg.split()) < 4:
        return "withdrawn"

    if any(w in msg for w in ["why", "how"]):
        return "analytical"

    return "balanced"


def detect_situation(message: str):
    msg = message.lower()

    if any(w in msg for w in ["bill", "money", "rent", "broke"]):
        return "financial"

    if any(w in msg for w in ["exam", "school", "study"]):
        return "academic"

    if any(w in msg for w in ["relationship", "partner", "boyfriend", "girlfriend"]):
        return "relationship"

    return None