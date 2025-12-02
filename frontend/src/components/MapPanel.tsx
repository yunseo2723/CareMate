// src/components/MapPanel.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useContext,
} from "react";
import { Ctx } from "../contexts/Ctx";
import {
    fetchFacilitiesLiteAll,
    type FacilityLite,
} from "../api/ltc";
import { SimilarModal } from "./SimilarModal";

type KakaoLoader = {
    kakao?: {
        maps?: { load?: (cb: () => void) => void };
        services?: any;
    };
};

type Coord = { lat: number; lng: number };

const SEOUL_CENTER: Coord = { lat: 37.5665, lng: 126.9780 };

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

/** 이름 + 지역 + 우편번호 조합으로 검색 쿼리 구성 */
function buildQueries(f: FacilityLite): string[] {
    const base = (f.name?.trim() || "") + " 요양원";
    const region = [f.sgg, f.sido].filter(Boolean).join(" ").trim();
    const q1 = region ? `${base} ${region}` : base;
    const q2 = f.name?.trim() || "";
    const qs: string[] = [];
    if (q1 && q1 !== q2) qs.push(q1);
    if (q2) qs.push(q2);
    if (f.address) qs.push(f.address);
    if (f.postNo) qs.push(f.postNo);
    return Array.from(new Set(qs));
}

/* ---------- LocalStorage 캐시 ---------- */
const LS_VER = "v1";
const LS_COORDS = `cm:coords:${LS_VER}`;
const LS_RESOLVED = `cm:resolved:${LS_VER}`;

function loadJSON<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function saveJSON(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore
    }
}

function useDebouncedSave<T>(value: T, key: string, delay = 300) {
    const v = JSON.stringify(value);
    useEffect(() => {
        const t = setTimeout(() => {
            saveJSON(key, JSON.parse(v));
        }, delay);
        return () => clearTimeout(t);
    }, [v, key, delay]);
}

function waitKakaoReady(): Promise<any> {
    return new Promise((resolve) => {
        const check = () => {
            const w = window as any;
            if (w.kakao && w.kakao.maps && typeof w.kakao.maps.load === "function") {
                w.kakao.maps.load(() => resolve(w.kakao));
            } else {
                setTimeout(check, 50);
            }
        };
        check();
    });
}

export function MapPanel() {
    const {
        center,
        detailCenter,
        radiusKm,
        setCircleFacilities,
    } = useContext(Ctx);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);
    const clustererRef = useRef<any | null>(null);
    const circleRef = useRef<any | null>(null);

    const [rows, setRows] = useState<FacilityLite[]>([]);
    const [coords, setCoords] = useState<Record<string, Coord>>(
        () => loadJSON<Record<string, Coord>>(LS_COORDS, {}),
    );
    const [resolved, setResolved] = useState<Record<string, boolean>>(
        () => loadJSON<Record<string, boolean>>(LS_RESOLVED, {}),
    );
    const [progress, setProgress] = useState({ done: 0, total: 0 });

    // 🔵 반경 원의 중심 좌표 (거리 계산용, kakao 객체 X)
    const [circleCenter, setCircleCenter] = useState<Coord>(SEOUL_CENTER);

    useDebouncedSave(coords, LS_COORDS, 250);
    useDebouncedSave(resolved, LS_RESOLVED, 250);

    const regionCenterRef = useRef<Record<string, Coord>>({});

    const [selectedInst, setSelectedInst] = useState<string | null>(null);
    const [selectedKindCode, setSelectedKindCode] =
        useState<string | null>(null);

    /** 0) Kakao SDK init — ★처음 한 번만 실행 */
    useEffect(() => {
        if (!containerRef.current) return;

        const init = () => {
            const kakao = (window as any).kakao;

            const initialCenter = new kakao.maps.LatLng(
                SEOUL_CENTER.lat,
                SEOUL_CENTER.lng,
            );

            const map = new kakao.maps.Map(containerRef.current!, {
                center: initialCenter,
                level: 8,
            });

            const clusterer = new kakao.maps.MarkerClusterer({
                map,
                averageCenter: false, // 🌟 지도 중심 자동 이동 방지
                minLevel: 3,
            });

            mapRef.current = map;
            clustererRef.current = clusterer;

            // 기본 반경 원 (초기 10km 같은 값, radiusKm 읽어도 상관 없음)
            if (circleRef.current) {
                circleRef.current.setMap(null);
            }

            const defaultCircle = new kakao.maps.Circle({
                center: initialCenter,
                radius: radiusKm * 1000,
                strokeWeight: 3,
                strokeColor: "#0055ff",
                strokeOpacity: 0.9,
                strokeStyle: "solid",
                fillColor: "#99ccff",
                fillOpacity: 0.3,
            });

            defaultCircle.setMap(map);
            circleRef.current = defaultCircle;
            setCircleCenter(SEOUL_CENTER);
        };

        const tick = () => {
            const w = window as unknown as KakaoLoader;
            if (w.kakao?.maps?.load) w.kakao.maps.load(init);
            else setTimeout(tick, 60);
        };

        tick();
        // 🔥 radiusKm 절대 넣지 말 것 (반경 바꿀 때마다 지도 리셋됨)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** 1) 전국 목록 가져오기 */
    useEffect(() => {
        let alive = true;
        (async () => {
            const list = await fetchFacilitiesLiteAll();
            if (!alive) return;
            setRows(list);
            const already = list.filter(
                (r) => coords[r.id] || resolved[r.id],
            ).length;
            setProgress({ done: already, total: list.length });
        })();
        return () => {
            alive = false;
        };
    }, []);

    /** 2) 좌표 해소 (카카오 Places/Geocoder 이용) */
    useEffect(() => {
        let cancelled = false;

        async function resolveAll() {
            const kakao = await waitKakaoReady();
            if (cancelled) return;

            const geocoder = new kakao.maps.services.Geocoder();

            async function getRegionCenter(
                sgg?: string,
                sido?: string,
            ): Promise<Coord | null> {
                const key = [sgg, sido].filter(Boolean).join(" ");
                if (!key) return null;
                if (regionCenterRef.current[key])
                    return regionCenterRef.current[key];

                return new Promise<Coord | null>((resolve) => {
                    geocoder.addressSearch(
                        key,
                        (res: any[], status: any) => {
                            if (
                                status ===
                                kakao.maps.services.Status.OK &&
                                res.length
                            ) {
                                const y = Number(res[0].y);
                                const x = Number(res[0].x);
                                const c = { lat: y, lng: x };
                                regionCenterRef.current[key] = c;
                                resolve(c);
                            } else resolve(null);
                        },
                    );
                });
            }

            const pending = rows.filter(
                (r) => !resolved[r.id] && !coords[r.id],
            );
            const batchSize = 8;

            for (let i = 0; i < pending.length; i += batchSize) {
                if (cancelled) return;
                const slice = pending.slice(i, i + batchSize);

                await Promise.all(
                    slice.map(
                        (item) =>
                            new Promise<void>((resolve) => {
                                (async () => {
                                    const kakao = (window as any).kakao;
                                    const geocoder = new kakao.maps.services.Geocoder();
                                    const places = new kakao.maps.services.Places();

                                    const centerRegion = await getRegionCenter(
                                        item.sgg,
                                        item.sido,
                                    );
                                    const queries = buildQueries(item);

                                    const finish = () => {
                                        setResolved((prev) => ({
                                            ...prev,
                                            [item.id]: true,
                                        }));
                                        setProgress((p) => ({
                                            ...p,
                                            done: p.done + 1,
                                        }));
                                        resolve(); // <-- done() 대신 resolve()
                                    };

                                    const tryKeyword = (idx: number) => {
                                        if (idx >= queries.length) {
                                            if (item.postNo) {
                                                geocoder.addressSearch(
                                                    item.postNo,
                                                    (res: any[], status: any) => {
                                                        if (
                                                            status === kakao.maps.services.Status.OK &&
                                                            res.length
                                                        ) {
                                                            const y = Number(res[0].y);
                                                            const x = Number(res[0].x);
                                                            setCoords((prev) => ({
                                                                ...prev,
                                                                [item.id]: {
                                                                    lat: y,
                                                                    lng: x,
                                                                },
                                                            }));
                                                        }
                                                        finish();
                                                    },
                                                );
                                            } else {
                                                finish();
                                            }
                                            return;
                                        }

                                        const q = queries[idx];
                                        const opt: any = {};
                                        if (centerRegion) {
                                            opt.location = new kakao.maps.LatLng(
                                                centerRegion.lat,
                                                centerRegion.lng,
                                            );
                                            opt.radius = 20000;
                                        }

                                        places.keywordSearch(
                                            q,
                                            (data: any[], status: any) => {
                                                if (
                                                    status === kakao.maps.services.Status.OK &&
                                                    data.length
                                                ) {
                                                    const d0 = data[0];
                                                    const y = Number(d0.y);
                                                    const x = Number(d0.x);

                                                    setCoords((prev) => ({
                                                        ...prev,
                                                        [item.id]: {
                                                            lat: y,
                                                            lng: x,
                                                        },
                                                    }));

                                                    finish();
                                                } else {
                                                    tryKeyword(idx + 1);
                                                }
                                            },
                                            opt,
                                        );
                                    };
                                    tryKeyword(0);
                                })();
                            }),
                    ),
                );


                await sleep(300);
            }
        }

        if (rows.length) resolveAll();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    /** 3) 좌표가 있는 시설만 렌더링 대상 */
    const renderable = useMemo(
        () =>
            rows
                .map((r) =>
                    coords[r.id]
                        ? { ...r, ...coords[r.id] }
                        : null,
                )
                .filter(Boolean) as Array<FacilityLite & Coord>,
        [rows, coords],
    );

    /** 4) 마커 + 클러스터링 (원 안만 표시) */
    useEffect(() => {
        const kakao = (window as any).kakao;
        if (
            !kakao?.maps ||
            !mapRef.current ||
            !clustererRef.current
        ) {
            return;
        }

        const map = mapRef.current;
        const clusterer = clustererRef.current;
        clusterer.clear();

        const { lat: clat, lng: clng } = circleCenter;

        const markers = renderable
            .filter((f) => {
                const d = haversine(clat, clng, f.lat, f.lng);
                return d <= radiusKm;
            })
            .map((f) => {
                const m = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(f.lat, f.lng),
                });

                kakao.maps.event.addListener(m, "click", () => {
                    setSelectedInst(f.id);
                    setSelectedKindCode(f.kindCode ?? "A03");
                });

                return m;
            });

        clusterer.addMarkers(markers);
    }, [renderable, radiusKm, circleCenter]);

    /** 5) 중심 위치 주소 → 지도 중심 + 반경 원 중심 갱신 (줌 레벨 유지) */
    useEffect(() => {
        const kakao = (window as any).kakao;
        if (!kakao?.maps || !mapRef.current) return;

        const map = mapRef.current;
        const geocoder = new kakao.maps.services.Geocoder();
        const addr = detailCenter || center;

        if (!addr) return;

        geocoder.addressSearch(addr, (res: any[], status: any) => {
            if (status !== kakao.maps.services.Status.OK || !res.length) return;

            const y = Number(res[0].y);
            const x = Number(res[0].x);
            const pos = new kakao.maps.LatLng(y, x);

            // 주소 변경 시에만 지도 중심 변경
            map.setCenter(pos);

            // 원 재생성 (지도의 줌레벨은 그대로)
            if (circleRef.current && circleRef.current.setMap) {
                circleRef.current.setMap(null);
            }

            const circle = new kakao.maps.Circle({
                center: pos,
                radius: radiusKm * 1000,
                strokeWeight: 3,
                strokeColor: "#0055ff",
                strokeOpacity: 0.9,
                strokeStyle: "solid",
                fillColor: "#99ccff",
                fillOpacity: 0.3,
            });

            circle.setMap(map);
            circleRef.current = circle;
            setCircleCenter({ lat: y, lng: x });
        });
        // radiusKm 넣지 않음 → 슬라이더만 바꿀 때는 중심/줌 고정
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center, detailCenter]);

    /** 6) 반경 변경 시, 원 반경만 수정 (지도 중심/줌 그대로) */
    useEffect(() => {
        if (!circleRef.current) return;
        circleRef.current.setRadius(radiusKm * 1000);
    }, [radiusKm]);

    /** 7) 반경 내 시설만 SearchProvider 결과에 반영 */
    useEffect(() => {
        const { lat: clat, lng: clng } = circleCenter;

        const within = renderable.filter((f) => {
            const d = haversine(clat, clng, f.lat, f.lng);
            return d <= radiusKm;
        });

        setCircleFacilities(
            within.map((f) => ({
                id: f.id,
                name: f.name,
                address: f.address ?? "",
                careLevel: f.kindCode ?? "A03",
                monthlyCost: 0,
                rating: 0,
                bedsAvailable: 1,
                insurance: [],
            })),
        );
    }, [renderable, radiusKm, circleCenter, setCircleFacilities]);

    return (
        <div className="rounded-2xl border bg-white">
            <div className="flex items-center gap-3 border-b p-4 text-base font-medium">
                지도
                <span className="text-xs text-slate-500">
                    해결 {progress.done} / 총 {progress.total} · 반경 {radiusKm}km
                </span>
            </div>
            <div className="p-4">
                <div
                    ref={containerRef}
                    className="h-[70vh] w-full rounded-2xl border"
                />
            </div>

            {selectedInst && (
                <SimilarModal
                    instCode={selectedInst}
                    kindCode={selectedKindCode ?? "A03"}
                    onClose={() => setSelectedInst(null)}
                />
            )}
        </div>
    );
}
