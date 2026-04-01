# app/routes/resources.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Define response models
class Resource(BaseModel):
    id: str
    title: str
    description: str
    link: str
    category: str
    icon: Optional[str] = None
    tags: List[str] = []

class Therapist(BaseModel):
    id: str
    name: str
    parish: str
    specialty: List[str]
    contact: str
    email: Optional[str] = None
    image: Optional[str] = None

class ResourceCategory(BaseModel):
    name: str
    title: str
    description: str
    resources: List[Resource]

# Sample data - you can move this to MongoDB later
RESOURCES_DATA = {
    "faith": {
        "title": "Faith-Based Support & Counseling",
        "description": "Spiritual guidance, pastoral counseling, and faith communities",
        "resources": [
            {
                "id": "daily-devotional",
                "title": "Daily Devotional",
                "description": "Start your day with scripture, prayer, and reflection",
                "link": "/faith/devotional",
                "category": "faith",
                "icon": "🙏",
                "tags": ["prayer", "scripture", "daily"]
            },
            {
                "id": "prayer-wall",
                "title": "Prayer Wall",
                "description": "Share prayer requests and pray for others in the community",
                "link": "/faith/prayer-wall",
                "category": "faith",
                "icon": "🕯️",
                "tags": ["prayer", "community"]
            },
            {
                "id": "scripture-study",
                "title": "Scripture Study",
                "description": "Join virtual Bible study groups and devotionals",
                "link": "/faith/scripture-study",
                "category": "faith",
                "icon": "📖",
                "tags": ["bible", "study", "group"]
            },
            {
                "id": "faith-community",
                "title": "Faith Community",
                "description": "Connect with local churches and faith-based organizations",
                "link": "/faith/community",
                "category": "faith",
                "icon": "⛪",
                "tags": ["church", "community", "local"]
            }
        ]
    },
    "professional": {
        "title": "Professional Mental Health Support",
        "description": "Licensed counselors, psychologists, and mental health services in Jamaica",
        "resources": [
            {
                "id": "find-therapist",
                "title": "Find a Therapist",
                "description": "Search for licensed mental health professionals in your area",
                "link": "/therapists",
                "category": "professional",
                "icon": "👩‍⚕️",
                "tags": ["therapist", "counselor", "professional"]
            },
            {
                "id": "crisis-hotline",
                "title": "Crisis Helpline",
                "description": "24/7 immediate support - call 888-NEW-LIFE (639-5433)",
                "link": "tel:8886395433",
                "category": "professional",
                "icon": "📞",
                "tags": ["crisis", "emergency", "24-7"]
            }
        ]
    },
    "self-help": {
        "title": "Self-Help Tools & Coping Strategies",
        "description": "Practical tools, exercises, and techniques for managing mental health",
        "resources": [
            {
                "id": "mindfulness",
                "title": "Mindfulness Exercises",
                "description": "Guided meditation and breathing exercises for anxiety relief",
                "link": "/self-help/mindfulness",
                "category": "self-help",
                "icon": "🧘",
                "tags": ["mindfulness", "meditation", "anxiety"]
            },
            {
                "id": "journal",
                "title": "Mood Journal",
                "description": "Track your emotions and identify patterns",
                "link": "/self-help/journal",
                "category": "self-help",
                "icon": "📝",
                "tags": ["journal", "tracking", "mood"]
            },
            {
                "id": "cbt-exercises",
                "title": "CBT Exercises",
                "description": "Cognitive Behavioral Therapy techniques you can practice at home",
                "link": "/self-help/cbt",
                "category": "self-help",
                "icon": "🧠",
                "tags": ["cbt", "therapy", "exercises"]
            }
        ]
    },
    "community": {
        "title": "Community Support Groups",
        "description": "Connect with others who understand what you're going through",
        "resources": [
            {
                "id": "support-groups",
                "title": "Support Groups",
                "description": "Join virtual and in-person support groups in your area",
                "link": "/community/groups",
                "category": "community",
                "icon": "👥",
                "tags": ["groups", "support", "virtual"]
            },
            {
                "id": "peer-support",
                "title": "Peer Support Network",
                "description": "Connect with trained peer supporters who understand",
                "link": "/community/peer-support",
                "category": "community",
                "icon": "🤝",
                "tags": ["peer", "mentor", "support"]
            },
            {
                "id": "events",
                "title": "Community Events",
                "description": "Workshops, webinars, and mental health awareness events",
                "link": "/community/events",
                "category": "community",
                "icon": "📅",
                "tags": ["events", "workshops", "awareness"]
            }
        ]
    }
}

# Therapist sample data
THERAPISTS_DATA = [
    {
        "id": "1",
        "name": "Dr. Jane Smith",
        "parish": "Kingston",
        "specialty": ["Anxiety", "Depression", "Trauma"],
        "contact": "876-555-0123",
        "email": "jane.smith@therapyja.com"
    },
    {
        "id": "2",
        "name": "Michael Brown, MSc",
        "parish": "St. Andrew",
        "specialty": ["Relationship Issues", "Stress Management", "Career Counseling"],
        "contact": "876-555-0456",
        "email": "michael.brown@counselingja.org"
    },
    {
        "id": "3",
        "name": "Dr. Patricia Williams",
        "parish": "St. James",
        "specialty": ["Grief", "PTSD", "Addiction"],
        "contact": "876-555-0789",
        "email": "patricia.williams@mentalhealthja.com"
    },
    {
        "id": "4",
        "name": "Karen Thompson, PhD",
        "parish": "Clarendon",
        "specialty": ["Child Psychology", "Family Therapy", "ADHD"],
        "contact": "876-555-0345",
        "email": "karen.thompson@familytherapyja.com"
    }
]

@router.get("/resources/categories")
async def get_resource_categories():
    """Get all resource categories"""
    categories = []
    for key, data in RESOURCES_DATA.items():
        categories.append({
            "id": key,
            "name": data["title"],
            "description": data["description"],
            "count": len(data["resources"])
        })
    return {"categories": categories}

@router.get("/resources/{category}")
async def get_resources_by_category(category: str):
    """Get resources by category"""
    if category not in RESOURCES_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    
    data = RESOURCES_DATA[category]
    return {
        "category": category,
        "title": data["title"],
        "description": data["description"],
        "resources": data["resources"]
    }

@router.get("/resources")
async def get_all_resources():
    """Get all resources"""
    return RESOURCES_DATA

@router.get("/therapists")
async def get_therapists(
    parish: Optional[str] = Query(None, description="Filter by parish"),
    specialty: Optional[str] = Query(None, description="Filter by specialty")
):
    """Get therapists, optionally filtered"""
    therapists = THERAPISTS_DATA
    
    if parish:
        therapists = [t for t in therapists if t["parish"].lower() == parish.lower()]
    
    if specialty:
        therapists = [t for t in therapists if any(s.lower() == specialty.lower() for s in t["specialty"])]
    
    return {
        "therapists": therapists,
        "count": len(therapists),
        "filters": {"parish": parish, "specialty": specialty}
    }

@router.get("/therapists/parishes")
async def get_available_parishes():
    """Get list of parishes with available therapists"""
    parishes = list(set([t["parish"] for t in THERAPISTS_DATA]))
    return {"parishes": sorted(parishes)}

@router.get("/therapists/specialties")
async def get_available_specialties():
    """Get list of available specialties"""
    specialties = set()
    for t in THERAPISTS_DATA:
        specialties.update(t["specialty"])
    return {"specialties": sorted(specialties)}

@router.get("/resource/{resource_id}")
async def get_resource_details(resource_id: str):
    """Get details for a specific resource"""
    for category, data in RESOURCES_DATA.items():
        for resource in data["resources"]:
            if resource["id"] == resource_id:
                return resource
    raise HTTPException(status_code=404, detail="Resource not found")