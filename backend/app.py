from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import CORS_ORIGINS, UPLOAD_DIR
from routes.analysis import router as analysis_router
from routes.auth import router as auth_router
from routes.dashboard import router as dashboard_router
from routes.patterns import router as patterns_router
from routes.projects import router as project_router
from routes.scans import router as scans_router

app = FastAPI(
    title="KnitLens AI API",
    description="AI-powered crochet progress tracker for the Alibaba Cloud AI Hackathon",
    version="1.0.0",
)

allow_all = "*" in CORS_ORIGINS or not CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else CORS_ORIGINS,
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(analysis_router)
app.include_router(scans_router)
app.include_router(patterns_router)
app.include_router(dashboard_router)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.get("/")
def home():
    return {"message": "KnitLens Backend Running", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
