import { useSearch } from "../hooks/useSearch";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireLogin } from "../hooks/useRequireLogin";

export default function AiRecommendSidePanel() {
    const { authFetch } = useAuth();
    const navigate = useNavigate();
    const { aiPrompt, setAiPrompt, aiResult, setAiResult } = useSearch();
    const [loading, setLoading] = useState(false);
    const requireLogin = useRequireLogin();

    const submit = async () => {
        if (!aiPrompt.trim()) return;
        setLoading(true);

        const res = await authFetch("https://caremate-fmp1.onrender.com/ai/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: aiPrompt }),
        });

        setAiResult(await res.json());
        setLoading(false);
    };

    return (
        <div className="rounded-2xl border bg-white p-4 space-y-4 shadow-sm">

            {/* 헤더 */}
            <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <h3 className="text-base font-semibold">
                    AI 맞춤 추천
                </h3>
            </div>

            {/* 입력 */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                    어떤 요양원을 찾고 계신가요?
                </label>
                <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-slate-300"
                    rows={2}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="예: 치매 환자, 운동 프로그램이 잘 된 서울 근교 요양원"
                />
            </div>

            {/* 버튼 */}
            <button
                onClick={() =>
                    requireLogin(
                        () => submit()   // ✅ submit 실행
                    )
                }
                disabled={loading}
                className="
          w-full
          rounded-lg
          bg-lime-600
          py-2.5
          text-sm
          font-semibold
          text-white
          hover:bg-lime-500
          transition
          disabled:opacity-60
        "
            >
                {loading ? "AI 추천 중..." : "추천 받기"}
            </button>

            {/* 결과 */}
            {aiResult && (
                <div className="space-y-3 pt-2 border-t">

                    {/* 요구 정리 */}
                    <div className="text-xs text-slate-600">
                        <span className="font-medium text-slate-800">요구 정리</span>
                        <span className="ml-1">· {aiResult.normalizedNeed}</span>
                    </div>

                    {/* 추천 카드 */}
                    <div className="space-y-2">
                        {aiResult.items.map((it) => (
                            <div
                                key={it.instCode}
                                onClick={() =>
                                    navigate(`/facility/${it.instCode}?kindCode=${it.kindCode}`)
                                }
                                className="
                  rounded-lg
                  border
                  p-3
                  cursor-pointer
                  hover:border-slate-400
                  hover:bg-slate-50
                  transition
                "
                            >
                                <div className="text-sm font-semibold text-slate-900">
                                    {it.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {it.address}
                                </div>
                                <div className="text-sm text-slate-700 mt-1 leading-snug">
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

