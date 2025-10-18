import {createContext, type Dispatch, type SetStateAction} from 'react';
import type { Facility } from '../types/facility';

export interface SearchContextValue {
    q: string; setQ: (v: string) => void;
    center: string; setCenter: (v: string) => void;
    detailCenter: string; setDetailCenter: (v: string) => void;
    radiusKm: number; setRadiusKm: (v: number) => void;
    budget: number; setBudget: (v: number) => void;
    careLevel: string; setCareLevel: (v: string) => void;
    minRating: number; setMinRating: (v: number) => void;
    onlyAvailable: boolean; setOnlyAvailable: (v: boolean) => void;
    ins: string[]; setIns: (v: string[]) => void;
    amenities: string[]; setAmenities: (v: string[]) => void;
    sort: string; setSort: (v: string) => void;
    loading: boolean; setLoading: (v: boolean) => void;
    results: Facility[];
    compare: Facility[]; setCompare: Dispatch<SetStateAction<Facility[]>>;
    toggleCompare: (f: Facility) => void;
    clearAll: () => void;
}
export const Ctx = createContext<SearchContextValue | null>(null);
