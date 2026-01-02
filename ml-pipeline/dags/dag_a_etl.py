# airflow/dags/dag_a_etl.py
from airflow import DAG
from airflow.providers.standard.operators.python import PythonOperator
from datetime import datetime
import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

# ===============================
# 1. 환경 설정
# ===============================

POSTGRES_URL = os.getenv("CARE_MATE_DB_URL")

BASE_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "raw"
)
BASE_PATH = os.path.abspath(BASE_PATH)

TABLES = {
    "reviews": """
               SELECT *
               FROM facility_post
               WHERE board_type = 'REVIEW'
               """,
    "posts_free": """
                  SELECT *
                  FROM facility_post
                  WHERE board_type = 'FREE'
                  """,
    "posts_notice": """
                    SELECT *
                    FROM facility_post
                    WHERE board_type = 'NOTICE'
                    """,
    "comments": """
                SELECT *
                FROM facility_comment
                """,
    "facilities": """
                  SELECT *
                  FROM ltc_facility
                  """
}

# ===============================
# 2. ETL 함수
# ===============================

def extract_table(table_name: str, query: str, ds: str, **context):
    engine = create_engine(POSTGRES_URL)

    date_str = ds.replace("-", "")
    out_dir = os.path.join(BASE_PATH, table_name)
    os.makedirs(out_dir, exist_ok=True)

    dated_path = os.path.join(
        out_dir,
        f"{table_name}_{date_str}.parquet"
    )

    latest_path = os.path.join(
        out_dir,
        f"{table_name}_latest.parquet"
    )

    print(f"[ETL] Extracting {table_name}")
    df = pd.read_sql(query, engine)

    print(f"[ETL] rows={len(df)} → {dated_path}")
    df.to_parquet(dated_path, engine="pyarrow", index=False)

    # ✅ latest 갱신 (덮어쓰기)
    df.to_parquet(latest_path, engine="pyarrow", index=False)
    print(f"[ETL] updated latest → {latest_path}")



# ===============================
# 3. DAG 정의
# ===============================

default_args = {
    "owner": "caremate",
    "depends_on_past": False,
    "retries": 1,
}

with DAG(
        dag_id="dag_a_etl_snapshot",
        description="Postgres → Parquet raw snapshot",
        default_args=default_args,
        start_date=datetime(2026, 1, 1),
        schedule="0 * * * *",  # 매시간
        catchup=False,
        tags=["etl", "raw", "snapshot"],
) as dag:

    tasks = []

    for table_name, query in TABLES.items():
        task = PythonOperator(
            task_id=f"extract_{table_name}",
            python_callable=extract_table,
            op_kwargs={
                "table_name": table_name,
                "query": query,
            },
        )
        tasks.append(task)

    # 병렬 실행 (순서 의존 없음)
    for t in tasks:
        t
