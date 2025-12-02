// src/pages/FacilityDetail.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    fetchFacilityDetailByInst,
    type FacilityDetailDTO,
} from "../api/ltc";

const CARD = "rounded-2xl border bg-white p-6";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function FacilityDetail() {
    const { instCode: pInstCode, kindCode: pKindCode } = useParams();
    const q = useQuery();

    const instCode = pInstCode ?? q.get("instCode") ?? "";
    const kindCode = pKindCode ?? q.get("kindCode") ?? "A03";

    const [data, setData] = useState<FacilityDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const d = await fetchFacilityDetailByInst(instCode, kindCode);
                if (alive) setData(d);
            } catch (e) {
                console.error(e);
                if (alive) setErr("불러오기에 실패했습니다.");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [instCode, kindCode]);

    const sum = data?.summary;
    const canMap = sum?.lat && sum?.lng;

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <section className={CARD}>
                {loading ? (
                    <div>Loading...</div>
                ) : err ? (
                    <div className="text-red-600">{err}</div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold">{sum?.name}</h2>
                        <div className="text-sm text-gray-600">
                            {sum?.address ?? "-"}
                        </div>
                        {sum?.phone && (
                            <a
                                href={`tel:${sum.phone}`}
                                className="text-blue-600 underline"
                            >
                                {sum.phone}
                            </a>
                        )}
                    </div>
                )}
            </section>

            {/* 지도 */}
            <section className={`${CARD} h-80`}>
                {canMap ? (
                    <MiniMap lat={sum!.lat!} lng={sum!.lng!} name={sum!.name} />
                ) : (
                    <div className="text-sm text-gray-500">좌표 정보 없음</div>
                )}
            </section>

            {/* 정원 */}
            <section className={CARD}>
                <h3 className="mb-2 text-lg font-semibold">정원/입소</h3>
                <div className="grid grid-cols-3 gap-3">
                    <KPI label="정원" value={data?.capacityTotal} unit="명" />
                    <KPI label="남성" value={data?.residentMale} unit="명" />
                    <KPI label="여성" value={data?.residentFemale} unit="명" />
                </div>
            </section>

            {/* 인력 */}
            <section className={CARD}>
                <h3 className="mb-2 text-lg font-semibold">인력 현황</h3>
                <div className="grid grid-cols-3 gap-3">
                    <KPI label="의사" value={data?.doctor} unit="명" />
                    <KPI label="간호사" value={data?.nurse} unit="명" />
                    <KPI label="요양보호사" value={data?.caregiver} unit="명" />
                    <KPI
                        label="사회복지사"
                        value={data?.socialWorker}
                        unit="명"
                    />
                    <KPI
                        label="간호조무사"
                        value={data?.nurseAide}
                        unit="명"
                    />
                </div>
            </section>

            {/* 병실 */}
            <section className={CARD}>
                <h3 className="mb-2 text-lg font-semibold">병실/시설</h3>
                <div className="grid grid-cols-3 gap-3">
                    <KPI label="1인실" value={data?.singleRm} unit="실" />
                    <KPI label="2인실" value={data?.doubleRm} unit="실" />
                    <KPI label="3인실" value={data?.tripleRm} unit="실" />
                    <KPI label="4인실" value={data?.quadrupleRm} unit="실" />
                    <KPI label="특수침실" value={data?.specialRm} unit="실" />
                </div>
            </section>

            {/* 기타 */}
            <section className={CARD}>
                <h3 className="mb-2 text-lg font-semibold">기타 정보</h3>
                <div className="text-sm">
                    <div>홈페이지: {data?.homepage ?? "-"}</div>
                    <div>교통편: {data?.transport ?? "-"}</div>
                    <div>주차시설: {data?.parking ?? "-"}</div>
                </div>
            </section>
        </div>
    );
}

function KPI({
                 label,
                 value,
                 unit,
             }: {
    label: string;
    value?: number;
    unit?: string;
}) {
    return (
        <div className="rounded border p-3 text-center">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-lg font-semibold">
                {value != null ? `${value}${unit ?? ""}` : "-"}
            </div>
        </div>
    );
}

function MiniMap({
                     lat,
                     lng,
                 }: {
    lat: number;
    lng: number;
    name: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const w = window as any;

        if (!ref.current) return;

        const wait = () => {
            if (!w.kakao || !w.kakao.maps || !w.kakao.maps.Map) {
                setTimeout(wait, 50);
                return;
            }
            load();
        };

        const load = () => {
            const kakao = w.kakao;

            kakao.maps.load(() => {
                const center = new kakao.maps.LatLng(lat, lng);

                const map = new kakao.maps.Map(ref.current!, {
                    center,
                    level: 3,
                });

                const marker = new kakao.maps.Marker({
                    position: center,
                });
                marker.setMap(map);

                const circle = new kakao.maps.Circle({
                    center,
                    radius: 500,
                    strokeWeight: 2,
                    strokeColor: "#0066FF",
                    strokeOpacity: 0.9,
                    strokeStyle: "solid",
                    fillColor: "#99CCFF",
                    fillOpacity: 0.4,
                });

                circle.setMap(map);
            });
        };

        wait();
    }, [lat, lng]);

    return <div ref={ref} className="w-full h-full rounded border" />;
}
