import { useState } from "react";
import type { RecommendItem } from "../api/ltc";
import { useNavigate } from "react-router-dom";

export default function RecommendList({ items }: { items: RecommendItem[] }) {
    const nav = useNavigate();
    const [openId, setOpenId] = useState<string | null>(null);

    if (!items || items.length === 0) {
        return (
            <div className="rounded-2xl border bg-white p-6 text-slate-500">
                추천 결과가 없습니다. 다른 문장으로 검색해보세요.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border bg-white p-6 space-y-4">
            <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold">🔥 리뷰 기반 요양원 추천</h2>
                <span className="text-xs text-slate-500">후기 근거 문장 제공</span>
            </div>

            <div className="space-y-3">
                {items.map((it) => {
                    const id = `${it.instCode}_${it.kindCode}`;
                    const isOpen = openId === id;

                    return (
                        <div key={id} className="rounded-xl border p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <button
                                        className="text-left font-semibold text-lg hover:underline"
                                        onClick={() => nav(`/facility/${it.instCode}?kindCode=${it.kindCode}`)}
                                    >
                                        {it.name}
                                    </button>
                                    <div className="text-sm text-slate-600 truncate">
                                        {it.address}
                                    </div>

                                    <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs rounded-full bg-slate-100 px-2 py-1">
                      등급 {it.grade ?? "-"}
                    </span>
                                        <span className="text-xs rounded-full bg-lime-100 px-2 py-1">
                      추천점수 {it.score}
                    </span>
                                    </div>

                                    <div className="mt-2 text-sm text-slate-700 line-clamp-1">
                                        “{it.reasons?.[0]?.sentence ?? "추천 이유 데이터 없음"}”
                                    </div>

                                    <button
                                        className="mt-2 text-xs text-lime-700 underline"
                                        onClick={() => setOpenId(isOpen ? null : id)}
                                    >
                                        {isOpen ? "접기" : "추천 이유 더보기"}
                                    </button>

                                    {isOpen && (
                                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                                            {it.reasons.map((r, idx) => (
                                                <li key={idx}>• {r.sentence}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
