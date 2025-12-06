/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearch } from "../hooks/useSearch";
import {useState} from "react";

export function Filters() {
    const {
        center, setCenter,
        radiusKm, setRadiusKm,
        budget, setBudget,
        careLevel, setCareLevel,
        gradeFilter, setGradeFilter,
        onlyAvailable, setOnlyAvailable,
        ins, setIns,
        amenities, setAmenities,
        clearAll,
    } = useSearch();

    // 검색창 하나만 사용
    const [locationInput] = useState(center);

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
                    placeholder="예: 부천종합운동장"
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

            {/* 예산 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    월 예산 상한: ₩{budget.toLocaleString("ko-KR")}
                </label>
                <input
                    type="range"
                    min={500000}
                    max={5000000}
                    step={50000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
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


            {/* 입소 가능 */}
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                빈침대(입소 가능)만 보기
            </label>

            {/* 보험 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">보험/급여</label>
                <div className="flex flex-wrap gap-2">
                    {["장기요양", "건보", "비급여"].map((i) => (
                        <button
                            key={i}
                            className={`rounded-md border px-3 py-1 text-sm ${
                                ins.includes(i)
                                    ? "bg-slate-900 text-white"
                                    : "bg-white"
                            }`}
                            onClick={() => toggle(ins, setIns, i)}
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </div>

            {/* 프로그램 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">프로그램/편의</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        "물리치료",
                        "인지프로그램",
                        "영양식단",
                        "송영서비스",
                        "24시간간호",
                        "재활치료",
                    ].map((a) => (
                        <span
                            key={a}
                            onClick={() =>
                                toggle(amenities, setAmenities, a)
                            }
                            className={`cursor-pointer rounded-md border px-2 py-1 text-xs ${
                                amenities.includes(a)
                                    ? "bg-slate-900 text-white"
                                    : "bg-white"
                            }`}
                        >
                            {a}
                        </span>
                    ))}
                </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 pt-2">
                <button
                    className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                    onClick={() => {
                        setCenter(locationInput.trim());
                    }}
                >
                    적용
                </button>
                <button
                    className="rounded-md border px-3 py-2 text-sm"
                    onClick={clearAll}
                >
                    초기화
                </button>
            </div>
        </div>
    );
}
