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
        <div className="rounded-xl border bg-white p-4 space-y-4">
            <h3 className="text-lg font-bold">🤖 AI 맞춤 추천</h3>

            <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="예: 치매 환자이고 운동 프로그램이 잘 되어 있는 서울 근교 요양원"
            />

            <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-2 rounded"
            >
                {loading ? "추천 중..." : "추천 받기"}
            </button>

            {aiResult && (
                <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                        <b>요구 정리:</b> {aiResult.normalizedNeed}
                    </div>

                    {aiResult.items.map((it) => (
                        <div
                            key={it.instCode}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/facility/${it.instCode}?kindCode=${it.kindCode}`)}
                        >
                            <div className="font-semibold">{it.name}</div>
                            <div className="text-xs text-gray-500">{it.address}</div>
                            <div className="text-sm mt-1">{it.reason}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
