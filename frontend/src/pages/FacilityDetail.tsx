/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { fetchFacilityDetailByInst, type FacilityDetailDTO } from "../api/ltc";
import { useLocation, useParams } from "react-router-dom";
import FavoriteStar from "../components/FacilityDetailHeader.tsx";
import { useRequireLogin } from "../hooks/useRequireLogin";
import { useNavigate } from "react-router-dom";

export default function FacilityDetail() {
    const { instCode: instCodeParam } = useParams();
    const q = new URLSearchParams(useLocation().search);

    const instCode = instCodeParam ?? "";
    const kindCode = q.get("kindCode") ?? "";

    const [data, setData] = useState<FacilityDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const d = await fetchFacilityDetailByInst(instCode, kindCode);
            setData(d);
            setLoading(false);
        })();
    }, [instCode, kindCode]);

    if (loading || !data) {
        return <div className="p-10 text-center text-slate-500">불러오는 중…</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8">
            <TopSection data={data} instCode={instCode} kindCode={kindCode} />
            <ScoreSection data={data} />
            <CapacitySection data={data} />
            <StaffSection data={data} />
            <RoomSection data={data} />
            <ProgramSection data={data} />
            <ExtraInfoSection data={data} />
        </div>
    );
}

/* ===================== 상단 ===================== */

function TopSection({ data, instCode, kindCode }: any) {
    const requireLogin = useRequireLogin();
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽 정보 */}
            <div className="space-y-4">
                <h1 className="flex items-center gap-3 text-3xl font-bold">
                    {data.name}
                    <FavoriteStar instCode={instCode} kindCode={kindCode} />
                </h1>

                <p className="text-slate-600">{data.fullRoadAddr}</p>

                <div className="flex flex-wrap gap-3 items-center">
                    {data.grade && (
                        <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-medium">
              평가등급 {data.grade}
            </span>
                    )}

                    {data.phone && (
                        <a
                            href={`tel:${data.phone}`}
                            className="text-black underline"
                        >
                            문의 : {data.phone}
                        </a>
                    )}
                </div>

                <button
                    onClick={() =>
                        requireLogin(() => {
                            navigate(
                                `/facility/${instCode}/${kindCode}/community`
                            );
                        })
                    }
                    className="inline-block w-fit rounded-md bg-lime-600 px-4 py-2
                 text-white text-sm font-medium hover:bg-lime-500 transition"
                >
                    커뮤니티로 이동
                </button>
            </div>

            {/* 지도 */}
            <MiniMap
                lat={data.lat ? Number(data.lat) : undefined}
                lng={data.lng ? Number(data.lng) : undefined}
            />
        </div>
    );
}

/* ===================== 지도 ===================== */

function MiniMap({ lat, lng }: { lat?: number; lng?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const w = window as any;
        if (!ref.current || !lat || !lng) return;

        const waitForKakao = () => {
            if (w.kakao?.maps?.load) {
                w.kakao.maps.load(initMap);
            } else {
                setTimeout(waitForKakao, 80);
            }
        };

        const initMap = () => {
            const kakao = w.kakao;
            const pos = new kakao.maps.LatLng(lat, lng);
            const map = new kakao.maps.Map(ref.current!, {
                center: pos,
                level: 3,
            });
            new kakao.maps.Marker({ position: pos, map });
        };

        waitForKakao();
    }, [lat, lng]);

    return (
        <div
            ref={ref}
            className="w-full h-64 md:h-full rounded-xl border bg-slate-50"
        >
            {!lat || !lng && (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    지도 좌표 정보가 없습니다.
                </div>
            )}
        </div>
    );
}

/* ===================== 평가 ===================== */

function ScoreSection({ data }: { data: FacilityDetailDTO }) {
    const items = [
        { label: "총점", value: data.totalScore, highlight: true },
        { label: "운영", value: data.opScore },
        { label: "안전", value: data.safetyScore },
        { label: "권리보장", value: data.rightsScore },
        { label: "제공과정", value: data.processScore },
        { label: "제공결과", value: data.resultScore },
    ];

    return (
        <Section title="평가 점수">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {items.map((i) => (
                    <Card
                        key={i.label}
                        label={i.label}
                        value={i.value}
                        unit="점"
                        highlight={i.highlight}
                    />
                ))}
            </div>
        </Section>
    );
}

/* ===================== 정원 ===================== */

function CapacitySection({ data }: { data: FacilityDetailDTO }) {
    return (
        <Section title="정원 / 입소">
            <div className="grid grid-cols-3 gap-3">
                <Card label="정원" value={data.capacityTotal} unit="명" />
                <Card label="남성" value={data.residentMale} unit="명" />
                <Card label="여성" value={data.residentFemale} unit="명" />
            </div>
        </Section>
    );
}

/* ===================== 인력 ===================== */

function StaffSection({ data }: { data: FacilityDetailDTO }) {
    const items = [
        { label: "의사", value: data.doctor },
        { label: "간호사", value: data.nurse },
        { label: "간호조무사", value: data.nurseAide },
        { label: "요양보호사", value: data.caregiver },
        { label: "사회복지사", value: data.socialWorker },
        { label: "영양사", value: data.nutritionist },
        { label: "물리치료사", value: data.physicalTher },
        { label: "작업치료사", value: data.occupTher },
        { label: "조리원", value: data.cook },
        { label: "사무원", value: data.manager },
        { label: "보조원", value: data.assistant },
    ];

    return (
        <Section title="인력 현황">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {items.map((i) => (
                    <Card key={i.label} label={i.label} value={i.value} unit="명" />
                ))}
            </div>
        </Section>
    );
}

/* ===================== 병실 ===================== */

function RoomSection({ data }: { data: FacilityDetailDTO }) {
    const items = [
        { label: "1인실", value: data.singleRm },
        { label: "2인실", value: data.doubleRm },
        { label: "3인실", value: data.tripleRm },
        { label: "4인실", value: data.quadrupleRm },
        { label: "특수침실", value: data.specialRm },
        { label: "프로그램실", value: data.programRoom },
        { label: "식당/주방", value: data.diningKitchen },
        { label: "화장실", value: data.toilet },
        { label: "목욕실", value: data.bath },
        { label: "세탁실", value: data.laundry },
    ];

    return (
        <Section title="병실 / 시설">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {items.map((i) => (
                    <Card key={i.label} label={i.label} value={i.value} unit="실" />
                ))}
            </div>
        </Section>
    );
}

/* ===================== 프로그램 ===================== */

function ProgramSection({ data }: { data: FacilityDetailDTO }) {
    if (!data.programs || data.programs.length === 0) return null;

    return (
        <Section title="프로그램 목록">
            <div className="space-y-3">
                {data.programs.map((p, idx) => (
                    <div key={idx} className="rounded-lg border bg-slate-50 p-4">
                        <div className="font-medium">{p.pgmNm}</div>
                        <div className="text-xs text-slate-600 mt-1">
                            유형 {p.pgmType} · 대상 {p.tgtNop}명 · {p.runPlc}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

/* ===================== 기타 ===================== */

function ExtraInfoSection({ data }: { data: FacilityDetailDTO }) {
    return (
        <Section title="기타 정보">
            <div className="text-sm space-y-1">
                <div>홈페이지: {data.homepage ?? "-"}</div>
                <div>교통편: {data.transport ?? "-"}</div>
                <div>주차시설: {data.parking ?? "-"}</div>
            </div>
        </Section>
    );
}

/* ===================== 공통 ===================== */

function Card({
                  label,
                  value,
                  unit,
                  highlight,
              }: {
    label: string;
    value?: any;
    unit?: string;
    highlight?: boolean;
}) {
    const isZero = value === 0;

    return (
        <div
            className={`rounded-lg p-4 text-center
        ${
                highlight
                    ? "bg-lime-600 text-black font-bold"
                    : isZero
                        ? "bg-slate-50 text-slate-400"
                        : "border bg-white"
            }`}
        >
            <div className="text-xs">{label}</div>
            <div className="text-xl font-bold">
                {value != null ? `${value}${unit ?? ""}` : "-"}
            </div>
        </div>
    );
}

function Section({ title, children }: any) {
    return (
        <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">{title}</h2>
            {children}
        </section>
    );
}
