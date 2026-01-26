from fastapi import APIRouter
from api.services.facilities import get_facilities_by_parish

router = APIRouter()

@router.get("/{parish}")
async def health_info(parish: str):
    # Normalize input
    parish_clean = parish.strip().title()

    facilities = get_facilities_by_parish(parish_clean)

    # If nothing returned OR an error structure is returned
    if not facilities or "error" in facilities:
        return {
            "parish": parish_clean,
            "message": f"No facilities found for parish: {parish_clean}.",
            "facilities": []
        }

    # Normal successful response
    return {
        "parish": parish_clean,
        "count": len(facilities.get("facilities", [])),
        "facilities": facilities
    }
