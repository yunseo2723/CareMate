import { useSearch } from '../contexts/SearchContext.tsx'

export function Filters(){
    const {
        q, setQ,
        center, setCenter,
        radiusKm, setRadiusKm,
        budget, setBudget,
        careLevel, setCareLevel,
        minRating, setMinRating,
        onlyAvailable, setOnlyAvailable,
        ins, setIns,
        amenities, setAmenities,
        clearAll,
    } = useSearch()


    const toggle = (arr: string[], set:(v:string[])=>void, v:string) => {
        if (arr.includes(v)) set(arr.filter(x=>x!==v)); else set([...arr, v]);
    }


    return (
        <div className="rounded-2xl border bg-white p-6 space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-medium">키워드</label>
                <div className="flex gap-2">
                    <input className="w-full rounded-md border px-3 py-2 text-sm" value={q} onChange={e=>setQ(e.target.value)} placeholder="요양원명/주소"/>
                    <button className="rounded-md border px-3 text-sm" onClick={()=>setQ('')}>지우기</button>
                </div>
            </div>


<div className="space-y-2">
    <label className="text-sm font-medium">중심 위치</label>
    <input className="w-full rounded-md border px-3 py-2 text-sm" value={center} onChange={e=>setCenter(e.target.value)} placeholder="예: 서울 강남구"/>
    <div className="pt-3 text-xs">검색 반경: {radiusKm}km</div>
    <input type="range" min={1} max={50} step={1} value={radiusKm} onChange={e=>setRadiusKm(Number(e.target.value))} className="w-full"/>
</div>


<div className="space-y-2">
    <label className="text-sm font-medium">월 예산 상한: ₩{budget.toLocaleString('ko-KR')}</label>
    <input type="range" min={500000} max={5000000} step={50000} value={budget} onChange={e=>setBudget(Number(e.target.value))} className="w-full"/>
</div>


<div className="space-y-2">
    <label className="text-sm font-medium">유형</label>
    <select className="w-full rounded-md border px-3 py-2 text-sm" value={careLevel} onChange={(e)=>setCareLevel(e.target.value)}>
        <option value="all">전체</option>
        <option value="요양원">요양원</option>
        <option value="요양병원">요양병원</option>
        <option value="주야간보호">주야간보호</option>
        <option value="기타">기타</option>
    </select>
</div>


<div className="space-y-2">
    <label className="text-sm font-medium">최소 평점: {minRating.toFixed(1)}</label>
    <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e=>setMinRating(Number(e.target.value))} className="w-full"/>
</div>


<label className="flex items-center gap-2 text-sm">
    <input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)}/>
    빈침대(입소 가능)만 보기
</label>


<div className="space-y-2">
    <label className="text-sm font-medium">보험/급여</label>
    <div className="flex flex-wrap gap-2">
        {['장기요양','건보','비급여'].map(i => (
            <button key={i} className={`rounded-md border px-3 py-1 text-sm ${ins.includes(i)?'bg-slate-900 text-white':'bg-white'}`} onClick={()=>toggle(ins, setIns, i)}>{i}</button>
        ))}
    </div>
</div>


<div className="space-y-2">
    <label className="text-sm font-medium">프로그램/편의</label>
    <div className="flex flex-wrap gap-2">
        {['물리치료','인지프로그램','영양식단','송영서비스','24시간간호','재활치료'].map(a => (
            <span key={a} onClick={()=>toggle(amenities, setAmenities, a)} className={`cursor-pointer rounded-md border px-2 py-1 text-xs ${amenities.includes(a)?'bg-slate-900 text-white':'bg-white'}`}>{a}</span>
        ))}
    </div>
</div>


<div className="flex gap-2 pt-2">
    <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">적용</button>
    <button className="rounded-md border px-3 py-2 text-sm" onClick={clearAll}>초기화</button>
</div>
</div>
)
}