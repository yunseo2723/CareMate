declare global {
    interface Window {
        kakao: any; // 런타임 접근용; 실제 상세 타입은 아래 kakao namespace에서 제공
    }

// 기존 kakao 네임스페이스(클래스/타입 선언)는 그대로 유지
declare namespace kakao {
    namespace maps {
        function load(cb: () => void): void;

        class LatLng {
            constructor(lat: number, lng: number);
        }

        class LatLngBounds {
            extend(latlng: LatLng): void;
        }

        class Map {
            constructor(container: HTMLElement, options: { center: LatLng; level?: number });

            setCenter(latlng: LatLng): void;

            setBounds(bounds: LatLngBounds): void;
        }

        class Marker {
            constructor(options: { position: LatLng });

            getPosition(): LatLng;
        }

        class InfoWindow {
            constructor(options: { content: string });

            open(map: Map, marker: Marker): void;

            close(): void;
        }

        class Circle {
            constructor(options: {
                center: LatLng;
                radius: number;
                strokeWeight?: number;
                strokeColor?: string;
                strokeOpacity?: number;
                fillColor?: string;
                fillOpacity?: number;
            });

            setMap(map: Map | null): void;
        }

        class MarkerClusterer {
            constructor(options: { map: Map; averageCenter?: boolean; minLevel?: number });

            addMarkers(markers: Marker[]): void;

            clear(): void;
        }

        const event: {
            addListener(target: Marker, type: "mouseover" | "mouseout", handler: () => void): void;
        };
        namespace services {
            type Status = "OK" | "ZERO_RESULT" | "ERROR";

            interface GeocoderResult {
                x: string;
                y: string
            }

            class Geocoder {
                addressSearch(
                    query: string,
                    callback: (result: GeocoderResult[], status: Status) => void
                ): void;
            }
        }
    }
}
}

export {};
