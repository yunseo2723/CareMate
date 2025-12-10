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
            <div className="bg-white w-full max-w-lg rounded-xl p-5 shadow-xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">유사 요양원 추천</h2>
                    <button onClick={onClose} className="text-sm bg-gray-200 px-2 py-1 rounded">
                        닫기
                    </button>
                </div>

                {/* 선택된 시설 정보 표시 */}
                {base && (
                    <a
                        href={`/facility/${base.instCode}?kindCode=${base.kindCode}`}
                        className="block mt-3 rounded border p-3 bg-gray-50 hover:bg-gray-100"
                    >
                        <div className="text-sm font-semibold">{base.name}</div>
                        <div className="text-xs text-gray-600">{base.fullRoadAddr}</div>
                        {base.phone && (
                            <div className="text-blue-600 underline text-xs mt-1">
                                {base.phone}
                            </div>
                        )}
                    </a>
                )}

                {/* 유사 요양원 추천 리스트 */}
                <div className="mt-4 space-y-2">
                    {loading ? (
                        <div>불러오는 중...</div>
                    ) : similars.length === 0 ? (
                        <div className="text-sm text-gray-500">추천 결과 없음</div>
                    ) : (
                        similars.map((s) => {
                            const percent = Math.round(s.score * 100);

                            return (
                                <a
                                    key={s.instCode}
                                    href={`/facility/${s.instCode}?kindCode=${s.kindCode}`}
                                    className="block rounded border p-3 hover:bg-gray-50 text-sm"
                                >
                                    <div className="flex justify-between">
                                        <div className="font-medium">{s.name}</div>
                                        <div className="text-xs text-gray-500">유사도 {percent}%</div>
                                    </div>
                                    <div className="text-xs text-gray-600">{s.fullRoadAddr}</div>
                                </a>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
