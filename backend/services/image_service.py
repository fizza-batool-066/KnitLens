from pathlib import Path

from fastapi import HTTPException, UploadFile

from utils.files import public_upload_url, save_upload


async def save_image(image: UploadFile) -> tuple[str, Path, str]:
    filename, path = await save_upload(image)
    return filename, path, public_upload_url(filename)
