import psycopg2
import bcrypt
import os
from pathlib import Path
from dotenv import load_dotenv
from faker import Faker

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
fake = Faker("ko_KR")
load_dotenv(ENV_PATH)

USER_COUNT = 500
DEFAULT_PASSWORD = "test1234!"

def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

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

    pw_hash = hash_pw(DEFAULT_PASSWORD)

    users = []
    for i in range(USER_COUNT):
        name = fake.name()
        nickname = name
        email = f"user{i+1:04d}@test.caremate"

        users.append((name, nickname, pw_hash, email))

    cur.executemany(
        """
        INSERT INTO users (name, nickname, password, username)
        VALUES (%s, %s, %s, %s)
        """,
        users
    )

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ 유저 {USER_COUNT}명 생성 완료")
    print(f"👉 공통 비밀번호: {DEFAULT_PASSWORD}")

if __name__ == "__main__":
    main()
