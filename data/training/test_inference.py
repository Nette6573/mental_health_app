import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models", "distilgpt2_mental_health")

def load_model_and_tokenizer():
    print(f"Loading model from: {MODEL_DIR}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForCausalLM.from_pretrained(MODEL_DIR)

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    model.resize_token_embeddings(len(tokenizer))

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    return tokenizer, model, device

def generate_reply(tokenizer, model, device, user_message, max_new_tokens=120):
    prompt = f"User: {user_message}\nAssistant:"

    inputs = tokenizer(prompt, return_tensors="pt")
    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    with torch.no_grad():
        output_ids = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            top_p=0.9,
            temperature=0.8,
            pad_token_id=tokenizer.eos_token_id,
        )

    generated = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    # Extract only the assistant part after "Assistant:"
    if "Assistant:" in generated:
        reply = generated.split("Assistant:", 1)[1].strip()
    else:
        reply = generated.strip()

    return reply

def main():
    tokenizer, model, device = load_model_and_tokenizer()
    print("✅ Model loaded. Type your message, or 'quit' to exit.\n")

    while True:
        user_message = input("You: ").strip()
        if user_message.lower() in {"quit", "exit"}:
            print("Goodbye 👋")
            break

        reply = generate_reply(tokenizer, model, device, user_message)
        print(f"\nAssistant: {reply}\n")

if __name__ == "__main__":
    main()
