export function EmptyState(){
    return (
        <div className="rounded-2xl border border-dashed bg-white p-6">
            <div className="text-base font-medium">조건에 맞는 곳이 없어요</div>
            <div className="mt-1 text-sm text-slate-600">반경을 넓히거나 예산/유형 조건을 조정해보세요.</div>
        </div>
    )
}