// src/pages/CostSimulator.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useCallback, useMemo, useState} from "react";

type GradeHome =
    | "1등급"
    | "2등급"
    | "3등급"
    | "4등급"
    | "5등급"
    | "인지지원등급";

type GradeFacility =
    | "1등급"
    | "2등급"
    | "3등급"
    | "4등급"
    | "5등급";

type NonBenefitCode =
    | "1" // 식재료비
    | "2" // 상급침실사용료
    | "3" // 이미용비
    | "4" // 경관영양유동식비
    | "5" // 간식비
    | "6" // 상급침실사용료(2인실)
    | "7"; // 기타

const NON_BENEFIT_LABEL: Record<NonBenefitCode, string> = {
    "1": "식재료비",
    "2": "상급침실사용료",
    "3": "이미용비",
    "4": "경관영양유동식비",
    "5": "간식비",
    "6": "상급침실사용료(2인실)",
    "7": "기타",
};

const MONTH_LIMIT_2026: Record<GradeHome, number> = {
    "1등급": 2512900,
    "2등급": 2331200,
    "3등급": 1528200,
    "4등급": 1409700,
    "5등급": 1208900,
    "인지지원등급": 676320,
};

const FACILITY_DAILY_FEE_2026: Record<GradeFacility, number> = {
    "1등급": 93070,
    "2등급": 86340,
    "3등급": 81540,
    "4등급": 81540,
    "5등급": 81540,
};

// 2026 방문요양 (분 -> 수가)
const VISIT_CARE_2026: { minutes: number; fee: number }[] = [
    { minutes: 30, fee: 17450 },
    { minutes: 60, fee: 25320 },
    { minutes: 90, fee: 34120 },
    { minutes: 120, fee: 43430 },
    { minutes: 150, fee: 50640 },
    { minutes: 180, fee: 57020 },
    { minutes: 210, fee: 63530 },
    { minutes: 240, fee: 70080 },
];

// 2026 방문목욕
const VISIT_BATH_2026: { type: "차량 내" | "가정 내" | "미이용"; fee: number }[] =
    [
        { type: "차량 내", fee: 88990 },
        { type: "가정 내", fee: 80230 },
        { type: "미이용", fee: 50100 },
    ];

// 2026 방문간호 (구간)
const VISIT_NURSE_2026: { label: string; fee: number }[] = [
    { label: "15~30분", fee: 42880 },
    { label: "30~60분", fee: 53770 },
    { label: "60분 이상", fee: 64690 },
];

// 2026 주야간보호 (시간대 × 등급)
type DayCareBand =
    | "3~6시간"
    | "6~8시간"
    | "8~10시간"
    | "10~13시간"
    | "13시간 초과";

const DAYCARE_2026: Record<DayCareBand, Record<GradeHome, number>> = {
    "3~6시간": {
        "1등급": 41820,
        "2등급": 38720,
        "3등급": 35740,
        "4등급": 34120,
        "5등급": 32490,
        "인지지원등급": 32490,
    },
    "6~8시간": {
        "1등급": 56060,
        "2등급": 51930,
        "3등급": 47940,
        "4등급": 46300,
        "5등급": 44650,
        "인지지원등급": 44650,
    },
    "8~10시간": {
        "1등급": 69730,
        "2등급": 64590,
        "3등급": 59640,
        "4등급": 58010,
        "5등급": 56360,
        "인지지원등급": 56360,
    },
    "10~13시간": {
        "1등급": 76820,
        "2등급": 71160,
        "3등급": 65750,
        "4등급": 64090,
        "5등급": 62460,
        "인지지원등급": 56360,
    },
    "13시간 초과": {
        "1등급": 82370,
        "2등급": 76310,
        "3등급": 70500,
        "4등급": 68860,
        "5등급": 67240,
        "인지지원등급": 56360,
    },
};

const NON_BENEFIT_DAYS = 30; // 요양원 기준 월 일수

type CopayTypeHome = "일반(15%)" | "경감(9%)" | "경감(6%)" | "기초수급(0%)";
type CopayTypeFacility = "일반(20%)" | "경감(12%)" | "경감(8%)" | "기초수급(0%)";

const copayRateOfHome = (t: CopayTypeHome) => {
    if (t === "일반(15%)") return 0.15;
    if (t === "경감(9%)") return 0.09;
    if (t === "경감(6%)") return 0.06;
    return 0;
};

const copayRateOfFacility = (t: CopayTypeFacility) => {
    if (t === "일반(20%)") return 0.2;
    if (t === "경감(12%)") return 0.12;
    if (t === "경감(8%)") return 0.08;
    return 0;
};

const KRW = (n: number) => n.toLocaleString("ko-KR") + "원";

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function CostSimulator() {
    // 공통

    const resetNonBenefits = () => {
        setNonBenefits({
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
        });

        setNonBenefitBases({
            "1": "",
            "2": "",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "",
        });
    };

    const [nonBenefits, setNonBenefits] = useState<Record<NonBenefitCode, number>>({
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
    });

    const [nonBenefitBases, setNonBenefitBases] = useState<Record<NonBenefitCode, string>>({
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
    });

    const setNonBenefitsFromApi = (list: any[]) => {
        const nextAmount: Record<NonBenefitCode, number> = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
        };

        const nextBase: Record<NonBenefitCode, string> = {
            "1": "",
            "2": "",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "",
        };

        list.forEach((item) => {
            const code = String(item.nonpayKind).trim() as NonBenefitCode;
            const amount = Number(item.nonpayTgtAmt || 0);

            if (code in nextAmount) {
                nextAmount[code] += amount;
                nextBase[code] = item.prodBase || "";
            }
        });

        setNonBenefits(nextAmount);
        setNonBenefitBases(nextBase);
    };


    const [selectedFacility, setSelectedFacility] = useState<{
        instCode: string;
        kindCode: string;
        name: string;
    } | null>(null);

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [, setIsSearching] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    const [gradeHome, setGradeHome] = useState<GradeHome>("1등급");
    const [gradeFacility, setGradeFacility] = useState<GradeFacility>("1등급");
    const [copayTypeHome, setCopayTypeHome] = useState<CopayTypeHome>("일반(15%)");
    const [copayTypeFacility, setCopayTypeFacility] = useState<CopayTypeFacility>("일반(20%)");
    const [mode, setMode] = useState<"재가(방문/주야간)" | "시설(요양원)">("재가(방문/주야간)");

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFacilityQuery(value);
        setHighlightIndex(-1); // 🔥 입력 바뀌면 선택 초기화

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            setIsSearching(true);
            const res = await fetch(
                `https://caremate-fmp1.onrender.com/ltc/search/${encodeURIComponent(value)}`
            );

            const data = await res.json();

            const filtered = Array.isArray(data)
                ? data.filter(
                    (f) => Array.isArray(f.nonBenefits) && f.nonBenefits.length > 0
                )
                : [];

            setSuggestions(filtered);

        } catch (e) {
            console.error(e);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    // 1단계: 월 총 이용(급여) 금액 직접 입력(재가)
    const [manualMonthlyCovered, setManualMonthlyCovered] = useState<number>(0);

    // 2~3단계: 재가 상세
    const [visitCareMinutes, setVisitCareMinutes] = useState<number>(180);
    const [visitCarePerMonth, setVisitCarePerMonth] = useState<string>('');

    const [bathType, setBathType] = useState<"차량 내" | "가정 내" | "미이용">("미이용");
    const [bathCareMinutes, setBathCareMinutes] = useState<string>('');
    const [bathCarePerMonth, setBathCarePerMonth] = useState<string>('');

    const [nurseBand, setNurseBand] = useState<string>("30~60분");
    const [nurseCarePerMonth, setNurseCarePerMonth] = useState<string>('');

    // 주야간보호
    const [daycareBand, setDaycareBand] = useState<DayCareBand>("8~10시간");
    const [daycareDaysPerMonth, setDaycareDaysPerMonth] = useState<string>('');

    // 3단계: 중증/치매 가산 등 (단순화 버전)
    const isSevere = gradeHome === "1등급" || gradeHome === "2등급";
    const applyCareAddOn = isSevere;
    const [applyNurseCopayFreeFirst3, setApplyNurseCopayFreeFirst3] = useState<boolean>(true);


    // 4단계: 시설급여(요양원)
    const [facilityDays] = useState(30); // ✅ (기존 기능) 일수로도 계산

    // 요양원 검색
    const [facilityQuery, setFacilityQuery] = useState("");

    const limit = MONTH_LIMIT_2026[gradeHome];
    const copayRateHome = copayRateOfHome(copayTypeHome);
    const copayRateFacility = copayRateOfFacility(copayTypeFacility);

    const careUnitFee = useMemo(() => {
        return VISIT_CARE_2026.find((x) => x.minutes === visitCareMinutes)?.fee ?? 0;
    }, [visitCareMinutes]);

    const bathUnitFee = useMemo(() => {
        return VISIT_BATH_2026.find((x) => x.type === bathType)?.fee ?? 0;
    }, [bathType]);

    const nurseUnitFee = useMemo(() => {
        return VISIT_NURSE_2026.find((x) => x.label === nurseBand)?.fee ?? 0;
    }, [nurseBand]);

    // 방문요양 중증 가산
    const careAddOnPerVisit = useMemo(() => {
        if (!isSevere) return 0;
        if (!applyCareAddOn) return 0;
        if (visitCareMinutes < 60) return 0;
        const hours = (visitCareMinutes - (visitCareMinutes % 60)) / 60;
        const raw = Math.floor(hours * 2000);
        return clamp(raw, 0, 6000);
    }, [isSevere, applyCareAddOn, visitCareMinutes]);

    const careAddOnPerBath = useMemo(() => {
        const minutes = Number(bathCareMinutes);
        let base = bathUnitFee;
        // 40분 이하 → 80%
        if (minutes > 0 && minutes <= 40) {
            base = bathUnitFee * 0.8;
        }
        // 60분 이상 + 중증가산
        if (isSevere && applyCareAddOn && minutes >= 60) {
            base += 6000;
        }
        return Math.floor(base); // 원 단위 정리
    }, [bathCareMinutes, bathUnitFee, isSevere, applyCareAddOn]);
    
    // 주야간보호 월 급여
    const daycareUnitFee = useMemo(() => {
        return DAYCARE_2026[daycareBand][gradeHome] ?? 0;
    }, [daycareBand, gradeHome]);

    const daycareMonthlyFee = useMemo(() => {
        return daycareUnitFee * Number(daycareDaysPerMonth);
    }, [daycareUnitFee, daycareDaysPerMonth]);

    const homeCoveredMonthlyCalc = useMemo(() => {
        const care = (careUnitFee + careAddOnPerVisit) * Number(visitCarePerMonth);
        const bath = (careAddOnPerBath) * Number(bathCarePerMonth);
        const nurse = nurseUnitFee * Number(nurseCarePerMonth);
        return care + bath + nurse + daycareMonthlyFee;
    }, [careUnitFee, careAddOnPerVisit, visitCarePerMonth, careAddOnPerBath, bathCarePerMonth, nurseUnitFee, nurseCarePerMonth, daycareMonthlyFee]);

    const homeCopayAdjustment = useMemo(() => {
        if (!isSevere) return 0;
        if (!applyNurseCopayFreeFirst3) return 0;
        const freeCount = Math.min(3, Number(nurseCarePerMonth));
        return nurseUnitFee * freeCount * copayRateHome;
    }, [isSevere, applyNurseCopayFreeFirst3, nurseCarePerMonth, nurseUnitFee, copayRateHome]);

    // 시설(요양원) 자동 계산 (2단계)
    const facilityDailyFee = FACILITY_DAILY_FEE_2026[gradeFacility];

    const facilityMonthlyCoveredAutoCalc = useMemo(() => {
        return facilityDailyFee * facilityDays;
    }, [facilityDailyFee, facilityDays]);

    const facilityCopayAuto = useMemo(() => {
        return facilityMonthlyCoveredAutoCalc * copayRateFacility;
    }, [facilityMonthlyCoveredAutoCalc, copayRateFacility]);

    // 재가 한도+본인부담
    const applyLimitAndCopayHome = useCallback(
        (monthlyCovered: number) => {
            const coveredWithinLimit = Math.min(monthlyCovered, limit);
            const over = Math.max(0, monthlyCovered - limit);
            const copay = coveredWithinLimit * copayRateHome;
            const total = copay + over;
            return { coveredWithinLimit, over, copay, total };
        },
        [limit, copayRateHome]
    );

    const homeMonthlyCoveredForCalc = mode === "재가(방문/주야간)" ? homeCoveredMonthlyCalc : 0;

    const nonBenefitTotal = useMemo(() => {
        const dailyTotal = Object.values(nonBenefits).reduce(
            (a, b) => a + b,
            0
        );
        return dailyTotal * NON_BENEFIT_DAYS;
    }, [nonBenefits]);

    const stage1Base = useMemo(() => {
        if (mode === "재가(방문/주야간)") {
            const use = manualMonthlyCovered > 0 ? manualMonthlyCovered : homeMonthlyCoveredForCalc;
            const r = applyLimitAndCopayHome(use);
            const adjustedTotal =
                Math.max(0, r.total - homeCopayAdjustment)
                + nonBenefitTotal;
            return {
                ...r,
                monthlyCovered: use,
                adjustedTotal,
            };
        } else {
        return {
            monthlyCovered: facilityMonthlyCoveredAutoCalc,
            coveredWithinLimit: facilityMonthlyCoveredAutoCalc,
            over: 0,
            copay: facilityCopayAuto,
            total: facilityCopayAuto + nonBenefitTotal,
            adjustedTotal: facilityCopayAuto + nonBenefitTotal,
        };
    }
    }, [mode, manualMonthlyCovered, homeMonthlyCoveredForCalc, applyLimitAndCopayHome, homeCopayAdjustment, nonBenefitTotal, facilityMonthlyCoveredAutoCalc, facilityCopayAuto]);


    const handleSelectFacility = (facility: any) => {
        resetNonBenefits();

        setSelectedFacility({
            name: facility.name,
            instCode: facility.instCode,
            kindCode: facility.kindCode,
        });

        if (Array.isArray(facility.nonBenefits)) {
            setNonBenefitsFromApi(facility.nonBenefits);
        }

        setFacilityQuery(facility.name);
        setSuggestions([]);
        setHighlightIndex(-1);
    };


    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* 상단 */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-2xl font-bold">요양원 월 예상 비용 계산기</div>
                    <div className="text-sm text-gray-500 mt-1">
                        ※ 제공한 2026 자료(월 한도액/재가 수가)를 기반으로 “대략적인 추정”을 계산합니다. <div></div>
                        실제 청구는 기관/이용방식/경감대상 등에 따라 달라질 수 있어요.
                    </div>
                </div>
            </div>

            {/* 공통 설정 */}
            <div className="rounded-2xl border bg-white p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <label className="space-y-1">
                        <div className="text-sm font-medium">이용 형태</div>
                        <select className="border rounded p-2 w-full" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                            <option>재가(방문/주야간)</option>
                            <option>시설(요양원)</option>
                        </select>
                    </label>
                    { mode === "재가(방문/주야간)" && (
                        <>
                    <label className="space-y-1">
                        <div className="text-sm font-medium">장기요양 등급</div>
                        <select className="border rounded p-2 w-full" value={gradeHome} onChange={(e) => setGradeHome(e.target.value as GradeHome)}>
                            {Object.keys(MONTH_LIMIT_2026).map((g) => (
                                <option key={g}>{g}</option>
                            ))}
                        </select>

                         <div className="text-xs text-gray-500">2026 월 한도액: {KRW(limit)}</div>
                    </label>
                    <label className="space-y-1">
                        <div className="text-sm font-medium">본인부담 유형</div>
                        <select
                            className="border rounded p-2 w-full"
                            value={copayTypeHome}
                            onChange={(e) => setCopayTypeHome(e.target.value as CopayTypeHome)}
                        >
                            <option>일반(15%)</option>
                            <option>경감(9%)</option>
                            <option>경감(6%)</option>
                            <option>기초수급(0%)</option>
                        </select>
                    </label>
                        </>
                        )}
                    { mode === "시설(요양원)" && (
                        <>
                        <label className="space-y-1">
                            <div className="text-sm font-medium">장기요양 등급</div>
                            <select className="border rounded p-2 w-full" value={gradeFacility} onChange={(e) => setGradeFacility(e.target.value as GradeFacility)}>
                                {Object.keys(FACILITY_DAILY_FEE_2026).map((g) => (
                                    <option key={g}>{g}</option>
                                ))}
                            </select>

                            <div className="text-xs text-gray-500">
                                ※ 시설급여는 월 한도 적용 대상이 아닙니다
                            </div>

                        </label>
                        <label className="space-y-1">
                            <div className="text-sm font-medium">본인부담 유형</div>
                            <select
                                className="border rounded p-2 w-full"
                                value={copayTypeFacility}
                                onChange={(e) => setCopayTypeFacility(e.target.value as CopayTypeFacility)}
                            >
                                <option>일반(20%)</option>
                                <option>경감(12%)</option>
                                <option>경감(8%)</option>
                                <option>기초수급(0%)</option>
                            </select>
                        </label>
                        </>
                    )}
                </div>

                <div className="text-xs text-gray-500">
                    ※ 중증/치매 가산은 장기요양 1·2등급 선택 시 자동 적용됩니다.
                </div>
                {mode === "재가(방문/주야간)" && isSevere && (
                    <div className="flex flex-col gap-2">
                        <div className="text-xs text-gray-500">
                            ※ 방문간호 최초 3회 본인부담 면제는 실제 이용 여부에 따라 선택 적용됩니다.
                        </div>
                        <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={applyNurseCopayFreeFirst3}
                            onChange={(e) => setApplyNurseCopayFreeFirst3(e.target.checked)}
                        />
                        <span className="text-sm">
                            방문간호 최초 3회 본인부담 면제 적용
                        </span>
                        </label>
                    </div>
                )}
            </div>

            {/* 1단계 */}
            {mode === "재가(방문/주야간)" && (
            <div className="rounded-2xl border bg-white p-4 space-y-3">
                <div className="font-semibold">빠른 계산 (월 급여 금액을 알고 있을 때)</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <label className="space-y-1">
                            <div className="text-sm text-gray-700">월 총 이용금액(급여) 직접 입력</div>
                            <input
                                type="number"
                                className="border rounded p-2 w-full"
                                value={manualMonthlyCovered}
                                onChange={(e) => setManualMonthlyCovered(Number(e.target.value || 0))}
                                placeholder="예: 1200000"
                            />
                            <div className="text-xs text-gray-500">입력 시 아래 상세 계산값보다 우선 처리됩니다</div>
                        </label>
                </div>

                {/* 결과 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="rounded-xl border p-3">
                        <div className="text-xs text-gray-500">월 급여 합계</div>
                        <div className="text-lg font-bold">{KRW(stage1Base.monthlyCovered || 0)}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                        <div className="text-xs text-gray-500">{mode === "재가(방문/주야간)" ? "한도 내 적용금액" : "급여(보험적용) 금액"}</div>
                        <div className="text-lg font-bold">{KRW(stage1Base.coveredWithinLimit || 0)}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                        <div className="text-xs text-gray-500">{mode === "재가(방문/주야간)" ? "한도 초과(전액 본인)" : "본인부담(급여×비율)"}</div>
                        <div className="text-lg font-bold">{KRW(stage1Base.over || stage1Base.copay || 0)}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                        <div className="text-xs text-gray-500">예상 월 총 비용</div>
                        <div className="text-lg font-bold">{KRW(stage1Base.adjustedTotal || 0)}</div>
                        {mode === "재가(방문/주야간)" && homeCopayAdjustment > 0 && (
                            <div className="text-xs text-gray-500 mt-1">(방문간호 본인부담 면제 차감: -{KRW(homeCopayAdjustment)})</div>
                        )}
                    </div>
                </div>
            </div>
            )}

            {/* 2~3단계: 재가 상세 계산 */}
            {mode === "재가(방문/주야간)" && (
                <div className="rounded-2xl border bg-white p-4 space-y-5">
                    <div className="font-semibold">재가(방문) 상세 입력</div>

                    {/* 방문요양 */}
                    <div className="rounded-xl border p-4 space-y-3">
                        <div className="font-medium">방문요양</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="space-y-1">
                                <div className="text-sm text-gray-700">1회 이용시간</div>
                                <select className="border rounded p-2 w-full" value={visitCareMinutes} onChange={(e) => setVisitCareMinutes(Number(e.target.value))}>
                                    {VISIT_CARE_2026.map((x) => (
                                        <option key={x.minutes} value={x.minutes}>
                                            {x.minutes}분 · 수가 {KRW(x.fee)}
                                        </option>
                                    ))}
                                </select>
                                {isSevere && visitCareMinutes >= 60 && applyCareAddOn && (
                                    <div className="text-xs text-gray-500">중증가산(단순 적용): 1회 +{KRW(careAddOnPerVisit)}</div>
                                )}
                            </label>

                            <label className="space-y-1">
                                <div className="text-sm text-gray-700">월 이용횟수</div>
                                <input type="number" className="border rounded p-2 w-full" value={visitCarePerMonth} onChange={(e) => setVisitCarePerMonth(e.target.value)} />
                            </label>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-700">월 급여(방문요양)</div>
                                <div className="border rounded p-2 bg-gray-50">{KRW((careUnitFee + careAddOnPerVisit) * Number(visitCarePerMonth))}</div>
                            </div>
                        </div>
                    </div>

                    {/* 방문목욕/방문간호 */}
                        <div className="rounded-xl border p-4 space-y-3">
                            <div className="font-medium">방문목욕</div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <label className="space-y-1">
                                    <div className="text-sm text-gray-700">유형</div>
                                    <select className="border rounded p-2 w-full" value={bathType} onChange={(e) => setBathType(e.target.value as any)}>
                                        {VISIT_BATH_2026.map((x) => (
                                            <option key={x.type} value={x.type}>
                                                {x.type} · 수가 {KRW(x.fee)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                    <label className="space-y-1">
                                        <div className="text-sm text-gray-700">1회 이용시간(분)</div>
                                        <input type="number" className="border rounded p-2 w-full" value={bathCareMinutes} onChange={(e) => setBathCareMinutes(e.target.value)} />
                                        {Number(bathCareMinutes) > 0 && Number(bathCareMinutes) <= 40 && (
                                            <div className="text-xs text-gray-500">
                                                40분 이하 이용: 80% 적용
                                            </div>
                                        )}
                                        {isSevere && Number(bathCareMinutes) >= 60 && applyCareAddOn && (
                                            <div className="text-xs text-gray-500">중증가산(단순 적용): 1회 +6000원</div>
                                        )}
                                    </label>

                                    <label className="space-y-1">
                                        <div className="text-sm text-gray-700">월 이용횟수</div>
                                        <input type="number" className="border rounded p-2 w-full" value={bathCarePerMonth} onChange={(e) => setBathCarePerMonth(e.target.value)} />
                                    </label>

                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-700">월 급여(방문목욕)</div>
                                        <div className="border rounded p-2 bg-gray-50">{KRW((careAddOnPerBath) * Number(bathCarePerMonth))}</div>
                                    </div>
                            </div>
                        </div>

                    <div className="rounded-xl border p-4 space-y-3">
                        <div className="font-medium">방문간호</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="space-y-1">
                                <div className="text-sm text-gray-700">시간 구간</div>
                                <select className="border rounded p-2 w-full" value={nurseBand} onChange={(e) => setNurseBand(e.target.value)}>
                                    {VISIT_NURSE_2026.map((x) => (
                                        <option key={x.label} value={x.label}>
                                            {x.label} · 수가 {KRW(x.fee)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-1">
                                <div className="text-sm text-gray-700">월 이용횟수</div>
                                <input type="number" className="border rounded p-2 w-full" value={nurseCarePerMonth} onChange={(e) => setNurseCarePerMonth(e.target.value)} />
                            </label>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-700">월 급여(방문간호)</div>
                                <div className="border rounded p-2 bg-gray-50">{KRW(nurseUnitFee * Number(nurseCarePerMonth))}</div>
                                {isSevere && applyNurseCopayFreeFirst3 && Number(nurseCarePerMonth) > 0 && (
                                    <div className="text-xs text-gray-500">방문간호 최초 3회 본인부담 면제<div></div>(본인부담에서 차감 적용)</div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* 주야간보호 */}
                    <div className="rounded-xl border p-4 space-y-3">
                        <div className="font-medium">주야간보호</div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="space-y-1">
                                <div className="text-sm text-gray-700">이용 시간대</div>
                                <select className="border rounded p-2 w-full" value={daycareBand} onChange={(e) => setDaycareBand(e.target.value as DayCareBand)}>
                                    {Object.keys(DAYCARE_2026).map((b) => (
                                        <option key={b} value={b}>
                                            {b} · 1일 {KRW(DAYCARE_2026[b as DayCareBand][gradeHome])}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-1">
                                <div className="text-sm text-gray-700">월 이용일수</div>
                                <input type="number" className="border rounded p-2 w-full" value={daycareDaysPerMonth} onChange={(e) => setDaycareDaysPerMonth(e.target.value)} />
                            </label>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-700">월 급여(주야간보호)</div>
                                <div className="border rounded p-2 bg-gray-50">{KRW(daycareMonthlyFee)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mode === "시설(요양원)" && (
                <div className="rounded-2xl border bg-white p-4 space-y-5">
                    <div className="font-semibold">시설(요양원) 급여 자동 산정</div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="rounded-xl border p-3">
                            <div className="text-xs text-gray-500">요양등급</div>
                            <div className="text-lg font-bold">{gradeFacility}</div>
                        </div>

                        <div className="rounded-xl border p-3">
                            <div className="text-xs text-gray-500">1일 수가</div>
                            <div className="text-lg font-bold">
                                {KRW(facilityDailyFee)}
                            </div>
                        </div>

                        <div className="rounded-xl border p-3">
                            <div className="text-xs text-gray-500">이용 일수</div>
                            <div className="text-lg font-bold">
                                {facilityDays}일
                            </div>
                        </div>

                        <div className="rounded-xl border p-3">
                            <div className="text-xs text-gray-500">월 급여(자동)</div>
                            <div className="text-lg font-bold">
                                {KRW(facilityMonthlyCoveredAutoCalc)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-xl border p-3 bg-gray-50">
                            <div className="text-xs text-gray-600">본인부담률</div>
                            <div className="text-lg font-bold">
                                {(copayRateFacility * 100).toFixed(0)}%
                            </div>
                        </div>

                        <div className="rounded-xl border p-3 bg-gray-50">
                            <div className="text-xs text-gray-600">급여 본인부담금</div>
                            <div className="text-lg font-bold">
                                {KRW(facilityCopayAuto)}
                            </div>
                        </div>

                        <div className="rounded-xl border p-3 bg-blue-50">
                            <div className="text-xs text-blue-700">급여 + 비급여 합산</div>
                            <div className="text-xl font-bold">
                                {KRW(facilityCopayAuto + nonBenefitTotal)}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* 요양원 검색 */}
                    {(
                        <div className="rounded-2xl border bg-white p-4 space-y-3 relative overflow-visible">
                        <div className="font-semibold">요양원 선택 (비급여 자동 불러오기)</div>
                            <div className="text-sm text-gray-700">비급여 정보가 없는 요양원은 검색되지 않습니다. 해당 요양원에 문의하세요.</div>
                            <div className="flex gap-2">
                                <input
                                    className="border rounded p-2 flex-1"
                                    placeholder="요양원 이름 검색"
                                    value={facilityQuery}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (suggestions.length === 0) return;

                                        if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            setHighlightIndex((prev) =>
                                                prev < suggestions.length - 1 ? prev + 1 : 0
                                            );
                                        }

                                        if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            setHighlightIndex((prev) =>
                                                prev > 0 ? prev - 1 : suggestions.length - 1
                                            );
                                        }

                                        if (e.key === "Enter") {
                                            e.preventDefault();

                                            const target =
                                                highlightIndex >= 0
                                                    ? suggestions[highlightIndex]
                                                    : suggestions[0];

                                            handleSelectFacility(target);
                                        }
                                    }}
                                />

                                {/* 선택 안 하고 엔터/버튼 눌렀을 때용 fallback */}
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-lime-600 text-white rounded"
                                    onClick={() => {
                                        if (suggestions.length === 0) {
                                            alert("요양원을 선택해주세요");
                                            return;
                                        }

                                        // 첫 번째 결과 자동 선택
                                        const facility = suggestions[0];
                                        handleSelectFacility(facility);
                                    }}
                                >
                                    검색
                                </button>
                            </div>

                            {/* 🔽 자동완성 리스트 */}
                            {suggestions.length > 0 && (
                                <div className="absolute z-20 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
                                    {suggestions.map((f, idx) => (
                                        <div
                                            key={f.instCode}
                                            className={`p-3 cursor-pointer ${
                                                idx === highlightIndex
                                                    ? "bg-blue-100"
                                                    : "hover:bg-blue-50"
                                            }`}
                                            onMouseEnter={() => setHighlightIndex(idx)}
                                            onClick={() => handleSelectFacility(f)}
                                        >
                                            <div className="font-medium">{f.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {f.fullRoadAddr}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}

                            {selectedFacility && (
                                <div className="rounded-xl border bg-blue-50 p-4 mt-2">
                                    <div className="text-sm text-blue-700 font-medium">
                                        선택된 요양원
                                    </div>
                                    <div className="text-lg font-bold mt-1">
                                        {selectedFacility.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        비급여 항목은 해당 요양원 기준으로 자동 입력되었습니다.
                                    </div>
                                </div>
                            )}
                        </div>

                    )}

                    {/* 재가 비급여 */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                <label className="space-y-1">
                                    {/* 4단계: 시설(요양원) 비급여 – 항목별 입력 */}
                                        <div className="rounded-2xl border bg-white p-6 space-y-6">
                                            <div className="font-semibold text-lg">
                                                요양원 비급여 (항목별 입력)
                                            </div>
                                            {/* 좌/우 2컬럼 */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* 왼쪽: 금액 */}
                                                <div className="space-y-3">
                                                    <div className="text-sm font-medium text-gray-700">
                                                        비급여 금액 (월)
                                                    </div>

                                                    {(Object.keys(NON_BENEFIT_LABEL) as NonBenefitCode[]).map((code) => (
                                                        <label key={code} className="block">
                                                            <div className="text-sm mb-1">
                                                                {NON_BENEFIT_LABEL[code]} (1일 기준)
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="border rounded p-2 w-full"
                                                                value={nonBenefits[code]}
                                                                onChange={(e) =>
                                                                    setNonBenefits((prev) => ({
                                                                        ...prev,
                                                                        [code]: Number(e.target.value || 0),
                                                                    }))
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                </div>

                                                {/* 오른쪽: prodBase 설명 */}
                                                <div className="space-y-3">
                                                    <div className="text-sm font-medium text-gray-700">
                                                        산정 기준 / 설명
                                                    </div>

                                                    {(Object.keys(NON_BENEFIT_LABEL) as NonBenefitCode[]).map((code) => (
                                                        <label key={code} className="block">
                                                            <div className="text-sm mb-1">
                                                                {NON_BENEFIT_LABEL[code]}
                                                            </div>
                                                            <div className="border rounded p-2 bg-gray-50 min-h-[42px]">
                                                                {nonBenefitBases[code] || (
                                                                    <span className="text-gray-400">-</span>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 비급여 합계 */}
                                            <div className="rounded-xl border p-4 bg-gray-50">
                                                <div className="text-sm text-gray-600">비급여 합계 (1일 x {NON_BENEFIT_DAYS}일)</div>
                                                <div className="text-xl font-bold">{KRW(nonBenefitTotal)}</div>
                                            </div>

                                            {/* 월 총 비용 */}
                                            <div className="rounded-xl border p-4 bg-blue-50">
                                                <div className="text-sm text-blue-700">
                                                    월 총 비용 (급여 본인부담 + 비급여)
                                                </div>
                                                <div className="text-2xl font-bold">
                                                    {KRW(stage1Base.adjustedTotal || 0)}
                                                </div>
                                            </div>
                                        </div>
                                        </label>
                        </div>

                    <div className="text-xs text-gray-500">
                        ※ 위 “재가 상세 입력”으로 계산된 월 급여 합계는 1단계 결과(한도/본인부담/초과)에 자동 반영됩니다.
                        (단, 1단계에 월 급여를 직접 입력하면 그 값이 우선 적용)
                    </div>


            {/* 하단 안내 */}
            <div className="text-xs text-gray-500">
                <div className="font-medium mb-1">계산 로직(요약)</div>
                <ul className="list-disc pl-5 space-y-1">
                    <li>재가: 월 급여 합계에서 “등급별 월 한도액”을 초과하면 초과분은 전액 본인 부담</li>
                    <li>재가: 한도 내 적용금액 × 본인부담률(15/9/6/0%)</li>
                    <li>중증(단순 적용): 방문요양 180분↑ 가산(시간당 2,000원, 1일 최대 6,000원) / 방문간호 최초 3회 본인부담 면제</li>
                    <li>시설: (월 급여비용 × 본인부담률) + 비급여(입력값 + 항목합)</li>
                </ul>
            </div>
        </div>
    )
        };
