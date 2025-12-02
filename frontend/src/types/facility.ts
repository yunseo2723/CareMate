export type Facility = {
    id: string;              // instCode
    name: string;
    address: string;
    careLevel: string;       // kindCode (A03 등)
    monthlyCost?: number;    // 없으면 0 취급
    rating?: number;         // 없으면 0 취급
    bedsAvailable?: number;  // 0 이상
    insurance?: string[];    // 나중에 쓰일 수 있으니 유지
};
