from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    project_type: str = Field(default="General", max_length=80)
    difficulty: str = Field(default="Beginner", max_length=40)
    yarn_color: str = Field(default="", max_length=50)
    hook_size: str = Field(default="", max_length=20)
    pattern_description: str = Field(default="", max_length=2000)
    notes: str = Field(default="", max_length=2000)
    generate_ai_pattern: bool = False


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=120)
    category: str | None = None
    difficulty: str | None = None
    description: str | None = None
    status: str | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    health_score: int | None = Field(default=None, ge=0, le=100)


class ProgressUpdate(BaseModel):
    progress: int = Field(ge=0, le=100)
