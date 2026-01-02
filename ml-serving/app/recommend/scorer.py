import numpy as np

def calc_facility_score(avg_rating: float, review_count: int, sentence_count: int):
    rating_score = float(avg_rating) / 5.0
    review_volume = np.log1p(int(review_count))     # 0~(완만 증가)
    sentence_volume = np.log1p(int(sentence_count)) # 리뷰 근거 문장 많을수록 가산

    return (
            0.6 * rating_score +
            0.25 * review_volume +
            0.15 * sentence_volume
    )
