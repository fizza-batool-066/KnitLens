from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    project_id: str | None = None
    detected_stitches: list = []
    mistakes: list = []
    confidence: float = 0
    ai_feedback: str = ""


class PatternRequest(BaseModel):
    description: str = Field(min_length=8, max_length=2000)
    difficulty: str = Field(default="Beginner", max_length=40)
