import csv
import json
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "raw"
OUT_DIR = ROOT / "output"
OUT_DIR.mkdir(parents=True, exist_ok=True)

CSV_PATH = RAW_DIR / "국민건강보험공단_장기요양기관 시설별 현황.csv"
OUT_PATH = OUT_DIR / "facilities.json"

BASE_URL = "http://localhost:8080/ltc/detail"


def guess_inst_col(headers):
    candidates = [
        "장기요양기관기호",
        "장기요양기관번호",
        "기관기호",
        "기관번호",
        "기관코드",
        "요양기관기호",
        "instCode",
    ]
    for c in candidates:
        if c in headers:
            return c
    for h in headers:
        if "기관" in h and ("기호" in h or "코드" in h or "번호" in h):
            return h
    return None


def guess_kind_col(headers):
    candidates = [
        "기관유형코드",
        "장기요양기관종별코드",
        "급여종류코드",
        "기관종별코드",
        "kindCode",
        "기관유형",
    ]
    for c in candidates:
        if c in headers:
            return c
    for h in headers:
        if "코드" in h and ("유형" in h or "종별" in h or "급여" in h):
            return h
    return None


def wait_for_server(url_base: str, tries: int = 20, delay: float = 1.0):
    """
    스프링이 완전히 뜰 때까지 기다린다.
    /ltc/detail 말고 / 같은 데도 404로 응답만 해주면 '살아있다' 로 본다.
    """
    print(f"[INFO] 서버 체크: {url_base}")
    for i in range(tries):
        try:
            r = requests.get(url_base.replace("/ltc/detail", "/"), timeout=2)
            # 2xx, 3xx, 4xx 다 '서버가 응답했다' 로 본다
            print(f"[INFO] 서버 응답 확인됨 ({r.status_code}), 수집 시작")
            return True
        except Exception:
            print(f"[WAIT] 서버가 아직 안 떠있음... ({i+1}/{tries})")
            time.sleep(delay)
    print("[ERROR] 서버가 안 떠있어서 중단할게요.")
    return False


def main():
    # ---- 서버 먼저 확인 ----
    if not wait_for_server(BASE_URL):
        return

    # ---- CSV 열기 ----
    try:
        f = CSV_PATH.open("r", encoding="utf-8")
    except UnicodeDecodeError:
        f = CSV_PATH.open("r", encoding="utf-8-sig")

    reader = csv.DictReader(f)
    headers = reader.fieldnames
    print("[INFO] CSV 헤더:", headers)

    inst_col = guess_inst_col(headers)
    kind_col = guess_kind_col(headers)
    print(f"[INFO] 추정한 기관코드 컬럼: {inst_col}")
    print(f"[INFO] 추정한 기관유형 컬럼: {kind_col}")

    if not inst_col or not kind_col:
        print("[ERROR] 컬럼명을 못 맞췄어요. 위에 찍힌 헤더 이름 중 실제 컬럼명을 알려주면 다시 박아줄게요.")
        return

    inst_to_kind: dict[str, str] = {}
    row_count = 0

    for row in reader:
        row_count += 1
        inst_code = row.get(inst_col)
        kind_code = row.get(kind_col)

        if row_count <= 5:
            print(f"[ROW {row_count}] inst={inst_code} / kind={kind_code}")

        if not inst_code or not kind_code:
            continue

        inst_code = inst_code.replace("-", "").strip()
        kind_code = kind_code.strip()

        # 이미 있으면(=위에 줄이 있으면) 스킵
        if inst_code in inst_to_kind:
            continue

        inst_to_kind[inst_code] = kind_code

    f.close()

    print(f"[INFO] CSV 전체 행: {row_count}행")
    print(f"[INFO] 고유 기관 수: {len(inst_to_kind)}개")

    results = []

    for idx, (inst_code, kind_code) in enumerate(inst_to_kind.items(), start=1):
        params = {"instCode": inst_code, "kindCode": kind_code}
        url = f"{BASE_URL}?instCode={inst_code}&kindCode={kind_code}"

        try:
            r = requests.get(BASE_URL, params=params, timeout=5)
            r.raise_for_status()
            data = r.json()
            results.append(data)
            print(f"[OK] {inst_code} / {kind_code} → {url}")
        except requests.exceptions.ConnectionError as e:
            # 🔴 여기서 지금처럼 WinError 10061이 나는 거
            print(f"[MISS-CONN] 서버 연결 안 됨 → {url} | {e}")
            # 여기선 리턴하지 말고 '서버 내려감' 이라고만 표시하고 다음으로
            # 만약 여기서 바로 중단하고 싶으면 break
        except Exception as e:
            print(f"[MISS] {inst_code} / {kind_code} → {e} | {url}")

        time.sleep(0.03)

        if idx % 200 == 0:
            with OUT_PATH.open("w", encoding="utf-8") as f_out:
                json.dump(results, f_out, ensure_ascii=False, indent=2)
            print(f"[SNAPSHOT] {idx}개까지 저장")

    with OUT_PATH.open("w", encoding="utf-8") as f_out:
        json.dump(results, f_out, ensure_ascii=False, indent=2)

    print(f"[DONE] 총 {len(results)}개 저장 → {OUT_PATH}")


if __name__ == "__main__":
    main()
