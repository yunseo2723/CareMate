from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import RecommendResponse
from .recommend.service import recommend_top_facilities

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://caremate.kro.kr",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/recommend/top", response_model=RecommendResponse)
def recommend_top(limit: int = 10):
    return {
        "results": recommend_top_facilities(limit)
    }
