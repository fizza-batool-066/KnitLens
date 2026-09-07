import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from config import UPLOAD_DIR

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_UPLOAD_BYTES = 12 * 1024 * 1024


def unique_filename(original_name: str | None) -> str:
    suffix = Path(original_name or "upload.jpg").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        suffix = ".jpg"
    return f"{uuid.uuid4().hex}{suffix}"


async def save_upload(image: UploadFile) -> tuple[str, Path]:
    if not image or not image.filename:
        raise HTTPException(status_code=400, detail="Please upload a crochet image")

    suffix = Path(image.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image type. Use JPG, PNG, WEBP, or BMP.",
        )

    content = await image.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="Image must be 12MB or smaller")

    filename = unique_filename(image.filename)
    path = UPLOAD_DIR / filename
    path.write_bytes(content)
    return filename, path


def public_upload_url(filename: str) -> str:
    return f"/uploads/{filename}"
