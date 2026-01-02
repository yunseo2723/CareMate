from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[3]  # ml-serving/app/recommend -> ml-serving/app -> ml-serving -> CareMate
ML_PIPELINE_DIR = PROJECT_ROOT / "ml-pipeline"
FEATURE_DIR = ML_PIPELINE_DIR / "data" / "features"
RAW_DIR = ML_PIPELINE_DIR / "data" / "raw"

def load_facility_features_latest():
    return pd.read_parquet(
        FEATURE_DIR / "facility_features" / "facility_features_latest.parquet"
    )

def load_facility_meta():
    return pd.read_parquet(
        RAW_DIR / "facilities" / "facilities_latest.parquet"
    )

def load_review_sentences_latest():
    return pd.read_parquet(
        FEATURE_DIR / "review_sentences" / "review_sentences_latest.parquet"
    )
