from datetime import datetime, timedelta

def analyze_user_behavior(user):

    moods = user.get("mood_log", [])
    goals = user.get("goals", [])

    signals = []

    # -------- LOW MOOD TREND --------
    if len(moods) >= 3:
        recent = moods[-3:]
        avg = sum(m["mood"] for m in recent) / len(recent)

        if avg <= 4:
            signals.append("low_mood_trend")

    # -------- INACTIVITY --------
    if moods:
        last_entry = moods[-1]["date"]
        if isinstance(last_entry, str):
            last_entry = datetime.fromisoformat(last_entry)

        if datetime.utcnow() - last_entry > timedelta(days=3):
            signals.append("inactive")

    # -------- GOAL NEGLECT --------
    if goals:
        incomplete = [g for g in goals if g["current"] < g["target"]]
        if len(incomplete) >= 2:
            signals.append("goal_stagnation")

    return signals


def generate_proactive_message(signals):

    if not signals:
        return None

    if "low_mood_trend" in signals:
        return (
            "Hey… I’ve noticed things might have been feeling a bit heavy lately 💛\n\n"
            "You don’t have to go through it alone. Want to talk about what’s been going on?"
        )

    if "inactive" in signals:
        return (
            "Hey, I haven’t seen you check in for a few days 💭\n\n"
            "Even a quick mood check can help you stay aware of how you're feeling."
        )

    if "goal_stagnation" in signals:
        return (
            "I noticed some of your goals haven’t moved in a bit 📌\n\n"
            "That’s okay—progress isn’t always linear. Want to reset one together?"
        )

    return None