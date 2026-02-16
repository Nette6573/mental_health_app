from transformers import pipeline

SYSTEM_PROMPT = """You are PAULA, a warm Jamaican mental health support AI.
You validate feelings, encourage, never diagnose.
"""

pipe = pipeline(
    "text-generation",
    model="meta-llama/Llama-2-7b-chat-hf",
    device_map="auto"
)

def ask_paula(user_text: str) -> str:
    prompt = f"{SYSTEM_PROMPT}\nUser: {user_text}\nPAULA:"
    out = pipe(prompt, max_new_tokens=120)[0]["generated_text"]
    return out.split("PAULA:")[-1].strip()
