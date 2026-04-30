def detect_user_type(message: str) -> str:
    msg = message.lower()

    if any(w in msg for w in ["sad", "hurt", "feel", "stressed", "overwhelmed"]):
        return "emotional"

    if len(msg.split()) < 4:
        return "withdrawn"

    if any(w in msg for w in ["why", "how"]):
        return "analytical"

    return "balanced"


def detect_situation(message: str) -> str:
    msg = message.lower()

    # EXPANDED: Added presentation, due, deadline, homework, assignment, class, project, essay, paper
    if any(w in msg for w in ["exam", "school", "study", "presentation", "due", "deadline", "homework", "assignment", "class", "project", "essay", "paper", "test", "quiz"]):
        return "academic"

    if any(w in msg for w in ["bill", "money", "rent", "broke", "financial", "debt", "owe"]):
        return "financial"

    if any(w in msg for w in ["relationship", "partner", "boyfriend", "girlfriend", "lonely", "friend", "marriage", "dating", "breakup"]):
        return "relationship"

    return None