from collections import defaultdict
from .loader import (
    load_facility_features_latest,
    load_review_sentences_latest,
    load_facility_meta,
)
from .scorer import calc_facility_score
import pandas as pd

def recommend_top_facilities(limit: int = 10):

    feature_df = load_facility_features_latest()
    meta_df = load_facility_meta()
    sentence_df = load_review_sentences_latest()

    # 🔗 시설 메타 JOIN
    facility_df = feature_df.merge(
        meta_df,
        on=["inst_code", "kind_code"],
        how="left"
    )
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)        # 줄바꿈 방지
    pd.set_option('display.max_colwidth', None)
    print(facility_df.head(10))

    # 시설별 문장 묶기
    sentence_map = defaultdict(list)
    for _, r in sentence_df.iterrows():
        key = (r.inst_code, r.kind_code)
        sentence_map[key].append({
            "sentence": str(r.sentence),
            "score": 1.0   # 현재 문장 자체 점수 없으므로 기본값
        })

    results = []

    for _, f in facility_df.iterrows():
        key = (f.inst_code, f.kind_code)
        sentences = sentence_map.get(key, [])

        if len(sentences) < 3:
            continue

        score = calc_facility_score(
            avg_rating=f.avg_rating,
            review_count=f.review_cnt,
            sentence_count=len(sentences),
        )

        # 중복 제거 + 상위 문장
        seen = set()
        reasons = []

        # 점수 높은 순으로 정렬하려면 (score가 있으니)
        for item in sorted(sentences, key=lambda x: -x["score"]):
            sent = item["sentence"]
            sc = float(item["score"])

            if sent in seen:
                continue
            seen.add(sent)

            reasons.append({
                "sentence": sent,
                "score": sc
            })

            if len(reasons) == 3:
                break


        results.append({
            "instCode": str(f.inst_code),
            "kindCode": str(f.kind_code),
            "name": str(f['name']),
            "address": str(f.full_road_nm),
            "grade": f.grade,
            "avgRating": round(float(f.avg_rating), 2),
            "reviewCount": int(f.review_cnt),
            "score": round(float(score), 3),
            "reasons": reasons,
        })

    results.sort(key=lambda x: -x["score"])
    return results[:limit]
