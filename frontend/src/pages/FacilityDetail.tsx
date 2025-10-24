import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchFacilityDetail,
    type FacilityDetailDTO,
    type NonpayItem,
    type ContractItem,
} from "../api/ltc";

function Tag({ children }: { children: React.ReactNode }) {
    return <span className="rounded bg-slate-100 px-2 py-1">{children}</span>;
}

const CARD = "rounded-2xl border bg-white p-6";

function formatWon(n?: number) {
    if (n == null || Number.isNaN(n)) return "-";
    return n.toLocaleString("ko-KR") + "원";
}

export default function FacilityDetail() {
    const { id = "" } = useParams();
    const [data, setData] = useState<FacilityDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchFacilityDetail(id)
            .then((d: FacilityDetailDTO) => {
                if (alive) setData(d);
            })
            .catch((e: unknown) => {
                if (alive) setErr(e instanceof Error ? e.message : "불러오기에 실패했습니다.");
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [id]);

    const sum = data?.summary;
    const rooms = data?.rooms;
    const nonpay = (data?.nonpayItems ?? []) as NonpayItem[];
    const contracts = (data?.contracts ?? []) as ContractItem[];

    // ✅ any 제거: summary 타입에 lng 포함시켰으므로 그대로 검사
    const canMap = useMemo(
        () => Number.isFinite(sum?.lat) && Number.isFinite(sum?.lng),
        [sum?.lat, sum?.lng]
    );

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <section className={`${CARD} space-y-3`}>
                {loading ? (
                    <div className="h-6 w-40 animate-pulse bg-slate-200 rounded" />
                ) : err ? (
                    <div className="text-red-600">{err}</div>
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold">{sum?.name ?? id}</h2>
                                <div className="mt-1 text-sm text-slate-600">
                                    {sum?.address ?? [sum?.sido, sum?.sgg].filter(Boolean).join(" ")}
                                </div>
                                {sum?.phone && (
                                    <div className="text-sm">
                                        <a href={`tel:${sum.phone}`} className="text-blue-600 underline">
                                            {sum.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                            {typeof sum?.rating === "number" && (
                                <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-white text-sm">
                                    평점 {sum.rating.toFixed(1)}
                                </div>
                            )}
                        </div>

                        {/* 태그들 */}
                        <div className="flex flex-wrap gap-2 text-xs">
                            {sum?.type && <span className="rounded bg-slate-100 px-2 py-1">{sum.type}</span>}
                            {sum?.sido && <span className="rounded bg-slate-100 px-2 py-1">{sum.sido}</span>}
                            {sum?.sgg && <span className="rounded bg-slate-100 px-2 py-1">{sum.sgg}</span>}
                        </div>
                    </>
                )}
            </section>

            {/* 요약 KPI + 지도 미니뷰 */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className={`${CARD} md:col-span-2`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KPI label="정원" value={sum?.capacityTotal} unit="명" />
                        <KPI label="입소 남성" value={sum?.residentMale} unit="명" />
                        <KPI label="입소 여성" value={sum?.residentFemale} unit="명" />
                        <KPI label="월예상비용" value={sum?.monthlyCost} format="won" />
                    </div>
                </div>

                <div className={CARD}>
                    <div className="mb-2 text-sm font-medium">위치</div>
                    {canMap && sum?.lat != null && sum?.lng != null ? (
                        <MiniMap lat={sum.lat} lng={sum.lng} name={sum.name ?? ""} />
                    ) : (
                        <div className="text-sm text-slate-500">좌표 정보가 없습니다.</div>
                    )}
                    {sum?.address && (
                        <a
                            className="mt-3 inline-block text-sm text-blue-600 underline"
                            href={`https://map.kakao.com/link/search/${encodeURIComponent(sum.address)}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            카카오맵에서 열기
                        </a>
                    )}
                </div>
            </section>

            {/* ✅ 인원/정원 섹션 */}
            <section className={CARD}>
                <h3 className="text-lg font-semibold mb-3">인원 현황</h3>
                {data?.staff ? (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        <KPI label="정원" value={data.staff.capacityTotal} unit="명" />
                        <KPI label="현재(남)" value={data.staff.residentMale} unit="명" />
                        <KPI label="현재(여)" value={data.staff.residentFemale} unit="명" />
                        <KPI label="간호사" value={data.staff.nurseCount} unit="명" />
                        <KPI label="의사" value={data.staff.doctorCount} unit="명" />
                        <KPI label="기타" value={data.staff.otherStaffCount} unit="명" />
                    </div>
                ) : (
                    <div className="text-sm text-slate-500">인원 정보가 없습니다.</div>
                )}
            </section>

            {/* ✅ 편의시설/부가정보 */}
            <section className={CARD}>
                <h3 className="text-lg font-semibold mb-3">편의시설</h3>
                {data?.amenities ? (
                    <div className="flex flex-wrap gap-2 text-sm">
                        {data.amenities.hasElevator && <Tag>엘리베이터</Tag>}
                        {data.amenities.hasCCTV && <Tag>CCTV</Tag>}
                        {data.amenities.hasLaundry && <Tag>세탁실</Tag>}
                        {data.amenities.hasMealService && <Tag>식사 제공</Tag>}
                        {data.amenities.hasRehabProgram && <Tag>재활/인지 프로그램</Tag>}
                        {data.amenities.has24hDesk && <Tag>24시간 안내</Tag>}
                        {typeof data.amenities.parking !== "undefined" && (
                            <Tag>
                                주차: {data.amenities.parking === "free" ? "무료" : data.amenities.parking === "limited" ? "제한적" : "없음"}
                            </Tag>
                        )}
                        {!data.amenities.hasElevator && !data.amenities.hasCCTV && !data.amenities.hasLaundry &&
                            !data.amenities.hasMealService && !data.amenities.hasRehabProgram && !data.amenities.has24hDesk &&
                            typeof data.amenities.parking === "undefined" && (
                                <div className="text-sm text-slate-500">편의시설 정보가 없습니다.</div>
                            )}
                    </div>
                ) : (
                    <div className="text-sm text-slate-500">편의시설 정보가 없습니다.</div>
                )}
            </section>

            {/* ✅ 교통/홈페이지 */}
            <section className={CARD}>
                <h3 className="text-lg font-semibold mb-3">교통/연락처</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <div className="text-slate-500">가까운 역/정류장</div>
                        <div>{data?.transport?.nearestSubway ?? "-"}</div>
                        <div>{data?.transport?.nearestBusStop ?? ""}</div>
                        {data?.transport?.shuttleInfo && <div>셔틀: {data.transport.shuttleInfo}</div>}
                        {data?.transport?.directionsNote && <div className="text-slate-600">{data.transport.directionsNote}</div>}
                    </div>
                    <div className="space-y-1">
                        <div className="text-slate-500">홈페이지 / 전화</div>
                        <div>
                            {data?.links?.homepage ? (
                                <a className="text-blue-600 underline" href={data.links.homepage} target="_blank" rel="noreferrer">
                                    {data.links.homepage}
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                        <div>
                            {data?.links?.phone ? (
                                <a className="text-blue-600 underline" href={`tel:${data.links.phone}`}>{data.links.phone}</a>
                            ) : (
                                "-"
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 객실 구성 */}
            <section className={CARD}>
                <h3 className="text-lg font-semibold mb-3">객실 구성</h3>
                {rooms ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <KPI label="1인실" value={rooms.single} unit="실" />
                        <KPI label="2인실" value={rooms.double} unit="실" />
                        <KPI label="3인실" value={rooms.triple} unit="실" />
                        <KPI label="4인실" value={rooms.quadruple} unit="실" />
                        <KPI label="기타" value={rooms.etc} unit="실" />
                    </div>
                ) : (
                    <div className="text-sm text-slate-500">객실 정보가 없습니다.</div>
                )}
            </section>

            {/* 비급여 항목 */}
            <section className={CARD}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">비급여 항목</h3>
                </div>
                {nonpay.length ? (
                    <table className="mt-3 w-full text-sm">
                        <thead>
                        <tr className="text-left text-slate-500">
                            <th className="py-2">항목</th>
                            <th className="py-2">단위</th>
                            <th className="py-2">금액</th>
                            <th className="py-2">비고</th>
                        </tr>
                        </thead>
                        <tbody>
                        {nonpay.map((n, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-2">{n.item ?? "-"}</td>
                                <td className="py-2">{n.unit ?? "-"}</td>
                                <td className="py-2">{formatWon(n.price)}</td>
                                <td className="py-2">{n.note ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-sm text-slate-500">등록된 비급여 항목이 없습니다.</div>
                )}
            </section>

            {/* 계약/비용 안내 */}
            <section className={CARD}>
                <h3 className="text-lg font-semibold">계약/비용 안내</h3>
                {contracts.length ? (
                    <table className="mt-3 w-full text-sm">
                        <thead>
                        <tr className="text-left text-slate-500">
                            <th className="py-2">항목</th>
                            <th className="py-2">단위</th>
                            <th className="py-2">금액</th>
                            <th className="py-2">비고</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contracts.map((c, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-2">{c.title ?? "-"}</td>
                                <td className="py-2">{c.unit ?? "-"}</td>
                                <td className="py-2">{formatWon(c.price)}</td>
                                <td className="py-2">{c.note ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-sm text-slate-500">계약/비용 정보가 없습니다.</div>
                )}
            </section>
        </div>
    );
}

function KPI({
                 label,
                 value,
                 unit,
                 format,
             }: {
    label: string;
    value?: number;
    unit?: string;
    format?: "won";
}) {
    const text =
        format === "won"
            ? formatWon(value)
            : typeof value === "number"
                ? value.toLocaleString("ko-KR") + (unit ?? "")
                : "-";
    return (
        <div className="rounded-xl border p-4">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-semibold">{text}</div>
        </div>
    );
}

/** 단일 마커 미니 카카오맵 */
function MiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!divRef.current) return;

        const tick = () => {
            if (window.kakao?.maps?.load) {
                window.kakao.maps.load(() => {
                    const map = new window.kakao.maps.Map(divRef.current!, {
                        center: new window.kakao.maps.LatLng(lat, lng),
                        level: 4,
                    });
                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(lat, lng),
                    });
                    marker.setMap(map);
                    const iw = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:6px 8px;font-size:12px;">${name}</div>`,
                    });
                    window.kakao.maps.event.addListener(marker, "mouseover", () => iw.open(map, marker));
                    window.kakao.maps.event.addListener(marker, "mouseout", () => iw.close());
                });
            } else {
                setTimeout(tick, 50);
            }
        };

        tick();
    }, [lat, lng, name]);

    return <div ref={divRef} className="h-56 w-full rounded-xl border" />;
}
