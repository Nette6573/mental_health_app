def detect_need(user_message: str):

    msg = user_message.lower()

    if any(w in msg for w in ["overwhelmed", "stress", "too much"]):
        return "grounding"

    if any(w in msg for w in ["fail", "not good enough", "useless"]):
        return "cbt"

    if any(w in msg for w in ["anxious", "panic"]):
        return "breathing"

    return None


# ---------------- CBT ---------------- #

def cbt_reframe():
    return (
        "Let’s slow that thought down for a second 💭\n\n"
        "What’s the evidence that this thought is completely true?\n"
        "And what’s one small possibility that it might not be 100% accurate?"
    )


# ---------------- GROUNDING ---------------- #

def grounding_exercise():
    return (
        "Let’s pause together for a moment 💛\n\n"
        "Try this with me:\n"
        "• Name 5 things you can see\n"
        "• 4 things you can touch\n"
        "• 3 things you can hear\n"
        "• 2 things you can smell\n"
        "• 1 thing you can feel inside\n\n"
        "No rush—just take it one step at a time."
    )


# ---------------- BREATHING ---------------- #

def breathing_exercise():
    return (
        "Let’s slow things down together 🌿\n\n"
        "Breathe in for 4 seconds…\n"
        "Hold for 4…\n"
        "Breathe out slowly for 6…\n\n"
        "Let’s do that a few times."
    )