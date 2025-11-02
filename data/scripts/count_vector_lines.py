# data/scripts/count_vector_lines.py
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "output" / "facility_vectors.jsonl"
cnt = 0
with path.open("r", encoding="utf-8") as f:
    for _ in f:
        cnt += 1
print("lines =", cnt)
