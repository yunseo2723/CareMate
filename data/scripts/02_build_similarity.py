# 02_build_similarity.py (region weight version)
import numpy as np
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity
import json

ROOT = Path(__file__).resolve().parents[1]
VEC_FILE = ROOT / "output" / "facilities_vectors.npz"
META_FILE = ROOT / "output" / "facilities_meta.json"  # ⬅ 여기에 instCode → sido, sgg 저장
OUT_FILE = ROOT / "output" / "facilities_with_sim.json"


def load_meta():
    """instCode → {sido, sgg} 맵핑"""
    if META_FILE.exists():
        with open(META_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def region_weight(a, b):
    """행정구역 가중치 함수"""

    # 둘 다 메타정보가 없으면 가중치 없음
    if a is None or b is None:
        return 0.0

    # 시군구 동일 (가장 강함)
    if a.get("sgg") and a.get("sgg") == b.get("sgg"):
        return 0.15

    # 시도 동일
    if a.get("sido") and a.get("sido") == b.get("sido"):
        return 0.05

    return 0.0


def main():
    # 1) 벡터, 시설 메타 로드
    npz = np.load(VEC_FILE, allow_pickle=True)
    vectors = npz["vectors"].astype(np.float32)
    instCodes = npz["instCodes"].tolist()
    kindCodes = npz["kindCodes"].tolist()

    meta = load_meta()   # instCode → {sido, sgg}

    # 2) 코사인 유사도 계산
    sims = cosine_similarity(vectors)

    results = []

    for idx, inst in enumerate(instCodes):

        row = {
            "instCode": inst,
            "kindCode": str(kindCodes[idx]),
            "similar": []
        }

        # 자기 포함 정렬 목록
        sim_indices = sims[idx].argsort()[::-1]

        refined = []

        for j in sim_indices:
            if j == idx:
                continue

            base_score = float(sims[idx][j])

            # 행정구역 가중치 적용
            w = region_weight(meta.get(inst), meta.get(instCodes[j]))

            score = base_score + w

            refined.append({
                "instCode": instCodes[j],
                "score": round(score, 6)  # 반올림
            })

            if len(refined) == 20:  # 일단 20개만 계산해서 그 안에서 TOP 5 선택
                break

        # 최종 상위 5개만
        refined.sort(key=lambda x: x["score"], reverse=True)
        row["similar"] = refined[:5]

        results.append(row)

    # 저장
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("🔥 유사도 계산 + 지역 가중치 적용 완료:", OUT_FILE)


if __name__ == "__main__":
    main()
