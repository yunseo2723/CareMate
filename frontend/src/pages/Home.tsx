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

export default function Home() {
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
    }, []);

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[420px_1fr_360px]">

        <aside className="md:sticky md:top-[64px] h-max">
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

            <section className="space-y-3">
                <MapPanel />
            </section>

            {/* 👉 오른쪽: AI 추천 */}
            <aside className="md:sticky md:top-[64px] h-max">
                <AiRecommendSidePanel />
            </aside>

            {/* ✅ AI 결과 팝업 */}
            {aiResult && (
                <AiResultModal
                    open={aiOpen}
                    onClose={() => setAiOpen(false)}
                    normalizedNeed={aiResult.normalizedNeed}
                    items={aiResult.items}
                />
            )}
        </div>
    );
}
