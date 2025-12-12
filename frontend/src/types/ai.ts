export type AiRecommendRequest = {
    message: string;
    filter: Record<string, unknown>;
};

export type AiRecommendResponse = {
    normalizedNeed: string;
    items: {
        instCode: string;
        name: string;
        fullRoadAddr: string;
        reason: string;
    }[];
};
