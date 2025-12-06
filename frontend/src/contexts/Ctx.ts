// src/contexts/Ctx.ts (혹은 providers/Ctx.ts – 실제 경로 맞춰줘)

import { createContext } from "react";
import type { Facility } from "../types/facility";

export type SearchContextValue = {
    center: string;
    setCenter: (s: string) => void;

    radiusKm: number;
    setRadiusKm: (n: number) => void;

    budget: number;
    setBudget: (n: number) => void;

    careLevel: string;
    setCareLevel: (s: string) => void;

    gradeFilter: string;
    setGradeFilter: (s: string) => void;

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

    setCircleFacilities: (rows: Facility[]) => void;

    compare: Facility[];
    setCompare: (v: Facility[]) => void;
    toggleCompare: (f: Facility) => void;

    clearAll: () => void;
};

export const Ctx = createContext<SearchContextValue>({
    center: "",
    setCenter: () => {},

    radiusKm: 10,
    setRadiusKm: () => {},

    budget: 2_000_000,
    setBudget: () => {},

    careLevel: "전체",
    setCareLevel: () => {},

    gradeFilter: "전체",
    setGradeFilter: () => {},


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

    setCircleFacilities: () => {},

    compare: [],
    setCompare: () => {},
    toggleCompare: () => {},

    clearAll: () => {},
});
