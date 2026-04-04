def generate_insights(user):

    moods = user.get("mood_log", [])
    goals = user.get("goals", [])

    insights = []

    # -------- MOOD TREND --------
    if len(moods) >= 5:
        recent = moods[-5:]
        avg = sum(m["mood"] for m in recent) / len(recent)

        if avg < 4:
            insights.append("You've been feeling low recently. It may help to talk to someone or take a break.")
        elif avg > 7:
            insights.append("Your mood has been good lately. Keep doing what's working.")

    # -------- CONSISTENCY --------
    if len(moods) >= 7:
        insights.append("You're consistently tracking your mood. That’s a powerful habit.")

    # -------- GOALS --------
    if len(goals) >= 3:
        insights.append("You're actively setting goals. This shows strong personal growth.")

    return insights