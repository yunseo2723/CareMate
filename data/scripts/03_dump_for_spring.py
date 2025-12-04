# 03_dump_for_spring.py
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "output" / "ltc_from_mysql.json"
SIM = ROOT / "output" / "facilities_with_sim.json"
OUT = ROOT / "output" / "facilities_final.json"


def main():
    with open(SRC, "r", encoding="utf-8") as f:
        base = {x["instCode"]: x for x in json.load(f)}

    with open(SIM, "r", encoding="utf-8") as f:
        sim = json.load(f)

    for s in sim:
        inst = s["instCode"]
        if inst in base:
            base[inst]["similar"] = s["similar"]

    final = list(base.values())

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)

    print("🔥 Spring 제공용 JSON 생성 완료:", OUT)


if __name__ == "__main__":
    main()
