from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    db: str


class StatusCounts(BaseModel):
    new: int = 0
    acknowledged: int = 0
    resolved: int = 0
    dismissed: int = 0
