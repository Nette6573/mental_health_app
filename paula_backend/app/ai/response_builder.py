import random
import re
from datetime import datetime
from app.ai.understanding_engine import detect_user_type, detect_situation
from app.ai.tone_engine import get_tone
from app.ai.safety_engine import add_safety_layer
from app.ai.emotion_engine import analyze_emotional_trend
from app.ai.therapy_engine import detect_need, get_therapy_response, grounding_exercise, cbt_reframe, breathing_exercise


# ========== URGENCY DETECTION (RUNS FIRST) ==========

def detect_urgency(message: str) -> dict:
    """Returns urgency level and overrides normal flow if needed"""
    msg = message.lower()
    
    # Pattern 1: "due at 11, haven't started"
    if re.search(r"(?:due|deadline|at|by)\s+(\d{1,2})", msg) and \
       re.search(r"(haven'?t|not|never)\s+(started|begun|done|prepared|finished)", msg):
        return {
            "level": "critical",
            "action": "rapid_rescue",
            "reason": "time_bound_task_not_started"
        }
    
    # Pattern 2: Specific urgent task types
    urgent_tasks = ["presentation", "exam", "essay", "paper", "project", "report", "assignment", "homework"]
    if any(task in msg for task in urgent_tasks) and \
       re.search(r"(due|deadline|today|this\s+(morning|afternoon|evening)|tomorrow)", msg):
        
        if re.search(r"(haven'?t|not|never)\s+(started|begun|done|prepared|finished)", msg) or \
           re.search(r"(nothing|none|zero)\s+(done|complete|finished)", msg):
            return {
                "level": "critical",
                "action": "rapid_rescue",
                "reason": "deadline_approaching_task_not_started"
            }
        else:
            return {
                "level": "high",
                "action": "action_coach",
                "reason": "deadline_approaching"
            }
    
    # Pattern 3: Time pressure language
    pressure_phrases = ["running out of time", "behind schedule", "last minute", "crunch time", "panic mode", "freaking out"]
    if any(phrase in msg for phrase in pressure_phrases):
        return {
            "level": "high",
            "action": "action_coach",
            "reason": "time_pressure_language"
        }
    
    # Pattern 4: "I haven't started" alone (without due date)
    if re.search(r"(haven'?t|not)\s+started", msg) and \
       any(task in msg for task in ["presentation", "exam", "essay", "paper", "project", "report"]):
        return {
            "level": "medium",
            "action": "action_coach",
            "reason": "unstarted_task"
        }
    
    return {"level": "none", "action": None, "reason": None}


def get_urgent_response(urgency: dict, user_message: str) -> str:
    """Returns practical help response for urgent situations"""
    
    if urgency["action"] == "rapid_rescue":
        # Extract task type
        task_type = "task"
        msg = user_message.lower()
        if "presentation" in msg:
            task_type = "presentation"
        elif "essay" in msg or "paper" in msg:
            task_type = "essay"
        elif "exam" in msg or "test" in msg:
            task_type = "exam"
        elif "project" in msg:
            task_type = "project"
        
        # Extract time if present
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

    if urgency["action"] == "action_coach":
        return f"""⏰ I can hear the time pressure.

Let's lock in for **5 minutes**. What's ONE small piece you can finish right now?

- Just the outline?
- Just the first section?
- Just three bullet points?

Tell me your answer, then go do it. I'll be here when you get back. 🎯"""

    return None


def empathy_reflection(user_message):
    msg = user_message.lower()

    if "fail" in msg:
        return "That can really shake your confidence."
    if "tired" in msg:
        return "That kind of tiredness goes deeper than just sleep."
    if "stress" in msg or "stressed" in msg:
        return "That kind of pressure builds up quietly."
    if "overwhelmed" in msg:
        return "When everything piles up, it can feel like too much at once."
    if "anxious" in msg or "anxiety" in msg:
        return "That anxious feeling can sit heavy in your chest."
    # Skip empathy for urgent situations
    if "haven't started" in msg or "not started" in msg:
        return None

    return None


def get_resource_link(resource_type: str) -> str:
    base = "https://hopepath.online/dashboard"

    return {
        "therapy": f"{base}/therapists",
        "meditation": f"{base}/resources/self-help",
        "crisis": f"{base}/resources/crisis"
    }.get(resource_type, base)


def build_response(user_message, chat_memory, stage):
    
    # ========== STEP 1: CHECK URGENCY FIRST (OVERRIDES EVERYTHING) ==========
    urgency = detect_urgency(user_message)
    if urgency["action"] in ["rapid_rescue", "action_coach"]:
        urgent_response = get_urgent_response(urgency, user_message)
        if urgent_response:
            # Add disclaimer at the END for urgent responses
            disclaimer = "\n\n💛 *Quick note: I'm here to support you practically. If this feels overwhelming, please reach out to a trusted person or professional.*"
            return add_safety_layer(urgent_response + disclaimer)
    
    # ========== STEP 2: NORMAL FLOW (ONLY IF NOT URGENT) ==========
    
    response = []
    asked_question = False

    emotion = (chat_memory or {}).get("emotional_state")
    issues = (chat_memory or {}).get("main_issues", [])
    risk_flags = (chat_memory or {}).get("risk_flags", [])

    user_type = detect_user_type(user_message)
    trend = analyze_emotional_trend(chat_memory or {})
    situation = detect_situation(user_message)

    tone = get_tone(user_type, trend, stage)

    # ---------------- OPENING ---------------- #
    response.append(random.choice([
        "Mi hear yuh 💛",
        "I'm right here with you.",
        "Tell me what's going on."
    ]))

    # ---------------- EMOTION ---------------- #
    if emotion and stage != "deep":
        response.append(f"It sounds like you're feeling {emotion}.")

    reflection = empathy_reflection(user_message)
    if reflection:
        response.append(reflection)

    # ---------------- SITUATION ---------------- #
    if situation == "financial":
        response.append("Money stress can feel really heavy… especially when bills start piling up.")
        response.append("What's the most urgent bill right now?")
        asked_question = True

    elif situation == "academic":
        # Check if they mentioned a deadline
        if "due" in user_message.lower() or "deadline" in user_message.lower():
            response.append("School deadlines can feel crushing when you're behind. Do you want help breaking down what to do first?")
            asked_question = True
        else:
            response.append("School pressure can pile up fast… especially when things aren't sticking.")

    elif situation == "relationship":
        response.append("Relationship stress can hit deep… especially when it involves someone you care about.")

    # ---------------- MEMORY ---------------- #
    if issues and situation is None:
        response.append(f"This seems to keep coming up, especially around {issues[0]}.")

    # ---------------- TREND ---------------- #
    if trend == "declining":
        response.append("I've noticed things have been feeling heavier over time…")

    if trend == "chronic_stress":
        response.append("It seems like your mind hasn't had a real break in a while.")

    # ---------------- RISK ---------------- #
    if "burnout_risk" in risk_flags and stage == "deep":
        response.append("You might be reaching burnout. Your body needs real rest.")

    if "depression_risk" in risk_flags:
        response.append(f"You don't have to carry this alone.\n👉 {get_resource_link('therapy')}")

    # ---------------- ADAPTIVE ---------------- #
    if not asked_question:
        if user_type == "withdrawn":
            response.append("You don't have to say much… I'm here with you.")
        elif user_type == "emotional":
            response.append("What part of this feels the heaviest right now?")
        elif user_type == "analytical":
            response.append("Let's break it down step by step.")
        else:
            response.append("Tell me more about what's going on.")

    # ---------------- THERAPY ---------------- #
    if stage == "deep":
        need = detect_need(user_message)
        if need:
            therapy_response = get_therapy_response(need, user_message)
            if therapy_response:
                response.append(therapy_response)

    final = "\n\n".join(response[:5])  # Keep responses concise

    return add_safety_layer(final)