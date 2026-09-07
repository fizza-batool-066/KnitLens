from pathlib import Path
import os

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=False)


def get_env(key: str, default: str = "") -> str:
    value = os.getenv(key, default)
    return value.strip() if isinstance(value, str) else default


MONGO_URI = get_env("MONGO_URI")
DATABASE_NAME = get_env("DATABASE_NAME", "knitlens")

SECRET_KEY = get_env("SECRET_KEY", "knitlens-dev-secret-change-me")
ALGORITHM = get_env("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(get_env("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

QWEN_API_KEY = get_env("QWEN_API_KEY")
QWEN_BASE_URL = get_env("QWEN_BASE_URL")
QWEN_MODEL = get_env("QWEN_MODEL", "qwen-plus")

YOLO_MODEL_PATH = get_env("YOLO_MODEL_PATH", "models/best.pt")

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

CORS_ORIGINS = [
    origin.strip()
    for origin in get_env(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
