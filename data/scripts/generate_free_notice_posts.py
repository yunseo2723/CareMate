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

USER_ID_RANGE = (1, 500)

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

FREE_PER_FACILITY = 30
NOTICE_PER_FACILITY = 30

FREE_TITLES = [
    "이용 관련 문의드립니다",
    "입소 절차가 궁금합니다",
    "이용 후기 공유합니다",
    "프로그램은 어떤 게 있나요?",
    "비용 관련 질문 있어요",
]

FREE_CONTENTS = [
    "입소 상담은 어떻게 진행되나요?",
    "실제 이용하신 분들 후기 궁금합니다.",
    "어르신 케어는 어떤 방식인가요?",
    "프로그램 참여는 자유로운가요?",
    "가족 면회는 자주 가능한가요?",
    "야간 간호 인력도 상주하나요?",
]

NOTICE_TITLES = [
    "공지사항 안내",
    "운영 관련 공지",
    "프로그램 일정 안내",
    "시설 이용 안내",
    "면회 관련 공지",
]

NOTICE_CONTENTS = [
    "시설 운영 관련 공지사항을 안내드립니다.",
    "이번 달 프로그램 일정이 업데이트되었습니다.",
    "면회 시간 변경 안내드립니다.",
    "시설 방역 일정 안내드립니다.",
    "휴무일 관련 공지사항입니다.",
]

def random_datetime_within_months(months=6):
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

    for inst_code, kind_code in FACILITIES:
        # FREE 게시글
        for _ in range(FREE_PER_FACILITY):
            rows.append((
                True,                        # allow_comment
                "FREE",                      # board_type
                random.choice(FREE_CONTENTS),
                random_datetime_within_months(),
                inst_code,
                kind_code,
                None,                        # rating
                random.choice(FREE_TITLES),
                None,                        # updated_at
                0,                           # view_count
                random.randint(*USER_ID_RANGE),
            ))

        # NOTICE 게시글
        for _ in range(NOTICE_PER_FACILITY):
            rows.append((
                False,                       # allow_comment
                "NOTICE",                    # board_type
                random.choice(NOTICE_CONTENTS),
                random_datetime_within_months(),
                inst_code,
                kind_code,
                None,                        # rating
                random.choice(NOTICE_TITLES),
                None,                        # updated_at
                0,                           # view_count
                random.randint(*USER_ID_RANGE),
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

    print(f"✅ FREE {FREE_PER_FACILITY * 10} + NOTICE {NOTICE_PER_FACILITY * 10} 게시글 생성 완료")

if __name__ == "__main__":
    main()
