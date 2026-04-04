def detect_crisis(message: str) -> bool:
    msg = message.lower()
    return any(word in msg for word in [
        "suicide", "kill myself", "want to die",
        "end my life", "self harm", "better off dead"
    ])


def safe_crisis_response():
    return (
        "Mi really glad yuh reached out 💛\n\n"
        "What you're going through sounds serious. You don’t have to handle this alone.\n\n"
        "Please reach out right now:\n"
        "📞 888-NEW-LIFE (639-5433)\n"
        "🚑 119\n\n"
        "https://hopepath.online/dashboard/resources/crisis\n\n"
        "If you can, try to stay near someone you trust."
    )


def add_safety_layer(response_text):
    return (
        response_text +
        "\n\n💛 Just a reminder: I'm here to support you, but I'm not a licensed therapist. "
        "If things feel overwhelming, speaking with a professional can really help."
    )