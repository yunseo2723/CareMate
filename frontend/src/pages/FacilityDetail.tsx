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

// URL 쿼리 파싱용
function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function FacilityDetail() {
    const { instCode: instCodeParam } = useParams();
    const q = useQuery();

    const instCode = instCodeParam ?? "";
    const kindCode = q.get("kindCode") ?? "";

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

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <section className={CARD}>
                {loading ? (
                    <div>Loading...</div>
                ) : err ? (
                    <div className="text-red-600">{err}</div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold">{data?.name}</h2>
                        <div className="text-sm text-gray-600">
                            {data?.fullRoadAddr ?? "-"}
                        </div>

                        {data?.phone && (
                            <a
                                href={`tel:${data.phone}`}
                                className="text-blue-600 underline"
                            >
                                {data.phone}
                            </a>
                        )}
                    </div>
                )}
            </section>

            {/* 지도 */}
            <section className={`${CARD} h-80`}>
                <MiniMap
                    lat={data?.lat ? Number(data.lat) : undefined}
                    lng={data?.lng ? Number(data.lng) : undefined}
                />
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
                    <KPI label="사회복지사" value={data?.socialWorker} unit="명" />
                    <KPI label="간호조무사" value={data?.nurseAide} unit="명" />
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
    value?: number | null;
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
