import json
import os

# path to backend/api/services
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# backend/api
API_DIR = os.path.dirname(CURRENT_DIR)

# backend
BACKEND_DIR = os.path.dirname(API_DIR)

# project root (mental_health_app)
ROOT_DIR = os.path.dirname(BACKEND_DIR)

# Correct path to your real file
FACILITY_FILE = os.path.join(ROOT_DIR, "data", "facilities", "facilities_by_parish.json")

print("📁 Loading facilities from:", FACILITY_FILE)  # debug

with open(FACILITY_FILE, "r", encoding="utf-8") as f:
    FACILITIES = json.load(f)

# Your JSON has:  { "parishes": [ ... ] }
PARISH_LIST = FACILITIES.get("parishes", [])

def get_facilities_by_parish(parish: str):
    parish = parish.lower().strip()

    for entry in PARISH_LIST:
        if entry["parish"].lower() == parish:
            return entry

    return {"error": f"No facilities found for '{parish}'"}
