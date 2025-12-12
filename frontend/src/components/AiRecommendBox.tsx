import { useState } from "react";

export default function AiRecommendBox({
                                           onSubmit,
                                       }: {
    onSubmit: (message: string) => void;
}) {
    const [msg, setMsg] = useState("");

    return (
        <div className="rounded-2xl border bg-white p-5 space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
                🤖 AI 맞춤 추천
            </h2>

            <textarea
                className="w-full border rounded-md p-3 text-sm resize-none"
                rows={3}
                placeholder="예) 치매가 있고 운동 프로그램이 잘 된 서울 근교 요양원"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            />

            <button
                className="w-full bg-slate-900 text-white py-3 rounded-md font-semibold"
                onClick={() => onSubmit(msg)}
            >
                추천 받기
            </button>
        </div>
    );
}
