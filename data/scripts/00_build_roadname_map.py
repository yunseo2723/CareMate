import pandas as pd
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]  # data/scripts/ → data/
RAW_DIR = ROOT / "raw"
OUT_DIR = ROOT / "output"
OUT_DIR.mkdir(parents=True, exist_ok=True)

TXT_PATH = RAW_DIR / "개선_도로명코드_전체분.txt"
OUT_PATH = OUT_DIR / "roadname_map.json"


def build_roadname_map():
    # 실제 파일 구조에 맞춘 컬럼명
    cols = [
        "road_code", "road_name", "unused1",
        "seq",
        "sido", "unused3",
        "sigungu", "unused4",
        "unused5", "unused6",
        "unused7",  # 1 본번 / 2 부번
        "unused8", "unused9",
        "unused10", "unused11", "unused12", "unused13"
    ]

    print("📂 CSV 로딩중...")
    df = pd.read_csv(
        TXT_PATH,
        sep="|",
        header=None,
        names=cols,
        dtype=str,
        encoding="cp949"
    )

    df = df[[
        "road_code", "road_name", "sido", "sigungu", "seq"
    ]]

    # 문자열 스페이스 제거
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    print(f"총 {len(df):,} 행 로드됨")

    # road_code 기준 그룹핑 → 첫 row = 기본 도로명
    road_map = {}

    for code, group in df.groupby("road_code"):
        # 대표 row (seq == "00" 이면 우선)
        base_row = group[group["seq"] == "00"]
        if not base_row.empty:
            row = base_row.iloc[0]
        else:
            row = group.iloc[0]

        sido = row["sido"] or ""
        sigungu = row["sigungu"] or ""
        roadname = row["road_name"] or ""

        # 공백 제거 & 조립
        full_addr = f"{sido} {sigungu} {roadname}".strip()

        road_map[code] = full_addr

    print(f"✔ 변환 완료 — 총 {len(road_map):,}개 주소 매핑 생성됨")

    # JSON 저장
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(road_map, f, ensure_ascii=False, indent=2)

    print(f"📁 저장 완료 → {OUT_PATH}")


if __name__ == "__main__":
    build_roadname_map()
