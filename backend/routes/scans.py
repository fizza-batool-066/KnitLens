from datetime import datetime, timezone
from math import ceil

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from database import projects_collection, scans_collection
from services.image_service import save_image
from services.qwen_service import generate_crochet_feedback
from services.yolo_service import detect_crochet
from utils.auth import get_current_user
from utils.files import public_upload_url
from utils.serializers import stringify_id

router = APIRouter(prefix="/scans", tags=["AI Scanner"])


def parse_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")


async def run_scan(image: UploadFile, project_id: str | None, current_user: dict):
    project_name = "Untitled crochet project"
    if project_id:
        project = projects_collection.find_one(
            {"_id": parse_object_id(project_id), "user_id": current_user["id"]}
        )
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        project_name = project.get("title", project_name)

    original_filename, original_path, original_url = await save_image(image)

    try:
        yolo_result = detect_crochet(original_path)
    except Exception as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    try:
        feedback = generate_crochet_feedback(project_name, yolo_result)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Qwen could not generate guidance: {error}",
        ) from error

    now = datetime.now(timezone.utc)
    scan_document = {
        "user_id": current_user["id"],
        "project_id": project_id,
        "project_name": project_name,
        "original_image": original_filename,
        "annotated_image": yolo_result["annotated_filename"],
        "original_url": original_url,
        "annotated_url": public_upload_url(yolo_result["annotated_filename"]),
        "detected_classes": yolo_result["classes"],
        "all_classes": yolo_result["all_classes"],
        "detections": yolo_result["detections"],
        "boxes": yolo_result["boxes"],
        "confidence": yolo_result["confidence"],
        "feedback": feedback,
        "created_at": now,
    }
    result = scans_collection.insert_one(scan_document)

    if project_id:
        projects_collection.update_one(
            {"_id": parse_object_id(project_id), "user_id": current_user["id"]},
            {
                "$set": {
                    "progress": feedback["progress_percent"],
                    "health_score": feedback["health_score"],
                    "updated_at": now,
                    "status": "completed" if feedback["progress_percent"] >= 100 else "active",
                    "last_scan_id": str(result.inserted_id),
                }
            },
        )

    saved = scans_collection.find_one({"_id": result.inserted_id})
    return stringify_id(saved)


@router.post("/analyze")
async def analyze_scan(
    image: UploadFile = File(...),
    project_id: str | None = Form(default=None),
    current_user: dict = Depends(get_current_user),
):
    scan = await run_scan(image, project_id or None, current_user)
    return {"message": "AI analysis completed", "scan": scan}


@router.get("/")
def list_scans(
    q: str = Query(default=""),
    project_id: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=8, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
):
    query: dict = {"user_id": current_user["id"]}
    if project_id:
        query["project_id"] = project_id
    if q.strip():
        query["$or"] = [
            {"project_name": {"$regex": q.strip(), "$options": "i"}},
            {"detected_classes": {"$regex": q.strip(), "$options": "i"}},
        ]

    total = scans_collection.count_documents(query)
    cursor = (
        scans_collection.find(query)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = [stringify_id(item) for item in cursor]
    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": ceil(total / limit) if total else 1,
    }


@router.get("/{scan_id}")
def get_scan(scan_id: str, current_user: dict = Depends(get_current_user)):
    scan = scans_collection.find_one(
        {"_id": parse_object_id(scan_id), "user_id": current_user["id"]}
    )
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return stringify_id(scan)


@router.delete("/{scan_id}")
def delete_scan(scan_id: str, current_user: dict = Depends(get_current_user)):
    result = scans_collection.delete_one(
        {"_id": parse_object_id(scan_id), "user_id": current_user["id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"message": "Scan deleted"}
