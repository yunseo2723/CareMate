# 00_fetch_from_mysql.py
import pymysql
import json
from pathlib import Path

from data.scripts.Roadname_mapper import RoadnameMapper

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output"
OUT.mkdir(parents=True, exist_ok=True)

OUT_FILE = OUT / "ltc_from_mysql.json"


def fetch_all_facilities():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="1234",
        database="caremate",
        port=3306,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    sql = "SELECT * FROM ltc_facility"

    with conn.cursor() as cur:
        cur.execute(sql)
        rows = cur.fetchall()

    conn.close()
    return rows



def convert_addresses(rows):
    """도로명코드 기반으로 주소 변환"""

    road = RoadnameMapper()
    converted = []

    for r in rows:
        road_code = r.get("road_addr")
        post = r.get("post_no")

        # 도로명 주소 매핑 (시도 + 시군구 + 도로명)
        road_addr = road.get_full_road_address(road_code)

        # 주소 결정
        final_addr = road_addr if road_addr else ""

        converted.append({
            "instCode": r.get("inst_code"),
            "kindCode": r.get("kind_code"),
            "name": r.get("name"),
            "postNo": post,
            "address": final_addr,
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
