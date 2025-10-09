import { useEffect, useRef } from "react";

export function MapPanel() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<kakao.maps.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        const { kakao } = window;
        if (!kakao?.maps?.load) return; // SDK 아직 준비 전이면 자연스레 재호출됨

        kakao.maps.load(() => {
            if (!containerRef.current || mapRef.current) return;
            mapRef.current = new kakao.maps.Map(containerRef.current, {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            });
        });
    }, []);

    return (
        <div className="rounded-2xl border bg-white">
            <div className="border-b p-4 text-base font-medium">지도</div>
            {/* 크기 반드시 지정 */}
            <div ref={containerRef} className="w-[500px] h-[400px]" />
        </div>
    );
}
