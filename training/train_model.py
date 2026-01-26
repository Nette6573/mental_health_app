import os
import json
import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)

# ----------------------------------------
# FIXED PATH LOGIC — ALWAYS CORRECT NOW
# ----------------------------------------
current_dir = os.path.dirname(os.path.abspath(__file__))      # /training
BASE_DIR = os.path.dirname(current_dir)                       # project root

DATA_PATH = os.path.join(
    BASE_DIR, "data", "training", "comprehensive_training_data.json"
)

OUTPUT_DIR = os.path.join(
    BASE_DIR, "models", "distilgpt2_mental_health"
)

MODEL_NAME = "distilgpt2"


def load_dataset():
    print(f"Loading training data from: {DATA_PATH}")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Ensure dataset is list of {"text": "..."}
    dataset = Dataset.from_list(data)
    print(f"Training on {len(dataset)} examples.")
    return dataset


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    # 1. Load tokenizer
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token  # fix padding issue

    # 2. Load model
    print("Loading model...")
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
    model.resize_token_embeddings(len(tokenizer))
    model.to(device)

    # 3. Load dataset
    dataset = load_dataset()

    # 4. Tokenization function
    def tokenize_function(batch):
        return tokenizer(
            batch["text"],
            truncation=True,
            padding="max_length",
            max_length=256,
        )

    print("Tokenizing dataset...")
    tokenized_dataset = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset.column_names,
    )

    # 5. Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False
    )

    # 6. Training arguments
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        overwrite_output_dir=True,
        num_train_epochs=2,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        learning_rate=5e-5,
        warmup_steps=50,
        weight_decay=0.01,
        logging_steps=10,
        save_steps=200,
        save_total_limit=2,
        report_to=None,         # disable wandb
        prediction_loss_only=True,
        fp16=False,             # CPU only
    )

    # 7. Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=data_collator,
    )

    print("🚀 Starting training...")
    trainer.train()

    print("💾 Saving model...")
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    print(f"✅ Training complete. Model stored at: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
