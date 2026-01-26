import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForCausalLM

# Path to the main project directory (mental_health_app)
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Path to the model folder
MODEL_PATH = PROJECT_ROOT / "models" / "distilgpt2_mental_health"

print("🚀 Loading model from:", MODEL_PATH)

# Load tokenizer + model
tokenizer = AutoTokenizer.from_pretrained(
    str(MODEL_PATH),
    local_files_only=True
)

model = AutoModelForCausalLM.from_pretrained(
    str(MODEL_PATH),
    local_files_only=True
)

# ✅ CRITICAL FIX: set pad token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
    model.config.pad_token_id = tokenizer.eos_token_id

# Device setup
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
model.eval()

print("✅ Model loaded successfully.")
