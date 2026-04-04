def get_tone(user_type, trend, stage):
    tone = "balanced"

    if user_type == "withdrawn":
        tone = "gentle"
    elif user_type == "emotional":
        tone = "warm"
    elif user_type == "analytical":
        tone = "structured"

    if trend == "declining":
        tone += " + supportive"

    if trend == "chronic_stress":
        tone += " + calming"

    if stage == "deep":
        tone += " + reflective"

    return tone