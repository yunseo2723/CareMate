# airflow/dags/dag_b_features.py
import os
from datetime import datetime, timedelta
import pandas as pd
import re

# ===============================
# 1. 경로 설정
# ===============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_BASE = os.path.join(BASE_DIR, "data", "raw")
FEATURE_BASE = os.path.join(BASE_DIR, "data", "features")

REVIEW_PATH = os.path.join(RAW_BASE, "reviews")
POST_PATH = os.path.join(RAW_BASE, "posts_free")
NOTICE_PATH = os.path.join(RAW_BASE, "posts_notice")
COMMENT_PATH = os.path.join(RAW_BASE, "comments")

OUT_FACILITY = os.path.join(FEATURE_BASE, "facility_features")
OUT_SENTENCE = os.path.join(FEATURE_BASE, "review_sentences")

os.makedirs(OUT_FACILITY, exist_ok=True)
os.makedirs(OUT_SENTENCE, exist_ok=True)

# ===============================
# 2. 유틸: 문장 분리
# ===============================

def split_sentences(text: str):
    if not isinstance(text, str):
        return []
    sentences = re.split(r"[.!?]\s*", text.strip())
    return [s.strip() for s in sentences if len(s.strip()) >= 5]

# ===============================
# 3. 메인 로직
# ===============================

def run_feature_job(target_date: str):
    print(f"[DAG-B] Processing date = {target_date}")

    # ---------- 리뷰 ----------
    reviews = pd.read_parquet(
        os.path.join(REVIEW_PATH, f"reviews_{target_date}.parquet")
    )
    reviews["created_at"] = pd.to_datetime(reviews["created_at"])

    # ---------- 게시글 (댓글 매핑용) ----------
    post_frames = []
    for path in [REVIEW_PATH, POST_PATH, NOTICE_PATH]:
        for f in os.listdir(path):
            if f.endswith(".parquet"):
                post_frames.append(pd.read_parquet(os.path.join(path, f)))

    posts = pd.concat(post_frames, ignore_index=True)[
        ["id", "inst_code", "kind_code"]
    ].rename(columns={"id": "post_id"})

    # ---------- 댓글 ----------
    comment_frames = [
        pd.read_parquet(os.path.join(COMMENT_PATH, f))
        for f in os.listdir(COMMENT_PATH)
        if f.endswith(".parquet")
    ]
    comments = pd.concat(comment_frames, ignore_index=True)

    # 댓글 + 게시글 JOIN → 시설 정보 확보
    comments = comments.merge(posts, on="post_id", how="left")

    # ===============================
    # 4. 시설 집계 피처
    # ===============================

    now = datetime.strptime(target_date, "%Y%m%d")
    recent_30d = now - timedelta(days=30)

    facility_features = (
        reviews
        .groupby(["inst_code", "kind_code"])
        .agg(
            avg_rating=("rating", "mean"),
            review_cnt=("id", "count"),
            recent_30d_cnt=(
                "created_at",
                lambda x: (x >= recent_30d).sum()
            ),
        )
        .reset_index()
    )

    comment_counts = (
        comments
        .dropna(subset=["inst_code", "kind_code"])
        .groupby(["inst_code", "kind_code"])
        .size()
        .reset_index(name="comment_count")
    )

    facility_features = facility_features.merge(
        comment_counts,
        on=["inst_code", "kind_code"],
        how="left"
    ).fillna({"comment_count": 0})

    out_facility_path = os.path.join(
        OUT_FACILITY,
        f"facility_features_{target_date}.parquet"
    )
    facility_features.to_parquet(out_facility_path, index=False)

    latest_facility_path = os.path.join(
        OUT_FACILITY,
        "facility_features_latest.parquet"
    )
    facility_features.to_parquet(latest_facility_path, index=False)

    print(f"[DAG-B] saved {out_facility_path}")
    print(f"[DAG-B] updated latest → {latest_facility_path}")

    # ===============================
    # 5. 리뷰 문장 단위
    # ===============================

    rows = []
    for _, r in reviews.iterrows():
        for s in split_sentences(r["content"]):
            rows.append({
                "inst_code": r["inst_code"],
                "kind_code": r["kind_code"],
                "review_id": r["id"],
                "sentence": s,
                "rating": r["rating"],
                "created_at": r["created_at"]
            })

    sentence_df = pd.DataFrame(rows)

    out_sentence_path = os.path.join(
        OUT_SENTENCE,
        f"review_sentences_{target_date}.parquet"
    )
    sentence_df.to_parquet(out_sentence_path, index=False)

    latest_sentence_path = os.path.join(
        OUT_SENTENCE,
        "review_sentences_latest.parquet"
    )
    sentence_df.to_parquet(latest_sentence_path, index=False)

    print(f"[DAG-B] saved {out_sentence_path}")
    print(f"[DAG-B] updated latest → {latest_sentence_path}")
    print(f"[DAG-B] review_sentences rows={len(sentence_df)}")

# ===============================
# 6. 로컬 실행
# ===============================

if __name__ == "__main__":
    run_feature_job("20260102")
