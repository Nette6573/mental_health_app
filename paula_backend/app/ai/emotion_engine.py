def analyze_emotional_trend(chat_memory):

    history = chat_memory.get("emotion_history", [])

    if len(history) < 3:
        return "stable"

    emotions = [h["emotion"] for h in history[-3:]]

    if all(e in ["sad", "low"] for e in emotions):
        return "declining"

    if all(e == "stressed" for e in emotions):
        return "chronic_stress"

    if len(set(emotions)) == 1:
        return "persistent"

    return "mixed"