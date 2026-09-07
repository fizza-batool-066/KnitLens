from fastapi import APIRouter, Depends, HTTPException

from models.analysis import PatternRequest
from services.qwen_service import generate_pattern
from utils.auth import get_current_user

router = APIRouter(prefix="/patterns", tags=["Patterns"])


@router.post("/generate")
def create_pattern(
    payload: PatternRequest,
    current_user: dict = Depends(get_current_user),
):
    try:
        pattern = generate_pattern(payload.description, payload.difficulty)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Qwen could not generate a pattern: {error}",
        ) from error
    return {"pattern": pattern, "requested_by": current_user["name"]}
