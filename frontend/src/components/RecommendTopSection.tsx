import { useEffect, useState } from "react";
import { fetchRecommendTop, type RecommendTopItem } from "../api/ltc";
import { useNavigate } from "react-router-dom";

export default function RecommendTopSection() {
    const [items, setItems] = useState<RecommendTopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        fetchRecommendTop(10)
            .then(res => setItems(res.results))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="rounded-2xl border bg-white p-6 text-slate-500">
                추천 요양원을 불러오는 중입니다…
            </div>
        );
    }

    return (
        <section className="rounded-2xl border bg-white p-6 space-y-4">
            <h2 className="text-xl font-semibold">
                🏆 실시간 리뷰 기반 요양원 TOP 10
            </h2>

            <div className="space-y-3">
                {items.map((it, idx) => (
                    <div
                        key={`${it.instCode}_${it.kindCode}`}
                        className="rounded-xl border p-4 hover:bg-slate-50 cursor-pointer"
                        onClick={() =>
                            nav(`/facility/${it.instCode}?kindCode=${it.kindCode}`)
                        }
                    >
                        {/* 상단 */}
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">
                                {idx + 1}. {it.name}
                            </div>
                            <span className="text-xs rounded-full bg-lime-100 px-2 py-1">
                추천점수 {it.score}
              </span>
                        </div>

                        {/* 주소 */}
                        <div className="text-sm text-slate-500">
                            {it.address}
                        </div>

                        {/* 지표 */}
                        <div className="mt-2 flex gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2 py-1">
                ⭐ 평균 {it.avgRating}
              </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1">
                📝 리뷰 {it.reviewCount}개
              </span>
                            {it.grade && (
                                <span className="rounded-full bg-slate-100 px-2 py-1">
                  등급 {it.grade}
                </span>
                            )}
                        </div>

                        {/* 이유 */}
                        <ul className="mt-3 text-sm text-slate-700 space-y-1">
                            {it.reasons.map((r, i) => (
                                <li key={i}>• {r.sentence}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
