import os
import json

# -----------------------------
# FIXED BASE DIRECTORY LOGIC
# -----------------------------
# This file lives at: mental_health_app/data/training/merge_datasets.py
# We want BASE_DIR to resolve to: mental_health_app/data
current_dir = os.path.dirname(os.path.abspath(__file__))    # → /data/training
BASE_DIR = os.path.dirname(current_dir)                     # → /data

# Output dataset path
OUTPUT_PATH = os.path.join(BASE_DIR, "training", "comprehensive_training_data.json")


def load_json(path):
    """Load a JSON file safely."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_text(entry):
    """Convert any type of training entry into a simple {text: "..."} format."""

    # If already a plain string
    if isinstance(entry, str):
        return {"text": entry}

    # If object/dict
    if isinstance(entry, dict):

        # Already valid
        if "text" in entry:
            return {"text": entry["text"]}

        # Conversation entries
        if "prompt" in entry and "response" in entry:
            return {"text": f"User: {entry['prompt']}\nAssistant: {entry['response']}"}

        # Bible verses by topic
        if "verse" in entry and "topic" in entry:
            return {"text": f"{entry['topic']}: {entry['verse']}"}

        # Bible characters struggles
        if "character" in entry and "struggle" in entry and "verse" in entry:
            return {
                "text": f"{entry['character']} struggled with {entry['struggle']}. Scripture: {entry['verse']}"
            }

        # Mental health facilities
        if "name" in entry and "parish" in entry:
            return {
                "text": f"{entry['name']} in {entry['parish']}. Contact: {entry.get('phone', 'N/A')}"
            }

        # Churches
        if "church" in entry and "parish" in entry:
            return {
                "text": f"{entry['church']} located in {entry['parish']}. Contact: {entry.get('contact', 'N/A')}"
            }

        # Counsellors
        if "counsellor" in entry and "parish" in entry:
            return {
                "text": f"{entry['counsellor']} in {entry['parish']} — Contact: {entry.get('phone', 'N/A')}"
            }

        # Helplines
        if "name" in entry and "number" in entry:
            return {
                "text": f"{entry['name']} Helpline — {entry['number']}"
            }

    # Fallback for unknown formats
    return {"text": json.dumps(entry)}


def main():
    # All datasets that should be merged
    sources = [
        "training/talking.json",
        "training/extra_conversations.json",
        "bible/bible_verses_by_topic.json",
        "bible/characters_struggles.json",
        "facilities/facilities_by_parish.json",
        "facilities/churches_by_parish.json",
        "facilities/psychologists_and_counsellors.json",
        "health_info/jamaica_helplines.json",
    ]

    all_items = []

    for relative_path in sources:
        full_path = os.path.join(BASE_DIR, relative_path)
        print(f"Loading: {full_path}")

        data = load_json(full_path)

        # Handle lists directly
        if isinstance(data, list):
            for item in data:
                all_items.append(ensure_text(item))

        # Handle dicts containing lists
        elif isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, list):
                    for item in value:
                        all_items.append(ensure_text(item))
                else:
                    all_items.append(ensure_text(value))

    print(f"\nCollected items: {len(all_items)}")
    print("Saving clean dataset...")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=4, ensure_ascii=False)

    print(f"✅ DONE! Saved to: {OUTPUT_PATH}")
    print(f"📊 Total clean training examples: {len(all_items)}")


if __name__ == "__main__":
    main()
