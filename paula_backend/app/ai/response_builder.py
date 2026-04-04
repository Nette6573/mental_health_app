import random
from app.ai.understanding_engine import detect_user_type, detect_situation
from app.ai.tone_engine import get_tone
from app.ai.safety_engine import add_safety_layer
from app.ai.emotion_engine import analyze_emotional_trend
from app.ai.therapy_engine import detect_need, grounding_exercise, cbt_reframe, breathing_exercise


def empathy_reflection(user_message):
    msg = user_message.lower()

    if "fail" in msg:
        return "That can really shake your confidence."
    if "tired" in msg:
        return "That kind of tiredness goes deeper than just sleep."
    if "stress" in msg:
        return "That kind of pressure builds up quietly."
    if "overwhelmed" in msg:
        return "When everything piles up, it can feel like too much at once."

    return None


def get_resource_link(resource_type: str) -> str:
    base = "https://hopepath.online/dashboard"

    return {
        "therapy": f"{base}/therapists",
        "meditation": f"{base}/resources/self-help",
        "crisis": f"{base}/resources/crisis"
    }.get(resource_type, base)


def build_response(user_message, chat_memory, stage):
    response = []
    asked_question = False  # 🔥 controls repetition

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
        "Talk to me… what’s weighing on you most?",
        "What part of this stress feels the heaviest right now?"
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
        response.append("What’s the most urgent bill right now?")
        asked_question = True

    elif situation == "academic":
        response.append("School pressure can pile up fast… especially when things aren’t sticking.")

    elif situation == "relationship":
        response.append("Relationship stress can hit deep… especially when it involves someone you care about.")

    # ---------------- MEMORY ---------------- #
    if issues and situation is None:
        response.append(f"This seems to keep coming up, especially around {issues[0]}.")

    # ---------------- TREND ---------------- #
    if trend == "declining":
        response.append("I’ve noticed things have been feeling heavier over time…")

    if trend == "chronic_stress":
        response.append("It seems like your mind hasn’t had a real break in a while.")

    # ---------------- RISK ---------------- #
    if "burnout_risk" in risk_flags and stage == "deep":
        response.append("You might be reaching burnout. Your body needs real rest.")

    if "depression_risk" in risk_flags:
        response.append(f"You don’t have to carry this alone.\n👉 {get_resource_link('therapy')}")

    # ---------------- ADAPTIVE ---------------- #
    if not asked_question:
        if user_type == "withdrawn":
            response.append("You don’t have to say much… I’m here with you.")
        elif user_type == "emotional":
            response.append("What part a this feel the heaviest right now?")
        elif user_type == "analytical":
            response.append("Let’s break it down step by step.")
        else:
            response.append("Tell me more about what’s going on.")

    # ---------------- THERAPY ---------------- #
    if stage == "deep":
        intervention = detect_need(user_message)

        if intervention == "grounding":
            response.append(grounding_exercise())
        elif intervention == "cbt":
            response.append(cbt_reframe())
        elif intervention == "breathing":
            response.append(breathing_exercise())

    final = "\n\n".join(response[:5])

    return add_safety_layer(final)