from pydantic import BaseModel
from typing import List, Optional


class Reason(BaseModel):
    sentence: str
    score: float


class RecommendFacility(BaseModel):
    instCode: str
    kindCode: str
    name: str
    address: Optional[str]
    grade: Optional[str]
    avgRating: float
    reviewCount: int
    score: float
    reasons: List[Reason]


class RecommendResponse(BaseModel):
    results: List[RecommendFacility]
