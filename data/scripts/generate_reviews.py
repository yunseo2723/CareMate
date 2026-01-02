import random
import psycopg2
import os
from pathlib import Path
from dotenv import load_dotenv
from faker import Faker
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
fake = Faker("ko_KR")
load_dotenv(ENV_PATH)

REVIEW_COUNT = 700
USER_ID_RANGE = (1, 500)

# 실제 존재하는 inst_code / kind_code 몇 개만 먼저 쓰자
FACILITIES = [
    ("11111000006", "A03"),
    ("11111000056", "A03"),
    ("11111000060", "A03"),
    ("11111000068", "A03"),
    ("11111000076", "A03"),
    ("11111000078", "A03"),
    ("11111000087", "A03"),
    ("11111000088", "A04"),
    ("11111000135", "A03"),
    ("11114000030", "A03"),
]

TITLES = [
    "굉장히 만족합니다",
    "전체적으로 좋아요",
    "믿고 맡길 수 있어요",
    "시설이 깔끔해요",
    "다시 선택해도 여기",
]

CONTENTS = [
    "시설이 깨끗하고 직원분들이 친절합니다.",
    "어르신을 잘 돌봐주셔서 안심이 됩니다.",
    "프로그램이 다양하고 만족스러워요.",
    "전반적으로 안정적인 운영이 느껴집니다.",
    "다른 곳과 비교해도 괜찮은 선택이었습니다.",
    "상담부터 입소까지 과정이 편안했습니다.",
    "식사와 위생 관리가 잘 되어 있습니다.",
]

def random_datetime_within_months(months=3):
    now = datetime.now()
    past = now - timedelta(days=30 * months)
    return fake.date_time_between(start_date=past, end_date=now)

def main():
    conn = psycopg2.connect(
        host=os.getenv("PG_HOST"),
        port=os.getenv("PG_PORT"),
        dbname=os.getenv("PG_DB"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        sslmode="require"
    )
    cur = conn.cursor()

    rows = []

    for _ in range(REVIEW_COUNT):
        inst_code, kind_code = random.choice(FACILITIES)
        writer_id = random.randint(*USER_ID_RANGE)
        created_at = random_datetime_within_months()
        rating = random.choices([3, 4, 5], weights=[1, 3, 6])[0]

        rows.append((
            True,                      # allow_comment
            "REVIEW",                  # board_type
            random.choice(CONTENTS),   # content
            created_at,
            inst_code,
            kind_code,
            rating,
            random.choice(TITLES),     # title
            None,                      # updated_at
            0,                         # view_count
            writer_id,
        ))

    cur.executemany(
        """
        INSERT INTO facility_post (
            allow_comment,
            board_type,
            content,
            created_at,
            inst_code,
            kind_code,
            rating,
            title,
            updated_at,
            view_count,
            writer_id
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        rows
    )

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ 리뷰 {REVIEW_COUNT}개 생성 완료")

if __name__ == "__main__":
    main()
