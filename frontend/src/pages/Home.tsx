// src/pages/Home.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filters } from '../components/Filters'
import { MapPanel } from '../components/MapPanel'
import { useSearch } from '../hooks/useSearch'
import SaveFilterModal from "../components/SaveFilterModal.tsx";
import {useEffect, useState} from "react";
import ResetFiltersButton from "../components/ResetFiltersButton.tsx";
import AiRecommendSidePanel from "../components/AiRecommendSidePanel.tsx";
import AiResultModal from "../components/AiResultModal.tsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const search = useSearch();
    const { applyFilter, editingFilterId, setEditingFilterId } = search;

    const [aiOpen, setAiOpen] = useState(false);
    const [aiResult] = useState<any>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const f = params.get("filter");
        const editingId = params.get("editingFilter");

        if (f && !search._initialized) {
            applyFilter(JSON.parse(decodeURIComponent(f)));
            search.setInitialized(true);
        }

        if (editingId) {
            setEditingFilterId(Number(editingId));
        }
    }, [applyFilter, search, setEditingFilterId]);

    const filterPayload = {
        center: search.center,
        radiusKm: search.radiusKm,
        careLevel: search.careLevel,
        gradeFilter: search.gradeFilter,
        minCaregiver: search.minCaregiver,
        hasNurse: search.hasNurse,
        hasDoctor: search.hasDoctor,
        hasSocial: search.hasSocial,
        roomTypes: search.roomTypes,
        programTypes: search.programTypes,
    };

    return (
        <div className="app-container">
            <div
                className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-[360px_1fr]
          xl:grid-cols-[360px_1fr_320px]
        "
            >
                <aside className="hidden md:block md:sticky md:top-[72px] h-max">
                <div className="rounded-2xl border bg-white p-4 space-y-4">
                        <Filters />

                        {editingFilterId && (
                            <div className="rounded-lg bg-blue-50 border p-3 text-blue-700 text-sm">
                                🔧 <b>저장된 검색 조건 수정 중</b>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <SaveFilterModal
                                filter={filterPayload}
                                editingId={editingFilterId}
                            />

                            {editingFilterId ? (
                                <button
                                    className="flex-1 border py-2 rounded text-gray-600 hover:bg-gray-50"
                                    onClick={() => {
                                        setEditingFilterId(null);
                                        window.history.replaceState({}, "", "/");
                                    }}
                                >
                                    수정 취소
                                </button>
                            ) : (
                                <ResetFiltersButton />
                            )}
                        </div>
                    </div>
                </aside>

                <section>
                    <div className="relative pt-14 md:pt-0">

                        {/* 모바일 월 예상 비용 버튼 */}
                        <div className="md:hidden absolute top-1 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md pointer-events-none">
                            <button
                                className=" pointer-events-auto w-full h-11 bg-lime-600 text-white text-sm
                                font-semibold rounded-full shadow-lg active:scale-[0.98]"
                                onClick={() => navigate("/cost-simulator")}
                            >
                                요양원 월 예상비용 계산하기
                            </button>
                        </div>
                    </div>

                    <MapPanel />
                </section>


                <aside className="md:sticky md:top-[72px] h-max hidden xl:block">
                    <AiRecommendSidePanel />
                </aside>

                {aiResult && (
                    <AiResultModal
                        open={aiOpen}
                        onClose={() => setAiOpen(false)}
                        normalizedNeed={aiResult.normalizedNeed}
                        items={aiResult.items}
                    />
                )}
            </div>
        </div>
    );
}