from fastapi import APIRouter, Depends

from database import projects_collection, scans_collection
from utils.auth import get_current_user
from utils.serializers import stringify_id

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    projects = list(projects_collection.find({"user_id": user_id}).sort("updated_at", -1))
    scans = list(scans_collection.find({"user_id": user_id}).sort("created_at", -1))

    completed = sum(1 for project in projects if project.get("status") == "completed" or project.get("progress", 0) >= 100)
    health_scores = [project.get("health_score") for project in projects if project.get("health_score") is not None]
    avg_health = round(sum(health_scores) / len(health_scores)) if health_scores else 0
    avg_progress = (
        round(sum(project.get("progress", 0) for project in projects) / len(projects))
        if projects
        else 0
    )

    return {
        "stats": {
            "projects": len(projects),
            "completed": completed,
            "scans": len(scans),
            "health_score": avg_health,
            "progress": avg_progress,
        },
        "recent_projects": [stringify_id(item) for item in projects[:4]],
        "recent_scans": [stringify_id(item) for item in scans[:4]],
    }
