import pandas as pd
import pymysql
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "raw"

TXT_PATH = RAW_DIR / "국민건강보험공단_장기요양기관 평가 결과_20241231.csv"
# 1) CSV 불러오기
df = pd.read_csv(TXT_PATH)

def to_float(v):
    if v is None:
        return None

    s = str(v).strip().replace("점", "").replace(",", "")
    if s in ["", "-", "NaN", "nan"]:
        return None

    try:
        return float(s)
    except:
        return None

def compute_total_if_missing(row):
    """평가총점이 비어있으면 나머지 5개 점수의 평균으로 계산"""

    op = row["기관운영"]
    safety = row["환경및안전"]
    rights = row["수급자권리보장"]
    process = row["급여제공과정"]
    result = row["급여제공결과"]

    values = [v for v in [op, safety, rights, process, result] if v is not None]

    if not values:
        return None  # 다 비었으면 total_score도 None

    return sum(values) / len(values)

# 2) 장기요양기관기호를 정제 (하이픈 제거)
df["기관코드"] = df["장기요양기관기호"].astype(str).str.replace("-", "")

# DB 연결
conn = pymysql.connect(
    host="localhost",
    user="root",
    password="1234",
    db="caremate",
    charset="utf8"
)

cursor = conn.cursor()

# 3) DB에서 instCode 목록 불러오기
cursor.execute("SELECT inst_code FROM ltc_facility")
inst_list = [row[0] for row in cursor.fetchall()]

# 4) 매칭 후 업데이트
update_sql = """
             UPDATE ltc_facility SET
                                     grade=%s,
                                     total_score=%s,
                                     op_score=%s,
                                     safety_score=%s,
                                     rights_score=%s,
                                     process_score=%s,
                                     result_score=%s
             WHERE inst_code=%s \
             """

updated = 0

for inst in inst_list:
    match = df[df["기관코드"] == inst]

    if len(match) == 1:
        row = match.iloc[0]

        grade = row["평가등급"]

        total = to_float(row["평가총점"])
        if total is None:
            total = compute_total_if_missing(row)

        op = to_float(row["기관운영"])
        safety = to_float(row["환경및안전"])
        rights = to_float(row["수급자권리보장"])
        process = to_float(row["급여제공과정"])
        result = to_float(row["급여제공결과"])

        cursor.execute(update_sql, (
            grade,
            total,
            op,
            safety,
            rights,
            process,
            result,
            inst
        ))

        updated += 1


conn.commit()
conn.close()

print(f"업데이트 완료: {updated}개 시설 점수 반영됨")
