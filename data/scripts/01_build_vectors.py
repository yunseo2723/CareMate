import json
from pathlib import Path
from collections import Counter
import math

ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "input" / "facilities.json"
OUT_PATH = ROOT / "output" / "facility_vectors.jsonl"   # jsonl = 줄마다 1개

# 벡터에 꼭 넣을 필드
NUMERIC_FIELDS = [
    "capacityTotal",
    "residentMale",
    "residentFemale",
    "nurse",
    "doctor",
    "caregiver",
    "socialWorker",
    "nurseAide",
    "physicalTher",
    "occupTher",
    "nutritionist",
    "cook",
    "manager",
    "assistant",
    "etcPer",
    "single",
    "doubleRm",
    "triple",
    "quadruple",
    "special",
    "adlTraining",
    "programRoom",
    "diningKitchen",
    "toilet",
    "bath",
    "laundry",
]

def load_facilities():
    with INPUT_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def extract_program_tokens(fac):
    # programs: [{pgmNm: "...", ...}]
    toks = []
    for p in fac.get("programs", []):
        name = (p.get("pgmNm") or "").strip()
        if not name:
            continue
        # 아주 단순 토큰화
        name = name.replace(",", " ").replace("  ", " ")
        toks.extend(name.split())
    return toks

def main():
    facilities = load_facilities()
    print(f"[INFO] loaded {len(facilities)} facilities")

    # 프로그램 이름을 전체 시설에서 모아서 많이 나오는 것만 쓰자
    prog_counter = Counter()
    for fac in facilities:
        prog_counter.update(extract_program_tokens(fac))
    # 너무 많은 토큰은 버리고, 상위 50개만
    top_prog_tokens = [w for w, _ in prog_counter.most_common(50)]
    print(f"[INFO] top program tokens: {top_prog_tokens[:10]} ...")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("w", encoding="utf-8") as out:
        for fac in facilities:
            inst = fac.get("instCode")
            kind = fac.get("kindCode")

            # 1) 숫자 특징
            feats = {}
            for f in NUMERIC_FIELDS:
                val = fac.get(f)
                if val is None:
                    val = 0
                # 살짝만 스케일 조정
                if isinstance(val, str) and val.isdigit():
                    val = int(val)
                if isinstance(val, (int, float)) and val > 1000:
                    val = math.log1p(val)
                feats[f] = val

            # 2) 범주 특징 (kindCode one-hot)
            kind_onehot = {}
            if kind:
                kind_onehot[f"kind_{kind}"] = 1
            feats.update(kind_onehot)

            # 3) 프로그램 토큰 특징 (간단한 binary)
            fac_tokens = set(extract_program_tokens(fac))
            for tok in top_prog_tokens:
                key = f"prog_{tok}"
                feats[key] = 1 if tok in fac_tokens else 0

            # 4) 지역 토큰 (address에서 시/도만)
            addr = (fac.get("address") or "").strip()
            if "서울" in addr:
                feats["loc_seoul"] = 1
            elif "경기" in addr:
                feats["loc_gg"] = 1
            elif "부산" in addr:
                feats["loc_busan"] = 1

            # 최종 레코드
            rec = {
                "instCode": inst,
                "kindCode": kind,
                "features": feats,
            }
            out.write(json.dumps(rec, ensure_ascii=False) + "\n")

    print(f"[DONE] vectors written to {OUT_PATH}")

if __name__ == "__main__":
    main()
