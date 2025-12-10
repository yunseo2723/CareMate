// src/pages/Home.tsx
import { Filters } from '../components/Filters'
import { MapPanel } from '../components/MapPanel'
import { useSearch } from '../hooks/useSearch'

export default function Home() {
    const {
        results, loading
    } = useSearch()

    return (
        // 🔸 사이드바 고정폭(<= 300~340px) + 나머지 1fr
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[420px_1fr]">
            {/* 필터 패널 (너비 축소) */}
            <aside className="md:sticky md:top-[64px] h-max">
                <div className="rounded-2xl border bg-white p-4">
                    <Filters />
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
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
