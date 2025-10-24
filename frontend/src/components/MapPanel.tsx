// src/components/MapPanel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";

type KakaoLoader = {
    kakao?: { maps?: { load?: (cb: () => void) => void } };
};

// 거리(km)
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

    const [centerCoord, setCenterCoord] = useState<{ lat: number; lng: number } | null>(null);

    // 지도 초기화
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

        return () => { cancelled = true; };
    }, []);

    // 주소 지오코딩
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

    // 상세위치 Place 검색
    const searchPlace = (keyword: string, near?: kakao.maps.LatLng, radiusM?: number) =>
        new Promise<kakao.maps.LatLng | null>((resolve) => {
            const { kakao } = window;
            const places = new kakao.maps.services.Places();
            const opt: kakao.maps.services.PlacesSearchOptions = {};
            if (near) {
                opt.location = near;
                opt.radius = Math.max(1000, radiusM ?? 0);
            }
            places.keywordSearch(
                keyword,
                (data: kakao.maps.services.PlacesSearchResult, status: kakao.maps.services.Status) => {
                    if (status === kakao.maps.services.Status.OK && data.length) {
                        const d0 = data[0];
                        resolve(new kakao.maps.LatLng(Number(d0.y), Number(d0.x)));
                    } else resolve(null);
                },
                opt
            );
        });

    // 중심 좌표 계산 + 원/바운즈
    useEffect(() => {
        const base = (center ?? "").trim();
        const detail = (detailCenter ?? "").trim();
        if (!base && !detail) return;

        const run = async () => {
            const { kakao } = window;
            if (!kakao?.maps || !mapRef.current) return;

            let ll: kakao.maps.LatLng | null = null;
            const baseLL = base ? await geocode(base) : null;

            if (detail) {
                ll = await searchPlace(detail, baseLL ?? undefined, radiusKm * 1000);
                if (!ll && base) ll = await geocode(`${base} ${detail}`);
            }
            if (!ll && base) ll = baseLL;
            if (!ll) return;

            const lat = ll.getLat();
            const lng = ll.getLng();
            setCenterCoord({ lat, lng });

            const map = mapRef.current!;
            map.setCenter(ll);

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

            const R = 111_320;
            const dLat = (radiusKm * 1000) / R;
            const dLng = (radiusKm * 1000) / (R * Math.cos((lat * Math.PI) / 180));
            const sw = new kakao.maps.LatLng(lat - dLat, lng - dLng);
            const ne = new kakao.maps.LatLng(lat + dLat, lng + dLng);
            map.setBounds(new kakao.maps.LatLngBounds(sw, ne));
        };

        run();
    }, [center, detailCenter, radiusKm]);

    // 반경 내 필터링 (Facility[] 이므로 lat/lng는 이미 number)
    const filtered = useMemo(() => {
        if (!centerCoord) return results;
        return results.filter((r) => distanceKm(centerCoord, { lat: r.lat, lng: r.lng }) <= radiusKm + 1e-6);
    }, [results, radiusKm, centerCoord]);

    // 마커 렌더링 + 바운즈
    useEffect(() => {
        const { kakao } = window;
        if (!kakao?.maps || !mapRef.current || !clustererRef.current) return;

        const map = mapRef.current;
        const clusterer = clustererRef.current;

        clusterer.clear();

        // 🔎 디버깅
        console.log("[MAP] filtered count:", filtered.length);
        console.table(filtered.slice(0, 10));

        const markers = filtered.map((f) => {
            const m = new kakao.maps.Marker({ position: new kakao.maps.LatLng(f.lat, f.lng) });

            // ✅ 상세 경로는 /caremates/:id (너의 라우팅에 맞춤!)
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

        const { lat, lng } = centerCoord;
        const R = 111_320;
        const dLat = (radiusKm * 1000) / R;
        const dLng = (radiusKm * 1000) / (R * Math.cos((lat * Math.PI) / 180));
        const sw = new kakao.maps.LatLng(lat - dLat, lng - dLng);
        const ne = new kakao.maps.LatLng(lat + dLat, lng + dLng);
        const bounds = new kakao.maps.LatLngBounds(sw, ne);
        markers.forEach((m) => bounds.extend(m.getPosition()));
        map.setBounds(bounds);
    }, [filtered, radiusKm, nav, centerCoord]);

    return (
        <div className="rounded-2xl border bg-white">
            <div className="border-b p-4 text-base font-medium">지도</div>
            <div className="p-4">
                <div ref={containerRef} className="h-[70vh] w-full rounded-2xl border" />
            </div>
        </div>
    );
}
