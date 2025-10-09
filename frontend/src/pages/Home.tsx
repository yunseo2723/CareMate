import { Filters } from '../components/Filters'
import { ResultCard } from '../components/ResultCard'
import { EmptyState } from '../components/EmptyState'
import { CompareBar } from '../components/CompareBar'
import { MapPanel } from '../components/MapPanel'
import { useSearch } from '../hooks/useSearch.ts'

export default function Home(){
    const { results, center, radiusKm, sort, setSort, loading, compare, toggleCompare, clearAll } = useSearch()

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <aside className="hidden md:block">
                <div className="sticky top-[64px]">
                    <Filters />
                </div>
            </aside>

    <section className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">{results.length}개 결과 • 중심 {center} • 반경 {radiusKm}km</div>
            <div className="flex items-center gap-2">
                <select className="h-8 rounded-md border px-2 text-sm" value={sort} onChange={(e)=>setSort(e.target.value)}>
                    <option>추천순</option>
                    <option>가격낮은순</option>
                    <option>거리순</option>
                    <option>평점높은순</option>
                </select>
                <button className="h-8 rounded-md border px-3 text-sm" onClick={clearAll}>초기화</button>
            </div>
        </div>


        {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({length:4}).map((_,i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border">
                        <div className="h-36 w-full animate-pulse bg-slate-200"/>
                        <div className="p-4 space-y-2">
                            <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded"/>
                            <div className="h-3 w-2/3 bg-slate-200 animate-pulse rounded"/>
                            <div className="h-3 w-1/3 bg-slate-200 animate-pulse rounded"/>
                        </div>
                    </div>
                ))}
            </div>
        ) : results.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {results.map(f => (
                    <ResultCard key={f.id} f={f}
                                inCompare={!!compare.find(c => c.id===f.id)}
                                onCompare={() => toggleCompare(f)}
                    />
                ))}
            </div>
        ) : (
            <EmptyState/>
        )}


        <MapPanel />
    </section>


    <CompareBar />
</div>
)
}