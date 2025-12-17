export {};

declare global {
    interface Window {
        kakao: typeof kakao;
    }
}

declare namespace kakao {
    namespace maps {
        function load(cb: () => void): void;

        class LatLng {
            constructor(lat: number, lng: number);
            getLat(): number;
            getLng(): number;
        }

        class LatLngBounds {
            constructor(sw?: LatLng, ne?: LatLng);
            extend(latlng: LatLng): void;
        }

        class Map {
            constructor(container: HTMLElement, options: { center: LatLng; level?: number });
            setCenter(latlng: LatLng): void;
            setBounds(bounds: LatLngBounds): void;
            getLevel(): number;
            setLevel(level: number): void;
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
            getCenter(): LatLng;
            getRadius(): number;
        }

        class MarkerClusterer {
            constructor(options: {
                map: Map;
                averageCenter?: boolean;
                minLevel?: number;
            });

            addMarkers(markers: Marker[]): void;
            clear(): void;
        }

        const event: {
            addListener(
                target: Marker,
                type: "click" | "mouseover" | "mouseout",
                handler: () => void
            ): void;
        };

        namespace services {
            type Status = "OK" | "ZERO_RESULT" | "ERROR";

            interface GeocoderResult {
                x: string;
                y: string;
            }

            class Geocoder {
                addressSearch(
                    query: string,
                    callback: (result: GeocoderResult[], status: Status) => void
                ): void;
            }

            interface Place {
                id: string;
                place_name: string;
                x: string;
                y: string;
            }

            type PlacesSearchResult = Place[];

            interface PlacesSearchOptions {
                location?: kakao.maps.LatLng;
                radius?: number;
            }

            class Places {
                keywordSearch(
                    keyword: string,
                    callback: (result: PlacesSearchResult, status: Status) => void,
                    options?: PlacesSearchOptions
                ): void;
            }
        }
    }
}
