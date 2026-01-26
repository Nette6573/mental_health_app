# paula_backend/api/services/inference.py

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

from api.services.paula_brain import paula_rules_engine
from api.services.paula_system_prompt import PAULA_SYSTEM_PROMPT
from api.services.memory import (
    fetch_long_term_memory,
    store_long_term_memory,
)

# ----------------------------
#  LOCATE MODEL
# ----------------------------
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
MODEL_PATH = os.path.join(BASE_DIR, "models", "distilgpt2_mental_health")

# ----------------------------
#  LOAD MODEL (ONCE)
# ----------------------------
try:
    print(f"🚀 Loading model from: {MODEL_PATH}")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)
    model.eval()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    print("✅ Model loaded successfully.")

except Exception as e:
    raise RuntimeError(
        f"❌ Failed to load model from {MODEL_PATH}. Error: {str(e)}"
    )

# --------------------------------------------------
#  MAIN RESPONSE GENERATOR (USED BY chat.py)
# --------------------------------------------------
def generate_response(
    user_message: str,
    conversation_history: list | None = None,
    session_id: str = "default",
    user_id: str = "anonymous",
) -> str:
    """
    Generates Paula's response using:
    - Safety + rules engine first
    - Conversation history
    - Long-term memory
    - Local language model fallback
    """

    # ---------------------
    # 1️⃣ RULES ENGINE FIRST (SAFETY)
    # ---------------------
    rule_response = paula_rules_engine(user_message)
    if rule_response:
        return rule_response

    # ---------------------
    # 2️⃣ BUILD HISTORY TEXT
    # ---------------------
    history_text = ""
    if conversation_history:
        for msg in conversation_history[-6:]:  # limit context
            speaker = "User" if msg["sender"] == "user" else "Paula"
            history_text += f"{speaker}: {msg['text']}\n"

    # ---------------------
    # 3️⃣ FETCH LONG-TERM MEMORY
    # ---------------------
    long_term = fetch_long_term_memory(user_id)
    memory_text = ""

    if long_term:
        memory_text = "User background:\n"
        for item in long_term:
            summary = item.get("memory", {}).get("summary")
            if summary:
                memory_text += f"- {summary}\n"

    # ---------------------
    # 4️⃣ BUILD PROMPT (SYSTEM PROMPT + CONTEXT)
    # ---------------------
    prompt = f"""
{PAULA_SYSTEM_PROMPT}

Conversation so far:
{history_text}

{memory_text}

User just said:
{user_message}

Paula responds:
"""

    # ---------------------
    # 5️⃣ GENERATE RESPONSE
    # ---------------------
    try:
        input_ids = tokenizer.encode(
            prompt,
            return_tensors="pt"
        ).to(device)

        output = model.generate(
            input_ids,
            max_length=120,
            temperature=0.6,
            top_p=0.85,
            repetition_penalty=1.2,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
        )

        response = tokenizer.decode(
            output[0],
            skip_special_tokens=True
        ).strip()

    except Exception as e:
        print("❌ Generation error:", e)
        return "Mi deh yah wid yuh. Tell mi more."

    # ---------------------
    # 6️⃣ CLEAN RESPONSE
    # ---------------------
    if "Paula responds:" in response:
        response = response.split("Paula responds:", 1)[-1].strip()

    if not response:
        response = "Mi deh yah wid yuh. Tell mi more."

    # Hard stop runaway text
    if len(response.split()) > 80:
        response = " ".join(response.split()[:60])

    # ---------------------
    # 7️⃣ STORE LONG-TERM MEMORY (LIGHT HEURISTIC)
    # ---------------------
    if any(
        word in user_message.lower()
        for word in ["stress", "money", "family", "alone"]
    ):
        store_long_term_memory(
            user_id,
            {"summary": f"User mentioned: {user_message}"}
        )

    return response
