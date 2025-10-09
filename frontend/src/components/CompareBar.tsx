import { useSearch } from '../hooks/useSearch.ts'


export function CompareBar(){
    const { compare, setCompare } = useSearch()
    if (!compare.length) return null
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
                <div className="text-sm">비교 {compare.length}/3</div>
                <div className="ml-auto flex gap-2">
                    {compare.map(c => (
                        <span key={c.id} className="rounded-md bg-slate-100 px-2 py-1 text-xs">
{c.name}
                            <button className="ml-2" onClick={()=>setCompare(prev=>prev.filter(p=>p.id!==c.id))}>×</button>
</span>
                    ))}
                </div>
                <button className="ml-auto rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white">비교 보기</button>
            </div>
        </div>
    )
}