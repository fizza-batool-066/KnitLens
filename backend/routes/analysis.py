from fastapi import APIRouter, Depends, File, UploadFile

from routes.scans import run_scan
from utils.auth import get_current_user

router = APIRouter(prefix="/analysis", tags=["AI Scanner"])


@router.post("/scan")
async def scan_image(
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    scan = await run_scan(image, None, current_user)
    feedback = scan.get("feedback") or {}
    return {
        "message": "AI Analysis Completed",
        "result": {
            "detected_stitches": scan.get("detected_classes", []),
            "mistakes": [feedback.get("mistake_analysis", "")],
            "confidence": scan.get("confidence", 0),
            "feedback": feedback.get("explanation", ""),
        },
        "scan": scan,
    }
