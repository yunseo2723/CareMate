import { KRW } from '../utils/format'
import type { Facility } from '../types/facility'


interface Props {
    f: Facility
    inCompare: boolean
    onCompare: () => void
}


export function ResultCard({ f, inCompare, onCompare }: Props){
    return (
        <div className="overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-md">
            <div className="aspect-video w-full bg-slate-100" style={{backgroundImage:`url(${f.photos?.[0]})`, backgroundSize:'cover', backgroundPosition:'center'}}/>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="font-medium line-clamp-1">{f.name}</div>
                    <button onClick={onCompare} className={`h-8 w-8 rounded-md border text-sm ${inCompare?'bg-slate-900 text-white':''}`}>{inCompare?'−':'+'}</button>
                </div>
                <div className="mt-1 text-xs text-slate-600">{f.address} • {f.distanceKm ?? '-'}km</div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                    <div>★ {f.rating.toFixed(1)}</div>
                    <div>{f.bedsAvailable>0?`${f.bedsAvailable}석 가능`:'대기'}</div>
                    <span className="rounded border px-2 py-0.5 text-xs">{f.careLevel}</span>
                </div>
                <div className="mt-2 text-sm font-semibold">월 ₩{KRW(f.monthlyCost)}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                    {f.amenities.slice(0,4).map(a => <span key={a} className="rounded bg-slate-100 px-2 py-0.5 text-[11px]">{a}</span>)}
                    {f.amenities.length>4 && <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px]">+{f.amenities.length-4}</span>}
                </div>
                <div className="mt-3 flex justify-between">
                    <button className="rounded-md border px-3 py-1.5 text-sm">견학 예약</button>
                    <div className="space-x-2">
                        <button className="rounded-md px-3 py-1.5 text-sm">저장</button>
                        <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white">자세히 보기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}