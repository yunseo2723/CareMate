import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";

export function Filters() {
    const navigate = useNavigate();
    const {
        center, setCenter,
        radiusKm, setRadiusKm,
        careLevel, setCareLevel,
        gradeFilter, setGradeFilter,
        minCaregiver, setMinCaregiver,

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
        <div className="rounded-3xl border bg-white p-7 space-y-8 shadow-sm">

            {/* 상단 CTA */}
            <button
                className="w-full py-3 rounded-xl bg-lime-600 text-white font-semibold tracking-tight
                   hover:bg-lime-500"
                onClick={() => navigate("/cost-simulator")}
            >
                요양원 월 예상 비용 계산하기
            </button>

            {/* 위치 검색 */}
            <section className="space-y-3">
                <h3 className="text-base font-semibold">위치 검색</h3>
                <input
                    className="w-full rounded-lg border px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-slate-300"
                    value={center}
                    onChange={(e) => setCenter(e.target.value)}
                    placeholder="예: 강남구청"
                />
                <p className="text-xs text-slate-500">
                    입력한 위치를 중심으로 반경 내 요양원을 보여드립니다.
                </p>
            </section>

            {/* 반경 */}
            <section className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold">검색 반경</h3>
                    <span className="text-sm font-medium text-slate-700">{radiusKm} km</span>
                </div>
                <input
                    type="range"
                    min={0.5}
                    max={50}
                    step={0.5}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full accent-slate-500"
                />
            </section>

            {/* 유형 */}
            <section className="space-y-3">
                <h3 className="text-base font-semibold">유형</h3>
                <select
                    className="w-full rounded-lg border px-4 py-2.5 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-slate-300"
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
            </section>

            {/* 평가 등급 */}
            <section className="space-y-3">
                <h3 className="text-base font-semibold">
                    국민건강보험공단 평가 등급
                </h3>
                <div className="flex flex-wrap gap-2">
                    {["전체", "A", "B", "C", "D", "E"].map(g => (
                        <button
                            key={g}
                            onClick={() => setGradeFilter(g)}
                            className={`px-4 py-1.5 rounded-full border text-sm transition
                ${gradeFilter === g
                                ? "bg-lime-600 text-white border-slate-900"
                                : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </section>

            {/* 요양보호사 */}
            <section className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold">요양보호사 최소 인원</h3>
                    <span className="text-sm font-medium text-slate-700">
            {minCaregiver}명
          </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={minCaregiver}
                    onChange={(e) => setMinCaregiver(Number(e.target.value))}
                    className="w-full accent-slate-500"
                />
            </section>

            {/* 인력 구성 */}
            <section className="space-y-3">
                <h3 className="text-base font-semibold">인력 구성</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={hasNurse} onChange={e => setHasNurse(e.target.checked)} />
                        간호 인력 있음
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={hasDoctor} onChange={e => setHasDoctor(e.target.checked)} />
                        의사 있음
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={hasSocial} onChange={e => setHasSocial(e.target.checked)} />
                        사회복지사 있음
                    </label>
                </div>
            </section>

            {/* 병실 / 시설 */}
            <section className="space-y-3">
                <h3 className="text-base font-semibold">병실 / 시설</h3>
                <div className="flex flex-wrap gap-2">
                    {["1인실","2인실","3인실","4인실","프로그램실","식당","목욕실"].map(rt => (
                        <button
                            key={rt}
                            onClick={() => toggle(roomTypes, setRoomTypes, rt)}
                            className={`px-4 py-1.5 rounded-full border text-sm transition
                ${roomTypes.includes(rt)
                                ? "bg-lime-600 text-white"
                                : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            {rt}
                        </button>
                    ))}
                </div>
            </section>

            {/* 프로그램 */}
            <section className="space-y-3">
                <h3 className="text-base font-semibold">프로그램</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        {name:"인지기능향상"},
                        {name:"운동보조"},
                        {name:"현실인식훈련"},
                        {name:"운동요법"},
                        {name:"가족참여"},
                        {name:"인지자극활동"},
                        {name:"음악활동"},
                        {name:"기타 프로그램"},
                    ].map(p => (
                        <button
                            key={p.name}
                            onClick={() => toggle(programTypes, setProgramTypes, p.name)}
                            className={`px-4 py-1.5 rounded-full border text-sm transition
                ${programTypes.includes(p.name)
                                ? "bg-lime-600 text-white"
                                : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
