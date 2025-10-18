// src/components/MapPanel.tsx
import {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";

type KakaoLoader = {
    kakao?: { maps?: { load?: (cb: () => void) => void } };
};

// 거리(km) 계산 (하버사인)
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function MapPanel() {
    const { results, center, detailCenter, radiusKm } = useSearch();
    const nav = useNavigate();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
    const circleRef = useRef<kakao.maps.Circle | null>(null);

    // 중심 좌표(숫자)
    const [centerCoord, setCenterCoord] = useState<{ lat: number; lng: number } | null>(null);

    // 0) Kakao SDK 준비 & 지도 초기화
    useEffect(() => {
        if (!containerRef.current) return;
        let cancelled = false;

        const init = () => {
            if (cancelled || !containerRef.current) return;
            const { kakao } = window;
            const map = new kakao.maps.Map(containerRef.current, {
                center: new kakao.maps.LatLng(37.5665, 126.978),
                level: 6,
            });
            // ✅ clusterer 라이브러리 필요
            const clusterer = new kakao.maps.MarkerClusterer({
                map,
                averageCenter: true,
                minLevel: 6,
            });
            mapRef.current = map;
            clustererRef.current = clusterer;
        };

        const tick = () => {
            const w = window as unknown as KakaoLoader;
            if (w.kakao?.maps?.load) w.kakao.maps.load(init);
            else setTimeout(tick, 50);
        };
        tick();

        return () => {
            cancelled = true;
        };
    }, []);

    // 👇 주소 지오코딩 Promise 래퍼
    const geocode = (q: string) =>
        new Promise<kakao.maps.LatLng | null>((resolve) => {
            const { kakao } = window;
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(
                q,
                (res: kakao.maps.services.GeocoderResult[], status: kakao.maps.services.Status) => {
                    if (status === kakao.maps.services.Status.OK && res.length) {
                        const { x, y } = res[0];
                        resolve(new kakao.maps.LatLng(Number(y), Number(x)));
                    } else resolve(null);
                }
            );
        });

    // 👇 상세위치 → Places 검색
    const searchPlace = (keyword: string, near?: kakao.maps.LatLng, radiusM?: number) =>
        new Promise<kakao.maps.LatLng | null>((resolve) => {
            const { kakao } = window;
            const places = new kakao.maps.services.Places();
            const opt: kakao.maps.services.PlacesSearchOptions = {};
            if (near) {
                opt.location = near;
                opt.radius = Math.max(1000, radiusM ?? 0); // 최소 1km
            }
            places.keywordSearch(
                keyword,
                (
                    data: kakao.maps.services.PlacesSearchResult,
                    status: kakao.maps.services.Status
                ) => {
                    if (status === kakao.maps.services.Status.OK && data.length) {
                        const d0 = data[0];
                        resolve(new kakao.maps.LatLng(Number(d0.y), Number(d0.x)));
                    } else resolve(null);
                },
                opt
            );
        });

    // 1) 중심 좌표 결정 → 반경 원 & 화면 맞춤
    useEffect(() => {
        const base = (center ?? "").trim();
        const detail = (detailCenter ?? "").trim();

        // 둘 다 비었으면 동작 안 함
        if (!base && !detail) return;

        const run = async () => {
            const { kakao } = window;
            if (!kakao?.maps || !mapRef.current) return;

            let ll: kakao.maps.LatLng | null = null;

            // 우선 지역(중심) 좌표
            const baseLL = base ? await geocode(base) : null;

            if (detail) {
                // 1) 상세명은 Places로 시도 (지역 근처 반경)
                ll = await searchPlace(detail, baseLL ?? undefined, radiusKm * 1000);
                // 2) 실패하면 "지역 상세"로 주소 지오코딩
                if (!ll && base) ll = await geocode(`${base} ${detail}`);
            }

            // 3) 그래도 없으면 지역만 지오코딩
            if (!ll && base) ll = baseLL;

            // 4) 끝까지 못 구하면 포기
            if (!ll) return;

            const lat = ll.getLat();
            const lng = ll.getLng();
            setCenterCoord({ lat, lng });

            const map = mapRef.current!;
            map.setCenter(ll);

            // 반경 원 갱신
            if (circleRef.current) circleRef.current.setMap(null);
            const circle = new kakao.maps.Circle({
                center: ll,
                radius: radiusKm * 1000,
                strokeWeight: 1,
                strokeColor: "#64748b",
                strokeOpacity: 0.8,
                fillColor: "#94a3b8",
                fillOpacity: 0.15,
            });
            circle.setMap(map);
            circleRef.current = circle;

            // 원이 보이도록 bounds
            const R = 111_320; // 위도 1도 ≈ m
            const dLat = (radiusKm * 1000) / R;
            const dLng = (radiusKm * 1000) / (R * Math.cos((lat * Math.PI) / 180));
            const sw = new kakao.maps.LatLng(lat - dLat, lng - dLng);
            const ne = new kakao.maps.LatLng(lat + dLat, lng + dLng);
            map.setBounds(new kakao.maps.LatLngBounds(sw, ne));
        };

        run();
    }, [center, detailCenter, radiusKm]);

    // 2) 반경 내 결과만 필터링 (👉 중심/상세 변경에도 다시 계산되도록 deps 보강)
    const filtered = useMemo(() => {
        if (!centerCoord) return results;
        return results.filter(r => distanceKm(centerCoord, { lat: r.lat, lng: r.lng }) <= radiusKm + 1e-6);
    }, [results, radiusKm, centerCoord]);

    // 3) 마커 + 클러스터 + 바운즈(원+마커 포함)
    useEffect(() => {
        const { kakao } = window;
        if (!kakao?.maps || !mapRef.current || !clustererRef.current) return;

        const map = mapRef.current;
        const clusterer = clustererRef.current;

        clusterer.clear();

        const markers = filtered.map((f) => {
            const m = new kakao.maps.Marker({ position: new kakao.maps.LatLng(f.lat, f.lng) });
            kakao.maps.event.addListener(m, "click", () => nav(`/caremates/${f.id}`));
            const iw = new kakao.maps.InfoWindow({
                content: `<div style="padding:8px 10px;font-size:12px;">${f.name}</div>`,
            });
            kakao.maps.event.addListener(m, "mouseover", () => iw.open(map, m));
            kakao.maps.event.addListener(m, "mouseout", () => iw.close());
            return m;
        });

        clusterer.addMarkers(markers);

        if (!centerCoord) return;

        // bounds 계산
        const { lat, lng } = centerCoord;
        const R = 111_320;
        const dLat = (radiusKm * 1000) / R;
        const dLng = (radiusKm * 1000) / (R * Math.cos((lat * Math.PI) / 180));
        const sw = new kakao.maps.LatLng(lat - dLat, lng - dLng);
        const ne = new kakao.maps.LatLng(lat + dLat, lng + dLng);
        const bounds = new kakao.maps.LatLngBounds(sw, ne);
        markers.forEach((m) => bounds.extend(m.getPosition()));
        map.setBounds(bounds);
    }, [
        filtered,     // 마커가 바뀌면 다시
        radiusKm,     // 반경 바뀌면 다시
        nav,          // 네비 콜백 캡처
        centerCoord,
    ]);

    return (
        <div className="rounded-2xl border bg-white">
            <div className="border-b p-4 text-base font-medium">지도</div>
            <div className="p-4">
                <div ref={containerRef} className="h-[70vh] w-full rounded-2xl border" />
            </div>
        </div>
    );
}
