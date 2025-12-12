// src/contexts/Ctx.ts (혹은 providers/Ctx.ts – 실제 경로 맞춰줘)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import type { Facility } from "../types/facility";

type AiRecommendItem = {
    instCode: string;
    kindCode: string;
    name: string;
    address: string;
    reason: string;
};

export type SearchFilter = {
    center?: string;
    radiusKm?: number;
    careLevel?: string;
    gradeFilter?: string;

    minCaregiver?: number;
    hasNurse?: boolean;
    hasDoctor?: boolean;
    hasSocial?: boolean;

    roomTypes?: string[];
    programTypes?: string[];
};

export type SearchContextValue = {
    center: string;
    setCenter: (s: string) => void;

    radiusKm: number;
    setRadiusKm: (n: number) => void;

    careLevel: string;
    setCareLevel: (s: string) => void;

    gradeFilter: string;
    setGradeFilter: (s: string) => void;

    /** ⭐ 인력 필터 */
    minCaregiver: number;
    setMinCaregiver: (n: number) => void;
    hasNurse: boolean;
    setHasNurse: (b: boolean) => void;
    hasDoctor: boolean;
    setHasDoctor: (b: boolean) => void;
    hasSocial: boolean;
    setHasSocial: (b: boolean) => void;

    /** ⭐ 병실 필터 */
    roomTypes: string[];
    setRoomTypes: (v: string[]) => void;

    /** ⭐ 프로그램 필터 */
    programTypes: string[];
    setProgramTypes: (v: string[]) => void;

    applyFilter: (f: SearchFilter) => void;

    loading: boolean;
    setLoading: (v: boolean) => void;

    results: Facility[];

    setCircleFacilities: (rows: Facility[]) => void;

    compare: Facility[];
    setCompare: (v: Facility[]) => void;
    toggleCompare: (f: Facility) => void;

    editingFilterId: number | null;
    setEditingFilterId: (id: number | null) => void;

    _initialized: boolean;
    setInitialized: (v: boolean) => void;

    aiPrompt: string;
    setAiPrompt: (v: string) => void;

    aiResult: {
        normalizedNeed: string;
        items: AiRecommendItem[];
    } | null;
    setAiResult: (v: any) => void;

    clearAll: () => void;
};

export const Ctx = createContext<SearchContextValue>({
    center: "",
    setCenter: () => {},

    radiusKm: 10,
    setRadiusKm: () => {},

    careLevel: "전체",
    setCareLevel: () => {},

    gradeFilter: "전체",
    setGradeFilter: () => {},

    minCaregiver: 0,
    setMinCaregiver: () => {},
    hasNurse: false,
    setHasNurse: () => {},
    hasDoctor: false,
    setHasDoctor: () => {},
    hasSocial: false,
    setHasSocial: () => {},

    roomTypes: [],
    setRoomTypes: () => {},

    programTypes: [],
    setProgramTypes: () => {},

    applyFilter: () => {},

    loading: false,
    setLoading: () => {},

    results: [],

    setCircleFacilities: () => {},

    compare: [],
    setCompare: () => {},
    toggleCompare: () => {},

    editingFilterId: null,
    setEditingFilterId: () => {},

    _initialized: false,
    setInitialized: () => {},

    aiPrompt: "",
    setAiPrompt: () => {},

    aiResult: null,
    setAiResult: () => {},

    clearAll: () => {},
});
