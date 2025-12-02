// src/providers/Ctx.ts

import { createContext } from "react";
import type { Facility } from "../types/facility";

export type SearchContextValue = {
    q: string;
    setQ: (s: string) => void;

    center: string;
    setCenter: (s: string) => void;

    detailCenter: string;
    setDetailCenter: (s: string) => void;

    setCircleFacilities: (rows: Facility[]) => void;

    radiusKm: number;
    setRadiusKm: (n: number) => void;

    budget: number;
    setBudget: (n: number) => void;

    careLevel: string;
    setCareLevel: (s: string) => void;

    minRating: number;
    setMinRating: (n: number) => void;

    onlyAvailable: boolean;
    setOnlyAvailable: (b: boolean) => void;

    ins: string[];
    setIns: (v: string[]) => void;

    amenities: string[];
    setAmenities: (v: string[]) => void;

    sort: string;
    setSort: (s: string) => void;

    loading: boolean;
    setLoading: (v: boolean) => void;

    results: Facility[];

    compare: Facility[];
    setCompare: (v: Facility[]) => void;

    toggleCompare: (f: Facility) => void;

    clearAll: () => void;
};

export const Ctx = createContext<SearchContextValue>({
    q: "",
    setQ: () => {},

    center: "",
    setCenter: () => {},

    setCircleFacilities: () => {},

    detailCenter: "",
    setDetailCenter: () => {},

    radiusKm: 10,
    setRadiusKm: () => {},

    budget: 2_000_000,
    setBudget: () => {},

    careLevel: "all",
    setCareLevel: () => {},

    minRating: 0,
    setMinRating: () => {},

    onlyAvailable: true,
    setOnlyAvailable: () => {},

    ins: [],
    setIns: () => {},

    amenities: [],
    setAmenities: () => {},

    sort: "추천순",
    setSort: () => {},

    loading: false,
    setLoading: () => {},

    results: [],

    compare: [],
    setCompare: () => {},

    toggleCompare: () => {},

    clearAll: () => {},
});
