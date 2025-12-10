import { useSearch } from "../hooks/useSearch";

export function Filters() {
    const {
        center, setCenter,
        radiusKm, setRadiusKm,
        careLevel, setCareLevel,
        gradeFilter, setGradeFilter,
        minCaregiver, setMinCaregiver, // ⭐ 요양보호사 최소 수

        hasNurse, setHasNurse,
        hasDoctor, setHasDoctor,
        hasSocial, setHasSocial,

        roomTypes, setRoomTypes,

        programTypes, setProgramTypes
    } = useSearch();

    const toggle = (arr: string[], set: (v: string[]) => void, v: string) => {
        if (arr.includes(v)) set(arr.filter(x => x !== v));
        else set([...arr, v]);
    };

    return (
        <div className="rounded-2xl border bg-white p-6 space-y-5">

            {/* 🔥 위치 검색 단일 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">위치 검색</label>
                <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={center}
                    onChange={(e) => setCenter(e.target.value)}   // 🔥 바로 context state 수정
                    placeholder="예: 강남구청"
                />
                <p className="text-xs text-slate-500">
                    입력한 위치를 중심으로 반경 내 요양원을 보여드립니다.
                </p>
            </div>

            {/* 반경 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    검색 반경: {radiusKm}km
                </label>
                <input
                    type="range"
                    min={0.5}
                    max={50}
                    step={0.5}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}  // 🔥 radiusKm 업데이트
                    className="w-full"
                />
            </div>

            {/* 유형 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">유형</label>
                <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={careLevel}
                    onChange={(e) => setCareLevel(e.target.value)}
                >
                    <option value="전체">전체</option>
                    <option value="요양원">요양원</option>
                    <option value="재가노인복지시설">재가노인복지시설</option>
                    <option value="재가장기요양기관">재가장기요양기관</option>
                    <option value="치매전담실">치매전담실</option>
                    <option value="기타">기타</option>
                </select>
            </div>

            {/* 평가등급 선택 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">국민건강보험공단 평가 등급 (미평가 요양원 존재)</label>

                <div className="flex gap-2 flex-wrap">
                    {["전체", "A", "B", "C", "D", "E"].map(g => (
                        <button
                            key={g}
                            onClick={() => setGradeFilter(g)}
                            className={`px-3 py-1 rounded-md border text-sm
                    ${gradeFilter === g ? "bg-slate-900 text-white" : "bg-white"}
                `}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>


            {/* 인력 필터 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">요양보호사 최소 인원: {minCaregiver}명</label>
                <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={minCaregiver}
                    onChange={(e) => setMinCaregiver(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">인력 구성</label>
                <div className="flex flex-col gap-1 text-sm">
                    <label><input type="checkbox" checked={hasNurse} onChange={e => setHasNurse(e.target.checked)} /> 간호 인력 있음</label>
                    <label><input type="checkbox" checked={hasDoctor} onChange={e => setHasDoctor(e.target.checked)} /> 의사 있음</label>
                    <label><input type="checkbox" checked={hasSocial} onChange={e => setHasSocial(e.target.checked)} /> 사회복지사 있음</label>
                </div>
            </div>

            {/* 병실 / 시설 필터 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">병실 / 시설</label>
                <div className="flex flex-wrap gap-2">
                    {["1인실","2인실","3인실","4인실","프로그램실","식당","목욕실"].map((rt) => (
                        <button
                            key={rt}
                            onClick={() => toggle(roomTypes, setRoomTypes, rt)}
                            className={`px-3 py-1 rounded-md border text-sm ${
                                roomTypes.includes(rt) ? "bg-slate-900 text-white" : "bg-white"
                            }`}
                        >
                            {rt}
                        </button>
                    ))}
                </div>
            </div>

            {/* 프로그램 필터 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">프로그램</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        {code:"1", name:"인지기능향상"},
                        {code:"2", name:"운동보조"},
                        {code:"4", name:"현실인식훈련"},
                        {code:"5", name:"운동요법"},
                        {code:"6", name:"가족참여"},
                        {code:"7", name:"인지자극활동"},
                        {code:"8", name:"음악활동"},
                        {code:"기타", name:"기타 프로그램"},
                    ].map((p) => (
                        <button
                            key={p.code}
                            onClick={() => toggle(programTypes, setProgramTypes, p.code)}
                            className={`px-3 py-1 rounded-md border text-sm ${
                                programTypes.includes(p.code)
                                    ? "bg-slate-900 text-white"
                                    : "bg-white"
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
