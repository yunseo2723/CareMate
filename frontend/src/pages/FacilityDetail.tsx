/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { fetchFacilityDetailByInst, type FacilityDetailDTO } from "../api/ltc";
import {Link, useLocation, useParams} from "react-router-dom";

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

    if (loading || !data) return <div className="p-10">불러오는 중...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* 상단 기본 정보 + 지도 */}
            <TopSection data={data} instCode={instCode} />

            {/* 평가 점수 */}
            <ScoreSection data={data} />

            {/* 정원 */}
            <CapacitySection data={data} />

            {/* 인력 */}
            <StaffSection data={data} />

            {/* 병실 / 시설 */}
            <RoomSection data={data} />

            {/* 프로그램 */}
            <ProgramSection data={data} />

            {/* 기타 정보 */}
            <ExtraInfoSection data={data} />
        </div>
    );
}

function TopSection({ data, instCode }: { data: FacilityDetailDTO, instCode: string }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽: 기본 정보 */}
            <div className="space-y-3">
                <h1 className="text-3xl font-bold">{data.name}</h1>

                <p className="text-gray-600">{data.fullRoadAddr}</p>

                {/* 전화번호 */}
                {data.phone && (
                    <div className="text-sm">
                        문의 :{" "}
                        <a href={`tel:${data.phone}`} className="text-blue-600 underline">
                            {data.phone}
                        </a>
                    </div>
                )}

                {/* 평가 등급 */}
                {data.grade && (
                    <div className="inline-block rounded bg-yellow-200 px-3 py-1 font-semibold text-sm">
                        평가등급 {data.grade} 등급
                    </div>
                )}

                {/* 🔥 커뮤니티로 이동 버튼 (예쁘게 배치) */}
                <Link
                    to={`/facility/${instCode}/community`}
                    className="inline-block mt-2 px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                    커뮤니티로 이동
                </Link>
            </div>

            {/* 오른쪽: 지도 */}
            <MiniMap
                lat={data.lat ? Number(data.lat) : undefined}
                lng={data.lng ? Number(data.lng) : undefined}
            />
        </div>
    );
}



function MiniMap({
                     lat,
                     lng
                 }: {
    lat?: number;
    lng?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const w = window as any;

        if (!ref.current) return;

        // ⬇⬇⬇ Kakao SDK 로드를 100% 보장하는 함수
        const waitForKakao = () => {
            if (w.kakao?.maps?.load) {
                w.kakao.maps.load(() => initMap()); // SDK가 완전히 준비된 후 실행
            } else {
                setTimeout(waitForKakao, 80);
            }
        };

        const initMap = () => {
            const kakao = w.kakao;

            try {
                const pos = new kakao.maps.LatLng(lat, lng);

                const map = new kakao.maps.Map(ref.current!, {
                    center: pos,
                    level: 3,
                });

                new kakao.maps.Marker({
                    position: pos,
                    map,
                });

            } catch (e) {
                console.error("❌ 지도 초기화 오류:", e);
            }
        };

        waitForKakao();
    }, [lat, lng]);

    return (
        <div
            ref={ref}
            className="w-full h-full rounded border flex items-center justify-center"
        >
            {!lat || !lng ? (
                <span className="text-gray-500 text-sm">지도 좌표 정보가 없습니다.</span>
            ) : null}
        </div>
    );
}
function ScoreSection({ data }: { data: FacilityDetailDTO }) {
    const items = [
        { label: "총점", value: data.totalScore },
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
                    <Card key={i.label} label={i.label} value={i.value} unit="점" />
                ))}
            </div>
        </Section>
    );
}

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
function ProgramSection({ data }: { data: FacilityDetailDTO }) {
    if (!data.programs || data.programs.length === 0) return null;

    return (
        <Section title="프로그램 목록">
            <div className="space-y-3">
                {data.programs.map((p, idx) => (
                    <div key={idx} className="p-3 border rounded-md bg-gray-50">
                        <div className="font-medium">{p.pgmNm}</div>
                        <div className="text-xs text-gray-600">
                            유형 {p.pgmType} · 대상 {p.tgtNop}명 · {p.runPlc}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
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
function Card({ label, value, unit }: { label: string; value?: any; unit?: string }) {
    return (
        <div className="border rounded-lg p-3 text-center bg-white shadow-sm">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-lg font-semibold">
                {value != null ? `${value}${unit ?? ""}` : "-"}
            </div>
        </div>
    );
}

function Section({ title, children }: any) {
    return (
        <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            {children}
        </div>
    );
}
