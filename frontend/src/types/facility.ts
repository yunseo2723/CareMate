// src/types/facility.ts
export type Facility = {
    id: string;               // "cm-001" 등
    name: string;
    address: string;
    phone?: string;
    lat: number;
    lng: number;
    rating?: number;
    monthlyCost?: number;
    careLevel?: string;
    bedsAvailable?: number;
    insurance?: string[];
    distanceKm?: number;
};
