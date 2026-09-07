from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException

from database import projects_collection, scans_collection
from models.project import ProgressUpdate, ProjectCreate, ProjectUpdate
from utils.auth import get_current_user
from utils.serializers import stringify_id

router = APIRouter(prefix="/projects", tags=["Projects"])


def parse_object_id(project_id: str) -> ObjectId:
    try:
        return ObjectId(project_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid project id")


def get_owned_project(project_id: str, user_id: str):
    project = projects_collection.find_one(
        {"_id": parse_object_id(project_id), "user_id": user_id}
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/create")
def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    new_project = {
        "user_id": current_user["id"],
        "title": project.title.strip(),
        "project_type": project.project_type.strip(),
        "difficulty": project.difficulty.strip(),
        "yarn_color": project.yarn_color.strip(),
        "hook_size": project.hook_size.strip(),
        "pattern_description": project.pattern_description.strip(),
        "notes": project.notes.strip(),
        "generate_ai_pattern": project.generate_ai_pattern,
        "progress": 0,
        "health_score": 100,
        "status": "In Progress",
        "created_at": now,
        "updated_at": now,
    }
    result = projects_collection.insert_one(new_project)
    saved = projects_collection.find_one({"_id": result.inserted_id})
    return {
        "message": "Project created",
        "project_id": str(result.inserted_id),
        "project": stringify_id(saved),
    }


@router.get("/")
def get_projects(current_user: dict = Depends(get_current_user)):
    projects = [
        stringify_id(project)
        for project in projects_collection.find({"user_id": current_user["id"]}).sort(
            "updated_at", -1
        )
    ]
    return projects


@router.get("/{project_id}")
def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    return stringify_id(get_owned_project(project_id, current_user["id"]))


@router.put("/{project_id}")
def update_project(
    project_id: str,
    payload: ProjectUpdate,
    current_user: dict = Depends(get_current_user),
):
    get_owned_project(project_id, current_user["id"])
    updates = {key: value for key, value in payload.model_dump().items() if value is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No changes provided")
    updates["updated_at"] = datetime.now(timezone.utc)
    projects_collection.update_one(
        {"_id": parse_object_id(project_id), "user_id": current_user["id"]},
        {"$set": updates},
    )
    saved = projects_collection.find_one({"_id": parse_object_id(project_id)})
    return stringify_id(saved)


@router.put("/{project_id}/progress")
def update_progress(
    project_id: str,
    data: ProgressUpdate,
    current_user: dict = Depends(get_current_user),
):
    get_owned_project(project_id, current_user["id"])
    projects_collection.update_one(
        {"_id": parse_object_id(project_id), "user_id": current_user["id"]},
        {
            "$set": {
                "progress": data.progress,
                "updated_at": datetime.now(timezone.utc),
                "status": "completed" if data.progress >= 100 else "active",
            }
        },
    )
    return {"message": "Progress updated"}


@router.delete("/{project_id}")
def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    result = projects_collection.delete_one(
        {"_id": parse_object_id(project_id), "user_id": current_user["id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    scans_collection.delete_many({"project_id": project_id, "user_id": current_user["id"]})
    return {"message": "Project deleted"}
