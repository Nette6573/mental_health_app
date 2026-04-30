import re

def detect_need(user_message: str):
    msg = user_message.lower()

    # ========== NEW: URGENT PRACTICAL CRISIS (HIGHEST PRIORITY) ==========
    
    # Pattern 1: Time-bound task not started
    if any(w in msg for w in ["due", "deadline", "today", "this morning", "this afternoon"]) and \
       any(w in msg for w in ["haven't started", "not started", "nothing done", "not even started", "haven't begun"]):
        return "practical_crisis"
    
    # Pattern 2: Explicit deadline with concrete task
    time_match = re.search(r"(?:due|at|by)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", msg)
    if time_match and any(w in msg for w in ["presentation", "exam", "essay", "paper", "project", "report", "assignment"]):
        return "practical_crisis"
    
    # Pattern 3: "Running out of time" language
    if any(w in msg for w in ["running out of time", "crunch", "last minute", "panic mode", "freaking out"]):
        return "practical_crisis"

    # ========== EXISTING DETECTIONS ==========
    
    if any(w in msg for w in ["overwhelmed", "stress", "too much"]):
        return "grounding"

    if any(w in msg for w in ["fail", "not good enough", "useless", "stupid", "terrible", "worthless"]):
        return "cbt"

    if any(w in msg for w in ["anxious", "panic", "scared", "worried", "nervous"]):
        return "breathing"

    return None


# ========== NEW: PRACTICAL CRISIS INTERVENTIONS ==========

def practical_rescue_plan(user_message: str = "") -> str:
    """Returns a rapid rescue plan for deadline situations"""
    
    # Try to extract the task type
    task_type = "task"
    if "presentation" in user_message.lower():
        task_type = "presentation"
    elif "essay" in user_message.lower() or "paper" in user_message.lower():
        task_type = "essay"
    elif "exam" in user_message.lower() or "test" in user_message.lower():
        task_type = "exam"
    
    # Try to extract deadline time
    time_match = re.search(r"(?:due|at|by)\s+(\d{1,2})", user_message)
    time_str = f" by {time_match.group(1)}" if time_match else ""
    
    return f"""🫂 I hear you — and I'm switching into rescue mode.

You have a {task_type} due{time_str} and haven't started yet. Let's skip the panic and take action.

**3-step rescue plan (60 seconds):**

1️⃣ **Open the file** — slides, doc, or book. Just open it. Right now.

2️⃣ **Write the title/name** — that's it. Just get something on the page.

3️⃣ **Add 3 bullet points** — messy, incomplete, ugly. Just get words down.

👉 Come back and tell me *"Done — what's next?"*

You don't need perfect. You just need started. 💛"""


def rapid_action_coach() -> str:
    """Returns a coaching response for time pressure without panic"""
    return f"""⏰ I can hear the time pressure.

Let's lock in for **5 minutes**. What's ONE small piece you can finish right now?

- Just the outline?
- Just the first section?
- Just three bullet points?

Tell me your answer, then go do it. I'll be here when you get back. 🎯"""


# ========== EXISTING INTERVENTIONS ==========

def cbt_reframe():
    return (
        "Let's slow that thought down for a second 💭\n\n"
        "What's the evidence that this thought is completely true?\n"
        "And what's one small possibility that it might not be 100% accurate?"
    )


def grounding_exercise():
    return (
        "Let's pause together for a moment 💛\n\n"
        "Try this with me:\n"
        "• Name 5 things you can see\n"
        "• 4 things you can touch\n"
        "• 3 things you can hear\n"
        "• 2 things you can smell\n"
        "• 1 thing you can feel inside\n\n"
        "No rush—just take it one step at a time."
    )


def breathing_exercise():
    return (
        "Let's slow things down together 🌿\n\n"
        "Breathe in for 4 seconds…\n"
        "Hold for 4…\n"
        "Breathe out slowly for 6…\n\n"
        "Let's do that a few times."
    )


def get_therapy_response(need: str, user_message: str = "") -> str:
    """Returns the appropriate response based on detected need"""
    
    if need == "practical_crisis":
        return practical_rescue_plan(user_message)
    elif need == "grounding":
        return grounding_exercise()
    elif need == "cbt":
        return cbt_reframe()
    elif need == "breathing":
        return breathing_exercise()
    
    return None