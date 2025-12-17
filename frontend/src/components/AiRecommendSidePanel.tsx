import { useSearch } from "../hooks/useSearch";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AiRecommendSidePanel() {
    const { authFetch } = useAuth();
    const navigate = useNavigate();
    const { aiPrompt, setAiPrompt, aiResult, setAiResult } = useSearch();
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!aiPrompt.trim()) return;
        setLoading(true);

        const res = await authFetch("http://localhost:8080/ai/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: aiPrompt }),
        });

        setAiResult(await res.json());
        setLoading(false);
    };

    return (
        <div className="rounded-2xl border bg-white p-5 space-y-5 shadow-sm">

            {/* 헤더 */}
            <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="text-lg font-semibold tracking-tight">
                    AI 맞춤 추천
                </h3>
            </div>

            {/* 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    어떤 요양원을 찾고 계신가요?
                </label>
                <textarea
                    className="w-full rounded-lg border px-3 py-2.5 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-slate-300"
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="예: 치매 환자이고, 운동 프로그램이 잘 되어 있는 서울 근교 요양원"
                />
            </div>

            {/* 버튼 */}
            <button
                onClick={submit}
                disabled={loading}
                className="w-full rounded-xl bg-fuchsia-700 py-3 text-white font-semibold
                   hover:bg-fuchsia-600 transition disabled:opacity-60"
            >
                {loading ? "AI가 추천 중입니다..." : "추천 받기"}
            </button>

            {/* 결과 */}
            {aiResult && (
                <div className="space-y-4 pt-2 border-t">

                    {/* 요구 정리 */}
                    <div className="text-sm text-slate-600">
                        <span className="font-medium text-slate-800">요구 정리</span>
                        <span className="ml-1">· {aiResult.normalizedNeed}</span>
                    </div>

                    {/* 추천 카드 */}
                    <div className="space-y-3">
                        {aiResult.items.map((it) => (
                            <div
                                key={it.instCode}
                                onClick={() =>
                                    navigate(`/facility/${it.instCode}?kindCode=${it.kindCode}`)
                                }
                                className="rounded-xl border p-4 cursor-pointer
                           hover:border-slate-400 hover:shadow-sm transition"
                            >
                                <div className="font-semibold text-slate-900">
                                    {it.name}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    {it.address}
                                </div>
                                <div className="text-sm text-slate-700 mt-2 leading-relaxed">
                                    {it.reason}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
