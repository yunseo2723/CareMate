import json
from pathlib import Path
import math

ROOT = Path(__file__).resolve().parents[1]
VEC_PATH = ROOT / "output" / "facility_vectors.jsonl"
OUT_PATH = ROOT / "output" / "facility_sim_top10.json"

TOPK = 10

def cosine(a, b):
    num = 0.0
    da = 0.0
    db = 0.0
    for k, va in a.items():
        vb = b.get(k, 0.0)
        num += va * vb
        da += va * va
    for vb in b.values():
        db += vb * vb
    if da == 0 or db == 0:
        return 0.0
    return num / (math.sqrt(da) * math.sqrt(db))

def load_vectors():
    vecs = []
    with VEC_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)
            vecs.append(obj)
    return vecs

def main():
    vecs = load_vectors()
    print(f"[INFO] loaded vectors: {len(vecs)}")

    # 단순 O(n^2)은 22k면 살짝 무거울 수 있어서
    # 여기선 "앞쪽 n만 비교" 하는 식으로 적당히 타협.
    # 진짜로 full 비교하고 싶으면 이중 for 다 돌리면 됨.
    sims = {}  # instCode -> [ {instCode, score}, ... ]
    for i, v in enumerate(vecs):
        base_id = v["instCode"]
        base_feat = v["features"]

        # 여기에 후보를 다 넣을 건데
        scores = []
        for j, w in enumerate(vecs):
            if i == j:
                continue
            other_id = w["instCode"]
            sc = cosine(base_feat, w["features"])
            if sc <= 0:
                continue
            scores.append((other_id, sc))

        # 점수 높은 순으로 10개만
        scores.sort(key=lambda x: x[1], reverse=True)
        top = scores[:TOPK]
        sims[base_id] = [
            {"instCode": oid, "score": float(sc)} for oid, sc in top
        ]

        if (i + 1) % 500 == 0:
            print(f"[PROGRESS] {i+1}/{len(vecs)}")

    with OUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(sims, f, ensure_ascii=False, indent=2)

    print(f"[DONE] similarity saved to {OUT_PATH}")

if __name__ == "__main__":
    main()
