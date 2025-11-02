import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAC_PATH = ROOT / "input" / "facilities.json"          # 원본 22,000개
SIM_PATH = ROOT / "output" / "facility_sim_top10.json" # 2단계 결과
OUT_PATH = ROOT / "output" / "facilities_with_sim.json"

def main():
    with FAC_PATH.open("r", encoding="utf-8") as f:
        facilities = json.load(f)

    with SIM_PATH.open("r", encoding="utf-8") as f:
        sim = json.load(f)

    # instCode -> facility 로 바꾸기
    fac_map = {f["instCode"]: f for f in facilities}

    merged = []
    for inst, fac in fac_map.items():
        item = fac.copy()
        item["similar"] = sim.get(inst, [])
        merged.append(item)

    with OUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print(f"[DONE] merged saved to {OUT_PATH} (rows={len(merged)})")

if __name__ == "__main__":
    main()
