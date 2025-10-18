// src/pages/Home.tsx
import { Filters } from '../components/Filters'
import { MapPanel } from '../components/MapPanel'
import { useSearch } from '../hooks/useSearch'

export default function Home() {
    const {
        results, center, radiusKm, sort, setSort, loading, clearAll,
    } = useSearch()

    return (
        // 🔸 사이드바 고정폭(<= 300~340px) + 나머지 1fr
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[420px_1fr]">
            {/* 필터 패널 (너비 축소) */}
            <aside className="md:sticky md:top-[64px] h-max">
                <div className="rounded-2xl border bg-white p-4">
                    <Filters />
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                        <span>중심 {center} • 반경 {radiusKm}km</span>
                        <button className="rounded-md border px-3 py-1 hover:bg-slate-50" onClick={clearAll}>
                            초기화
                        </button>
                    </div>

                    {/* (선택) 정렬은 유지하고 싶다면 여기로 이동 */}
                    <div className="mt-2">
                        <label className="mr-2 text-sm">정렬</label>
                        <select
                            className="h-8 rounded-md border px-2 text-sm"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option>추천순</option>
                            <option>가격낮은순</option>
                            <option>거리순</option>
                            <option>평점높은순</option>
                        </select>
                    </div>
                </div>
            </aside>

            {/* 결과는 지도만 */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        {loading ? '결과 계산 중…' : `${results.length}개 결과`}
                    </div>
                </div>

                <MapPanel />
            </section>
        </div>
    )
}
