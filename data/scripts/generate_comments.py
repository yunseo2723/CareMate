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

COMMENT_COUNT = 1000
USER_ID_RANGE = (1, 500)

COMMENT_TEXTS = [
    "공감합니다.",
    "좋은 정보 감사합니다.",
    "저도 같은 경험이 있어요.",
    "확인해봐야겠네요.",
    "도움이 많이 됐습니다.",
    "궁금했던 내용이에요.",
    "관리 잘 되는 것 같네요.",
    "설명 감사합니다.",
    "이용해보고 싶어졌어요.",
    "부모님 모시기 좋아 보이네요.",
]

def random_datetime():
    now = datetime.now()
    past = now - timedelta(days=180)
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

    # 🔹 게시글 ID 전부 가져오기
    cur.execute("SELECT id FROM facility_post")
    post_ids = [row[0] for row in cur.fetchall()]

    if not post_ids:
        raise Exception("❌ board 테이블에 게시글이 없습니다.")

    comments = []
    created_comment_ids = []

    for i in range(COMMENT_COUNT):
        post_id = random.choice(post_ids)
        writer_id = random.randint(*USER_ID_RANGE)

        # 20% 확률로 대댓글
        parent_id = None
        if created_comment_ids and random.random() < 0.2:
            parent_id = random.choice(created_comment_ids)

        cur.execute(
            """
            INSERT INTO facility_comment (
                content,
                created_at,
                is_deleted,
                parent_id,
                post_id,
                writer_id
            )
            VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """,
            (
                random.choice(COMMENT_TEXTS),
                random_datetime(),
                False,
                parent_id,
                post_id,
                writer_id,
            )
        )

        new_id = cur.fetchone()[0]
        created_comment_ids.append(new_id)

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ 댓글 {COMMENT_COUNT}개 생성 완료")

if __name__ == "__main__":
    main()
