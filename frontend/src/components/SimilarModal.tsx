// src/components/SimilarModal.tsx

import { useEffect, useState } from "react";
import {
    fetchFacilityDetailByInst,
    fetchSimilarFacilities,
    type FacilityDetailDTO,
    type SimilarFacility,
} from "../api/ltc";

export function SimilarModal({
                                 instCode,
                                 kindCode = "A03",
                                 onClose,
                             }: {
    instCode: string;
    kindCode?: string;
    onClose: () => void;
}) {
    const [base, setBase] = useState<FacilityDetailDTO | null>(null);
    const [list, setList] = useState<SimilarFacility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        (async () => {
            const [d, similars] = await Promise.all([
                fetchFacilityDetailByInst(instCode, kindCode),
                fetchSimilarFacilities(instCode, 5),
            ]);
            if (!alive) return;
            setBase(d);
            setList(similars);
            setLoading(false);
        })();

        return () => {
            alive = false;
        };
    }, [instCode, kindCode]);

    const sum = base?.summary;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999999]">
            <div className="bg-white w-full max-w-lg rounded-xl p-5">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">유사 요양원 추천</h2>
                    <button onClick={onClose}>닫기</button>
                </div>

                {/* 선택한 요양원 */}
                {sum && (
                    <div className="mt-3 rounded border p-3 bg-gray-50">
                        <div className="text-sm font-semibold">{sum.name}</div>
                        <div className="text-xs text-gray-600">
                            {sum.address ?? "-"}
                        </div>
                        {sum.phone && (
                            <a
                                href={`tel:${sum.phone}`}
                                className="text-blue-600 underline text-xs"
                            >
                                {sum.phone}
                            </a>
                        )}
                    </div>
                )}

                {/* 유사 리스트 */}
                <div className="mt-4 space-y-2">
                    {loading ? (
                        <div>불러오는 중...</div>
                    ) : list.length === 0 ? (
                        <div className="text-sm text-gray-500">추천 결과 없음</div>
                    ) : (
                        list.map((f) => {
                            const percent = f.similarity
                                ? f.similarity <= 1
                                    ? Math.round(f.similarity * 100)
                                    : f.similarity
                                : undefined;

                            return (
                                <a
                                    key={f.id}
                                    href={`/caremates/${f.id}?kindCode=${f.careLevel ?? "A03"}`}
                                    className="block rounded border p-3 hover:bg-gray-50 text-sm"
                                >
                                    <div className="flex justify-between">
                                        <div className="font-medium">{f.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {percent != null
                                                ? `유사도 ${percent}%`
                                                : "유사 조건 충족"}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {f.address ?? "-"}
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
