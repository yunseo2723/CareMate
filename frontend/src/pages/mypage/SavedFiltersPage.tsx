import {useCallback, useEffect, useState} from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { SavedFilter } from "../../types/savedFilter";
import FilterPreviewModal from "../../components/FilterPreviewModal";

export default function SavedFiltersPage() {
    const { authFetch } = useAuth();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<SavedFilter[]>([]);
    const [preview, setPreview] = useState<SavedFilter | null>(null);

    const load = useCallback(async () => {
        const res = await authFetch("http://localhost:8080/filters");
        setFilters(await res.json());
    }, [authFetch]);

    useEffect(() => {
        void load();
    }, [load]);

    const apply = (f: SavedFilter) => {
        navigate(`/?filter=${encodeURIComponent(f.filterJson)}`);
    };

    const edit = (f: SavedFilter) => {
        navigate(
            `/?filter=${encodeURIComponent(f.filterJson)}&editingFilter=${f.id}`
        );
    };

    const remove = async (id: number) => {
        if (!confirm("이 필터를 삭제할까요?")) return;
        await authFetch(`http://localhost:8080/filters/${id}`, {
            method: "DELETE",
        });
        await load();
    };

    return (
        <div className="max-w-4xl space-y-6">

            {/* 타이틀 */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    저장된 검색 조건
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    자주 사용하는 검색 조건을 저장하고 빠르게 다시 적용할 수 있습니다.
                </p>
            </div>

            {/* 없음 */}
            {filters.length === 0 && (
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                    저장된 검색 조건이 없습니다.
                </div>
            )}

            {/* 리스트 */}
            <div className="space-y-3">
                {filters.map((f) => (
                    <div
                        key={f.id}
                        className="rounded-2xl border bg-white p-5
                       flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        {/* 정보 */}
                        <div>
                            <div className="font-semibold text-slate-900">
                                {f.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                {f.createdAt.slice(0, 16).replace("T", " ")}
                            </div>
                        </div>

                        {/* 액션 */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setPreview(f)}
                                className="rounded-lg border px-3 py-1.5 text-sm
                           hover:bg-slate-50 transition"
                            >
                                보기
                            </button>

                            <button
                                onClick={() => apply(f)}
                                className="rounded-lg bg-lime-600 px-3 py-1.5 text-sm
                           text-white hover:bg-lime-500 transition"
                            >
                                적용
                            </button>

                            <button
                                onClick={() => edit(f)}
                                className="rounded-lg border px-3 py-1.5 text-sm
                           hover:bg-slate-50 transition"
                            >
                                수정
                            </button>

                            <button
                                onClick={() => remove(f.id)}
                                className="rounded-lg border px-3 py-1.5 text-sm
                           text-red-600 hover:bg-red-50 transition"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 미리보기 모달 */}
            {preview && (
                <FilterPreviewModal
                    filter={JSON.parse(preview.filterJson)}
                    onClose={() => setPreview(null)}
                />
            )}
        </div>
    );
}
