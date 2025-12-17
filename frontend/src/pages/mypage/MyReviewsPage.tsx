import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type MyReview = {
    id: number;
    instCode: string;
    kindCode: string;
    facilityName: string;
    title: string;
    rating: number;
    createdAt: string;
    viewCount: number;
};

export default function MyReviewsPage() {
    const { authFetch } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<MyReview[]>([]);

    useEffect(() => {
        authFetch("http://localhost:8080/myreview/reviews")
            .then(res => res.json())
            .then(setReviews);
    }, [authFetch]);

    return (
        <div className="max-w-4xl space-y-6">

            {/* 타이틀 */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    내가 작성한 리뷰
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    내가 작성한 요양원 리뷰를 한눈에 확인할 수 있습니다.
                </p>
            </div>

            {/* 리뷰 없음 */}
            {reviews.length === 0 && (
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                    아직 작성한 리뷰가 없습니다.
                </div>
            )}

            {/* 리뷰 카드 리스트 */}
            <div className="space-y-3">
                {reviews.map((r) => (
                    <div
                        key={r.id}
                        onClick={() =>
                            navigate(
                                `/facility/${r.instCode}/${r.kindCode}/community/post/${r.id}`
                            )
                        }
                        className="rounded-2xl border bg-white p-5 cursor-pointer
                       hover:border-slate-400 hover:shadow-sm transition"
                    >
                        {/* 상단 */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-xs text-slate-500">
                                    {r.facilityName}
                                </div>
                                <div className="font-semibold text-slate-900 mt-0.5">
                                    {r.title}
                                </div>
                            </div>

                            {/* 별점 */}
                            <div className="text-sm text-yellow-500 whitespace-nowrap">
                                {"★".repeat(r.rating)}
                                <span className="text-slate-300">
                  {"★".repeat(5 - r.rating)}
                </span>
                            </div>
                        </div>

                        {/* 메타 정보 */}
                        <div className="flex gap-4 text-xs text-slate-500 mt-3">
                            <span>작성일 · {r.createdAt.slice(0, 10)}</span>
                            <span>조회 · {r.viewCount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
