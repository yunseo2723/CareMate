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
        <div className="rounded-2xl border bg-white p-5 space-y-6 shadow-sm">

            {/* 상단 CTA */}
            <div className="hidden md:block">
            <button
                className="
          w-full
          py-2.5
          rounded-lg
          bg-lime-600
          text-white
          text-sm
          font-semibold
          hover:bg-lime-500
        "
                onClick={() => navigate("/cost-simulator")}
            >
                요양원 월 예상 비용 계산하기
            </button>
            </div>

            {/* 위치 검색 */}
            <section className="space-y-2">
                <h3 className="text-sm font-semibold">위치 검색</h3>
                <input
                    className="w-full rounded-md border px-3 py-2 text-sm
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
            <section className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold">검색 반경</h3>
                    <span className="text-xs font-medium text-slate-700">{radiusKm} km</span>
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
            <section className="space-y-2">
                <h3 className="text-sm font-semibold">유형</h3>
                <select
                    className="w-full rounded-md border px-3 py-2 text-sm bg-white
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
            <section className="space-y-2">
                <h3 className="text-sm font-semibold">평가 등급</h3>
                <div className="flex flex-wrap gap-1.5">
                    {["전체", "A", "B", "C", "D", "E"].map(g => (
                        <button
                            key={g}
                            onClick={() => setGradeFilter(g)}
                            className={`px-3 py-1 rounded-full border text-xs transition
                ${gradeFilter === g
                                ? "bg-lime-600 text-white"
                                : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </section>

            {/* 요양보호사 */}
            <section className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold">요양보호사</h3>
                    <span className="text-xs font-medium text-slate-700">
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
            <section className="space-y-2">
                <h3 className="text-sm font-semibold">인력 구성</h3>
                <div className="grid grid-cols-1 gap-1.5 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={hasNurse} onChange={e => setHasNurse(e.target.checked)} />
                        간호 인력
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={hasDoctor} onChange={e => setHasDoctor(e.target.checked)} />
                        의사
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={hasSocial} onChange={e => setHasSocial(e.target.checked)} />
                        사회복지사
                    </label>
                </div>
            </section>

            {/* 병실 / 시설 */}
            <section className="space-y-2">
                <h3 className="text-sm font-semibold">병실 / 시설</h3>
                <div className="flex flex-wrap gap-1.5">
                    {["1인실","2인실","3인실","4인실","프로그램실","식당","목욕실"].map(rt => (
                        <button
                            key={rt}
                            onClick={() => toggle(roomTypes, setRoomTypes, rt)}
                            className={`px-3 py-1 rounded-full border text-xs transition
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
            <section className="space-y-2">
                <h3 className="text-sm font-semibold">프로그램</h3>
                <div className="grid grid-cols-2 gap-1.5">
                    {[
                        "인지기능향상","운동보조","현실인식훈련","운동요법",
                        "가족참여","인지자극활동","음악활동","기타 프로그램",
                    ].map(name => (
                        <button
                            key={name}
                            onClick={() => toggle(programTypes, setProgramTypes, name)}
                            className={`px-3 py-1 rounded-full border text-xs transition
                ${programTypes.includes(name)
                                ? "bg-lime-600 text-white"
                                : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
