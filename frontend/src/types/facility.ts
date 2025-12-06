export type Facility = {
    instCode: string;        // instCode
    kindCode: string;        // kindCode (A03 등)
    name: string;
    address: string;
    monthlyCost?: number;    // 없으면 0 취급
    rating?: number;         // 없으면 0 취급
    bedsAvailable?: number;  // 0 이상
    insurance?: string[];    // 나중에 쓰일 수 있으니 유지
};
