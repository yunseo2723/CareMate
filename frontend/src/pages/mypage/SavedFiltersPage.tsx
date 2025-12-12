// src/pages/SavedFiltersPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { SavedFilter } from "../../types/savedFilter";
import FilterPreviewModal from "../../components/FilterPreviewModal";

export default function SavedFiltersPage() {
    const { authFetch } = useAuth();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<SavedFilter[]>([]);
    const [preview, setPreview] = useState<SavedFilter | null>(null);

    const load = async () => {
        const res = await authFetch("http://localhost:8080/filters");
        setFilters(await res.json());
    };

    useEffect(() => {
        load();
    }, []);

    const apply = (f: SavedFilter) => {
        navigate(
            `/?filter=${encodeURIComponent(f.filterJson)}`
        );
    };

    const edit = (f: SavedFilter) => {
        navigate(
            `/?filter=${encodeURIComponent(f.filterJson)}&editingFilter=${f.id}`
        );
    };

    const remove = async (id: number) => {
        if (!confirm("이 필터를 삭제할까요?")) return;
        await authFetch(`http://localhost:8080/filters/${id}`, { method: "DELETE" });
        load();
    };

    return (
        <div className="p-8 w-full">
            <h1 className="text-3xl font-bold mb-10">저장된 검색 조건</h1>

            {filters.length === 0 && (
                <div className="text-gray-500">저장된 조건이 없습니다.</div>
            )}

            <div className="space-y-6">
                {filters.map((f) => (
                    <div
                        key={f.id}
                        className="border rounded-2xl p-6 flex justify-between items-center"
                    >
                        <div>
                            <div className="text-lg font-semibold">{f.name}</div>
                            <div className="text-sm text-gray-500">
                                {f.createdAt.slice(0, 16).replace("T", " ")}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="px-4 py-2 text-base border rounded-md"
                                onClick={() => setPreview(f)}
                            >
                                보기
                            </button>

                            <button
                                className="px-4 py-2 text-base border rounded-md text-blue-600"
                                onClick={() => apply(f)}
                            >
                                적용
                            </button>

                            <button
                                className="px-4 py-2 text-base border rounded-md"
                                onClick={() => edit(f)}
                            >
                                수정
                            </button>

                            <button
                                className="px-4 py-2 text-base border rounded-md text-red-500"
                                onClick={() => remove(f.id)}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {preview && (
                <FilterPreviewModal
                    filter={JSON.parse(preview.filterJson)}
                    onClose={() => setPreview(null)}
                />
            )}
        </div>
    );
}