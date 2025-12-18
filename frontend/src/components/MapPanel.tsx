/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useContext, useCallback,
} from "react";
import { Ctx } from "../contexts/Ctx";
import {
    fetchFacilitiesInCircle,
    type FacilityLite,
} from "../api/ltc";
import { SimilarModal } from "./SimilarModal";
import { mapFacilityType } from "../utils/facilityType";
import {PROGRAM_MAP} from "../utils/programMap.ts";

type KakaoLoader = {
    kakao?: {
        maps?: { load?: (cb: () => void) => void };
        services?: any;
    };
};

type Coord = { lat: number; lng: number };

const SEOUL_CENTER: Coord = { lat: 37.5665, lng: 126.9780 };

export function MapPanel() {
    const {
        center,
        radiusKm,
        careLevel,
        gradeFilter,
        minCaregiver,
        hasNurse,
        hasDoctor,
        hasSocial,
        roomTypes,
        programTypes
    } = useContext(Ctx);

    const isFilterActive =
        careLevel !== "전체" ||
        gradeFilter !== "전체" ||
        minCaregiver > 0 ||
        hasNurse ||
        hasDoctor ||
        hasSocial ||
        roomTypes.length > 0 ||
        programTypes.length > 0;

    const matchesType = useCallback((item: FacilityLite): boolean => {
        if (careLevel === "전체") return true;
        return mapFacilityType(item.kindCode) === careLevel;
    }, [careLevel]);

    const matchesGrade = useCallback((f: FacilityLite): boolean => {
        if (gradeFilter === "전체") return true;
        return f.grade === gradeFilter;
    }, [gradeFilter]);

    const matchesCaregiver = useCallback((f: FacilityLite) => {
        return (f.caregiver ?? 0) >= minCaregiver;
    }, [minCaregiver]);

    const matchesNurse = useCallback((f: FacilityLite) => {
        if (!hasNurse) return true;
        return (f.nurse ?? 0) > 0;
    }, [hasNurse]);

    const matchesDoctor = useCallback((f: FacilityLite) => {
        if (!hasDoctor) return true;
        return (f.doctor ?? 0) > 0;
    }, [hasDoctor]);

    const matchesSocial = useCallback((f: FacilityLite) => {
        if (!hasSocial) return true;
        return (f.socialWorker ?? 0) > 0;
    }, [hasSocial]);

    const matchesRoom = useCallback((f: FacilityLite): boolean => {
        for (const rt of roomTypes) {
            if (rt === "1인실" && (f.singleRm ?? 0) > 0) return true;
            if (rt === "2인실" && (f.doubleRm ?? 0) > 0) return true;
            if (rt === "3인실" && (f.tripleRm ?? 0) > 0) return true;
            if (rt === "4인실" && (f.quadrupleRm ?? 0) > 0) return true;
            if (rt === "프로그램실" && (f.programRoom ?? 0) > 0) return true;
            if (rt === "식당" && (f.diningKitchen ?? 0) > 0) return true;
            if (rt === "목욕실" && (f.bath ?? 0) > 0) return true;
        }
        return roomTypes.length === 0;
    }, [roomTypes]);

    const matchesProgram = useCallback((f: FacilityLite): boolean => {
        if (programTypes.length === 0) return true;
        const programs = f.programs;
        if (!programs || programs.length === 0) return false;

        return programTypes.some((name) => {
            const codes = PROGRAM_MAP[name];
            if (!codes) return false;
            return programs.some(p => codes.includes(String(p.pgmType)));
        });
    }, [programTypes]);


    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);
    const clustererRef = useRef<any | null>(null);
    const circleRef = useRef<any | null>(null);

    const [rows, setRows] = useState<FacilityLite[]>([]);
    const [circleCenter, setCircleCenter] = useState<Coord>(SEOUL_CENTER);

    const [selectedInst, setSelectedInst] = useState<string | null>(null);
    const [selectedKindCode, setSelectedKindCode] = useState<string | null>(null);

    const [mapReady, setMapReady] = useState(false);

    /** 0) Kakao Map 초기화 */
    useEffect(() => {
        if (!containerRef.current) return;

        const init = () => {
            const kakao = (window as any).kakao;

            const map = new kakao.maps.Map(containerRef.current!, {
                center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
                level: 9,
            });

            const clusterer = new kakao.maps.MarkerClusterer({
                map,
                averageCenter: false,
                minLevel: 3,
            });

            mapRef.current = map;
            clustererRef.current = clusterer;

            // 기본 10km 원
            const circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
                radius: radiusKm * 1000,
                strokeWeight: 2,
                strokeColor: "#2563eb",
                strokeOpacity: 0.6,
                strokeStyle: "solid",
                fillColor: "#93c5fd",
                fillOpacity: 0.15,
            });

            circle.setMap(map);
            circleRef.current = circle;
            setCircleCenter(SEOUL_CENTER);
            setMapReady(true);
        };

        const wait = () => {
            const w = window as unknown as KakaoLoader;
            if (w.kakao?.maps?.load) w.kakao.maps.load(init);
            else setTimeout(wait, 50);
        };

        wait();
    }, [radiusKm]);

    /** 1) DB에서 전체 시설 리스트 가져오기 */
    useEffect(() => {
        if (!mapReady) return;

        let alive = true;

        (async () => {
            const list = await fetchFacilitiesInCircle(
                circleCenter.lat,
                circleCenter.lng,
                radiusKm
            );
            if (!alive) return;
            setRows(list);
        })();

        return () => {
            alive = false;
        };
    }, [circleCenter, radiusKm, mapReady]);


    /** 2) DB에서 lat/lng 있는 시설만 필터링 */
    const renderable = useMemo(() => {
        const base = rows.filter(r => r.lat != null && r.lng != null);

        if (!isFilterActive) {
            return base;
        }

        return base
            .filter(matchesType)
            .filter(matchesGrade)
            .filter(matchesCaregiver)
            .filter(matchesNurse)
            .filter(matchesDoctor)
            .filter(matchesSocial)
            .filter(matchesRoom)
            .filter(matchesProgram);
    }, [rows, isFilterActive, matchesType, matchesGrade, matchesCaregiver, matchesNurse, matchesDoctor, matchesSocial, matchesRoom, matchesProgram]);

    /** 3) 마커 & 클러스터링 갱신 */
    useEffect(() => {
        const kakao = (window as any).kakao;
        if (!kakao?.maps || !mapRef.current || !clustererRef.current) return;

        const map = mapRef.current;
        const clusterer = clustererRef.current;

        clusterer.clear();

        const markers = renderable
            .map((f) => {
                const marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(f.lat!, f.lng!),
                });

                const info = new kakao.maps.InfoWindow({
                    content: `<div style="padding:8px 10px;font-size:12px;">${f.name}</div>`,
                });

                kakao.maps.event.addListener(marker, "mouseover", () => info.open(map, marker));
                kakao.maps.event.addListener(marker, "mouseout", () => info.close());

                kakao.maps.event.addListener(marker, "click", () => {
                    setSelectedInst(f.instCode);
                    setSelectedKindCode(f.kindCode ?? "A03");
                });

                return marker;
            });

        clusterer.addMarkers(markers);
    }, [renderable, radiusKm, circleCenter]);

    /** 4) 주소 변경 시 원과 중심 이동 */
    useEffect(() => {
        const kakao = (window as any).kakao;

        if (
            !mapReady ||
            !kakao?.maps?.services ||
            !mapRef.current
        ) return;

        const keyword = center.trim();
        if (!keyword) return;

        const map = mapRef.current;
        const places = new kakao.maps.services.Places();
        const geocoder = new kakao.maps.services.Geocoder();

        // ① 장소명(POI) 검색 먼저 시도
        places.keywordSearch(keyword, (res: any[], status: any) => {
            if (status === kakao.maps.services.Status.OK && res.length > 0) {
                const { x, y } = res[0]; // 검색된 장소의 좌표
                const pos = new kakao.maps.LatLng(Number(y), Number(x));

                moveMap(pos);
                return;
            }

            console.warn("장소명 검색 실패, 주소 검색 시도:", keyword);

            // ② 주소 검색 fallback
            geocoder.addressSearch(keyword, (addrRes: any[], addrStatus: any) => {
                if (addrStatus === kakao.maps.services.Status.OK && addrRes.length > 0) {
                    const { x, y } = addrRes[0];
                    const pos = new kakao.maps.LatLng(Number(y), Number(x));

                    moveMap(pos);
                    return;
                }

                console.error("❌ 장소명 + 주소 검색 모두 실패:", keyword);
            });
        });

        function moveMap(pos: any) {
            // 지도 중심 이동
            map.setCenter(pos);

            // 기존 원 제거
            if (circleRef.current?.setMap) {
                circleRef.current.setMap(null);
            }

            const circle = new kakao.maps.Circle({
                center: pos,
                radius: radiusKm * 1000,
                strokeWeight: 3,
                strokeColor: "#0055ff",
                strokeOpacity: 0.9,
                fillColor: "#99ccff",
                fillOpacity: 0.3,
            });

            circle.setMap(map);
            circleRef.current = circle;

            setCircleCenter({ lat: pos.getLat(), lng: pos.getLng() });
        }
    }, [center, radiusKm, mapReady]);

    /** 5) 반경 슬라이더 변경 시 원 크기만 변경 */
    useEffect(() => {
        if (!circleRef.current) return;
        circleRef.current.setRadius(radiusKm * 1000);
    }, [radiusKm]);

    /** 6) 반경 내 시설 리스트 업데이트 */

    return (
        <div className="rounded-2xl border bg-white">
            <div className="flex items-center gap-3 border-b p-4 text-base font-medium">
                지도
                <span className="text-xs text-slate-500">
                    요양원 {rows.length}개 불러옴
                </span>
            </div>

            <div className="p-4">
                <div
                    ref={containerRef}
                    className="w-full rounded-2xl border h-[280px] md:h-[360px] xl:h-[420px]"
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