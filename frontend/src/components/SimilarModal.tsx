import { useEffect, useState } from "react";
import {
    fetchFacilityDetailByInst,
    fetchSimilarFacilities,
    type FacilityDetailDTO,
} from "../api/ltc";

export function SimilarModal({
                                 instCode,
                                 kindCode,
                                 onClose,
                             }: {
    instCode: string;
    kindCode: string;
    onClose: () => void;
}) {
    const [base, setBase] = useState<FacilityDetailDTO | null>(null);

    const [similars, setSimilars] = useState<
        Array<{
            instCode: string;
            kindCode: string;
            name: string;
            fullRoadAddr: string;
            score: number;
        }>
    >([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        (async () => {
            setLoading(true);

            // 선택된 시설 상세 DB 데이터 가져오기
            const detail = await fetchFacilityDetailByInst(instCode, kindCode);
            if (!alive) return;
            setBase(detail);

            // 유사 요양원 가져오기
            const raw = await fetchSimilarFacilities(instCode, 5);
            console.log("similar raw:", raw);

            const expanded = raw.map((item) => ({
                instCode: item.instCode,
                kindCode: item.kindCode,
                name: item.name,
                fullRoadAddr: item.fullRoadAddr ?? "-",
                score: item.score ?? 0
            }));

            if (!alive) return;

            expanded.sort((a, b) => b.score - a.score);
            setSimilars(expanded);
            setLoading(false);
        })();

        return () => {
            alive = false;
        };
    }, [instCode, kindCode]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999999]">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

                {/* 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold tracking-tight">
                        유사 요양원 추천
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-md bg-slate-100 px-3 py-1.5 text-sm
                       hover:bg-slate-200 transition"
                    >
                        닫기
                    </button>
                </div>

                {/* 기준 요양원 */}
                {base && (
                    <a
                        href={`/facility/${base.instCode}?kindCode=${base.kindCode}`}
                        className="block mt-4 rounded-xl border bg-slate-50 p-4
                       hover:bg-slate-100 transition"
                    >
                        <div className="flex items-center gap-2 mb-1">
              <span className="text-xs rounded-full bg-slate-900 text-white px-2 py-0.5">
                기준 요양원
              </span>
                        </div>
                        <div className="font-semibold text-slate-900">
                            {base.name}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                            {base.fullRoadAddr}
                        </div>
                        {base.phone && (
                            <div className="text-xs text-blue-600 underline mt-1">
                                {base.phone}
                            </div>
                        )}
                    </a>
                )}

                {/* 유사 요양원 리스트 */}
                <div className="mt-5 space-y-2">
                    {loading ? (
                        <div className="text-sm text-slate-500">
                            불러오는 중…
                        </div>
                    ) : similars.length === 0 ? (
                        <div className="text-sm text-slate-500">
                            추천 결과가 없습니다.
                        </div>
                    ) : (
                        similars.map((s) => {
                            const percent = Math.round(s.score * 100);

                            return (
                                <a
                                    key={s.instCode}
                                    href={`/facility/${s.instCode}?kindCode=${s.kindCode}`}
                                    className="block rounded-xl border p-4 text-sm
                             hover:border-slate-400 hover:bg-slate-50 transition"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="font-medium text-slate-900">
                                            {s.name}
                                        </div>

                                        {/* 유사도 뱃지 */}
                                        <div
                                            className={`text-xs rounded-full px-2 py-0.5
                        ${
                                                percent >= 90
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : percent >= 80
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            유사도 {percent}%
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-600 mt-1">
                                        {s.fullRoadAddr}
                                    </div>
                                </a>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}