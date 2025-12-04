import pandas as pd
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "raw"
OUT_DIR = ROOT / "output"
OUT_DIR.mkdir(parents=True, exist_ok=True)

TXT_PATH = RAW_DIR / "개선_도로명코드_전체분.txt"

class RoadnameMapper:
    def __init__(self, txt_file=TXT_PATH):
        # 컬럼명 직접 지정
        cols = [
            "road_code", "road_name", "unused1",
            "unused2",
            "sido", "unused3",
            "sigungu", "unused4",
            "unused5", "unused6",
            "unused7",
            "unused8", "unused9",
            "unused10", "unused11", "unused12", "unused13"
        ]

        df = pd.read_csv(
            txt_file,
            sep="|",
            header=None,
            names=cols,
            dtype=str,
            encoding="cp949"
        )

        # 쓰지 않는 컬럼 제거
        df = df[[
            "road_code", "road_name", "sido", "sigungu"
        ]]

        # 도로명코드 기준으로 여러 row 존재 → 본번/부번 조합 검색 위해 그대로 둠
        self.df = df

        # 도로명코드만으로 기본 도로명 찾기
        self.road_name_map = df.groupby("road_code")["road_name"].first().to_dict()

    def get_basic_roadname(self, road_code: str):
        """도로명코드 기반 도로명만 반환"""
        return self.road_name_map.get(road_code, "")

    def get_full_road_address(self, road_code: str):
        """도로명코드 + 본번/부번 → 전체 주소 구성"""
        if pd.isna(road_code) or road_code is None:
            return ""

        df = self.df[self.df["road_code"] == road_code]

        if df.empty:
            return ""

        # 시도/구/도로명
        row = df.iloc[0]
        sido = row["sido"]
        sigungu = row["sigungu"]
        roadname = row["road_name"]

        return f"{sido} {sigungu} {roadname}".strip()


if __name__ == "__main__":
    rm = RoadnameMapper()

    # 테스트
    print(rm.get_basic_roadname("111102005001"))   # 세종대로

    print(
        rm.get_full_road_address(
            "111102005001"
        )
    )
