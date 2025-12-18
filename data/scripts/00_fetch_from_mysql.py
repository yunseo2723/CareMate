# 00_fetch_from_mysql.py
from pathlib import Path
from dotenv import load_dotenv
import os
import psycopg2
import psycopg2.extras
import json

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
OUT = ROOT / "output"
OUT.mkdir(parents=True, exist_ok=True)

OUT_FILE = OUT / "ltc_from_postgres.json"

load_dotenv(ENV_PATH)

def fetch_all_facilities():
    conn = psycopg2.connect(
        host=os.getenv("PG_HOST"),
        port=os.getenv("PG_PORT"),
        dbname=os.getenv("PG_DB"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        sslmode="require"
    )

    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("SELECT * FROM ltc_facility")
        rows = cur.fetchall()

    conn.close()
    return rows



def convert_addresses(rows):
    """도로명코드 기반으로 주소 변환"""

    converted = []

    for r in rows:
        converted.append({
            "instCode": r.get("inst_code"),
            "kindCode": r.get("kind_code"),
            "name": r.get("name"),
            "postNo": r.get("post_no"),
            "fullRoadAddr": r.get("full_road_nm"),
            "phone": r.get("phone"),

            # 상세 정보
            "capacityTotal": r.get("capacity_total"),
            "residentMale": r.get("resident_male"),
            "residentFemale": r.get("resident_female"),
            "nurse": r.get("nurse"),
            "doctor": r.get("doctor"),
            "dentist": r.get("dentist"),
            "caregiver": r.get("caregiver"),
            "socialWorker": r.get("social_worker"),
            "nurseAide": r.get("nurse_aide"),
            "physicalTher": r.get("physical_ther"),
            "occupTher": r.get("occup_ther"),
            "nutritionist": r.get("nutritionist"),
            "cook": r.get("cook"),
            "manager": r.get("manager"),
            "assistant": r.get("assistant"),
            "etc": r.get("etc_per"),

            "singleRm": r.get("single_rm"),
            "doubleRm": r.get("double_rm"),
            "tripleRm": r.get("triple_rm"),
            "quadrupleRm": r.get("quadruple_rm"),
            "specialRm": r.get("special_rm"),

            "adlTraining": r.get("adl_training"),
            "programRoom": r.get("program_room"),
            "diningKitchen": r.get("dining_kitchen"),
            "toilet": r.get("toilet"),
            "bath": r.get("bath"),
            "laundry": r.get("laundry"),

            "homepage": r.get("homepage"),
            "transport": r.get("transport"),
            "parking": r.get("parking"),

            "programs": json.loads(r.get("programs_json") or "[]"),
            "contracts": json.loads(r.get("contracts_json") or "[]"),
        })

    return converted



if __name__ == "__main__":
    print("📌 DB load…")
    rows = fetch_all_facilities()
    print(f"Loaded {len(rows)} rows")

    print("📌 Converting road-code to address…")
    final_rows = convert_addresses(rows)

    print("📌 Save JSON…")
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(final_rows, f, ensure_ascii=False, indent=2)

    print("🎉 Done:", OUT_FILE)
