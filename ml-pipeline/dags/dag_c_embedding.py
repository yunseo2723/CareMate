# dags/dag_c_embeddings.py
from pathlib import Path
import pandas as pd

# 임베딩 모델
from sentence_transformers import SentenceTransformer

# (옵션) FAISS 인덱스
try:
    import faiss
    FAISS_AVAILABLE = True
except Exception:
    FAISS_AVAILABLE = False


def get_base_dir() -> Path:
    # dags/ 기준으로 상위가 ml-pipeline
    return Path(__file__).resolve().parents[1]


def run_embedding_job(target_date: str, model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                      batch_size: int = 64, build_faiss: bool = True):

    """
    입력:
      - data/features/review_sentences/review_sentences_latest.parquet
    출력:
      - data/vectors/review_vectors_YYYYMMDD.parquet
      - data/vectors/review_vectors_latest.parquet
      - data/vectors/faiss/review_index_YYYYMMDD.faiss
      - data/vectors/faiss/review_index_latest.faiss
    """

    base_dir = get_base_dir()

    features_dir = base_dir / "data" / "features" / "review_sentences"
    vectors_dir = base_dir / "data" / "vectors"
    faiss_dir = vectors_dir / "faiss"

    vectors_dir.mkdir(parents=True, exist_ok=True)
    faiss_dir.mkdir(parents=True, exist_ok=True)

    in_path = features_dir / "review_sentences_latest.parquet"

    if not in_path.exists():
        raise FileNotFoundError(f"[DAG-C] input not found: {in_path}")

    print(f"[DAG-C] Processing date = {target_date}")
    print(f"[DAG-C] Input = {in_path}")

    df = pd.read_parquet(in_path)

    # 필수 컬럼 체크 (B에서 만든 스키마 기준)
    required = ["inst_code", "kind_code", "review_id", "sentence"]
    for c in required:
        if c not in df.columns:
            raise ValueError(f"[DAG-C] missing column: {c} (columns={list(df.columns)})")

    # 빈 문장 제거
    df["sentence"] = df["sentence"].astype(str).fillna("").str.strip()
    df = df[df["sentence"].str.len() > 0].reset_index(drop=True)

    if len(df) == 0:
        print("[DAG-C] No sentences to embed.")
        return

    # 모델 로드
    print(f"[DAG-C] Loading model = {model_name}")
    model = SentenceTransformer(model_name)

    # 임베딩 생성
    texts = df["sentence"].tolist()
    print(f"[DAG-C] Embedding {len(texts)} sentences... (batch_size={batch_size})")

    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True,  # 코사인 유사도 쓰기 편함
    )

    # 벡터 저장 (parquet에 list[float]로 저장)
    out_df = df[["inst_code", "kind_code", "review_id", "sentence"]].copy()
    out_df["vector"] = [v.astype("float32").tolist() for v in embeddings]

    # 날짜별 저장
    dated_out_path = vectors_dir / f"review_vectors_{target_date}.parquet"
    out_df.to_parquet(dated_out_path, engine="pyarrow", index=False)

    # latest 저장
    latest_out_path = vectors_dir / "review_vectors_latest.parquet"
    out_df.to_parquet(latest_out_path, engine="pyarrow", index=False)

    print(f"[DAG-C] Saved vectors parquet: {dated_out_path} (rows={len(out_df)})")
    print(f"[DAG-C] Updated latest : {latest_out_path}")

    # (옵션) FAISS 인덱스 생성
    if build_faiss:
        if not FAISS_AVAILABLE:
            print("[DAG-C] faiss not installed. Skip FAISS index build.")
            print("         -> pip install faiss-cpu")
            return

        dim = embeddings.shape[1]
        print(f"[DAG-C] Building FAISS index (dim={dim})...")

        # cosine(=inner product)로 검색하려면 normalize_embeddings=True + IndexFlatIP
        index = faiss.IndexFlatIP(dim)
        index.add(embeddings.astype("float32"))

        # 날짜별
        dated_index_path = faiss_dir / f"review_index_{target_date}.faiss"
        dated_meta_path  = faiss_dir / f"review_meta_{target_date}.parquet"

        faiss.write_index(index, str(dated_index_path))

        # index의 row id(0..n-1) ↔ 문장 메타 매핑 저장
        meta = out_df[["inst_code", "kind_code", "review_id", "sentence"]].copy()
        meta["row_id"] = range(len(meta))
        meta.to_parquet(dated_meta_path, engine="pyarrow", index=False)

        # latest
        latest_index_path = faiss_dir / "review_index_latest.faiss"
        latest_meta_path  = faiss_dir / "review_meta_latest.parquet"

        faiss.write_index(index, str(latest_index_path))
        meta.to_parquet(latest_meta_path, engine="pyarrow", index=False)

        print(f"[DAG-C] Updated FAISS latest index/meta")
        print(f"[DAG-C] Saved FAISS index: {latest_index_path}")
        print(f"[DAG-C] Saved FAISS meta : {latest_meta_path}")


if __name__ == "__main__":
    # 예: python dags/dag_c_embeddings.py
    run_embedding_job("20260102", build_faiss=True)
