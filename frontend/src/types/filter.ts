export type SearchFilter = {
    region?: string;
    type?: string;
    dementia?: boolean;
    priceRange?: [number, number];
};

export type SavedFilter = {
    id: number;
    name: string;
    filterJson: string;
    createdAt: string;
};