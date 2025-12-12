import { useSearch } from "../hooks/useSearch";

export default function ResetFiltersButton() {
    const { clearAll } = useSearch();

    return (
        <button
            className="flex items-center gap-2 px-4 py-2 rounded-md
                   border border-red-400 text-red-500
                   hover:bg-red-50 transition text-sm"
            onClick={() => {
                if (confirm("검색 조건을 모두 초기화할까요?")) {
                    clearAll();
                }
            }}
        >
            🔄 필터 초기화
        </button>
    );
}