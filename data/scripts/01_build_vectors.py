# 01_build_vectors.py
import json
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
IN_FILE = ROOT / "output" / "ltc_from_mysql.json"
OUT_FILE = ROOT / "output" / "facilities_vectors.npz"

def load_data():
    with open(IN_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def build_text(field):
    """None → '' 로 변환"""
    return field if isinstance(field, str) else ""


def build_facility_text(f):
    """각 시설의 텍스트 특징 결합"""
    parts = []

    parts.append(build_text(f.get("name")))
    parts.append(build_text(f.get("fullRoadAddr")))
    parts.append(build_text(f.get("phone")))

    # 프로그램 텍스트
    for p in f.get("programs", []):
        parts.append(build_text(p.get("pgmNm")))
        parts.append(build_text(p.get("runPlc")))

    # 계약 병원명
    for c in f.get("contracts", []):
        parts.append(build_text(c.get("yoyangNm")))

    return " ".join([p for p in parts if p])


def build_numeric_features(f):
    numeric_fields = [
        "capacityTotal",
        "residentMale", "residentFemale",
        "nurse", "doctor", "caregiver", "socialWorker",
        "nurseAide", "physicalTher", "occupTher",
        "nutritionist", "cook", "manager", "assistant",

        "singleRm", "doubleRm", "tripleRm",
        "quadrupleRm", "specialRm",

        "adlTraining", "programRoom", "diningKitchen",
        "toilet", "bath", "laundry",
    ]

    result = []
    for key in numeric_fields:
        val = f.get(key)
        result.append(float(val) if val is not None else 0.0)
    return result


def main():
    data = load_data()

    # --------------------------
    # 1) 텍스트 생성
    # --------------------------
    texts = [build_facility_text(f) for f in data]

    tfidf = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        min_df=2
    )
    text_vec = tfidf.fit_transform(texts)

    # --------------------------
    # 2) 숫자 특징 생성
    # --------------------------
    num_features = np.array([build_numeric_features(f) for f in data])
    scaler = StandardScaler()
    num_vec = scaler.fit_transform(num_features)

    # --------------------------
    # 3) 최종 벡터 결합
    # --------------------------
    final_vectors = np.hstack([text_vec.toarray(), num_vec])

    # --------------------------
    # 4) 저장
    # --------------------------
    np.savez_compressed(
        OUT_FILE,
        vectors=final_vectors,
        instCodes=[f["instCode"] for f in data],
        kindCodes=[f["kindCode"] for f in data]
    )

    print("🔥 벡터 생성 완료")
    print(" - 시설 수:", len(data))
    print(" - 벡터 차원:", final_vectors.shape)
    print(" - 파일:", OUT_FILE)


if __name__ == "__main__":
    main()
