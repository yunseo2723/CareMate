from fastapi import FastAPI
from .schemas import RecommendResponse
from .recommend.service import recommend_top_facilities

app = FastAPI()


@app.get("/recommend/top", response_model=RecommendResponse)
def recommend_top(limit: int = 10):
    return {
        "results": recommend_top_facilities(limit)
    }
