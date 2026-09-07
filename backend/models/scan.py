from pydantic import BaseModel, Field


class ScanFeedback(BaseModel):
    progress_percent: int = Field(ge=0, le=100)
    health_score: int = Field(ge=0, le=100)
    explanation: str
    mistake_analysis: str
    suggested_fix: str
    next_step: str
    motivational_message: str
