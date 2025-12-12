import { createContext } from "react";

export type User = {
    id?: number;
    username: string;
    nickname?: string;
    name?: string;
    phone?: string;
    // 요양원 관리자 InstCode 목록
    adminFacilities?: {
        instCode: string;
        name: string;
    }[];
};

export type Tokens = { accessToken: string | null; refreshToken: string | null };

export type AuthContextValue = {
    user: User | null;
    loading: boolean;
    tokens: Tokens;
    login: (user: User, tokens: Tokens) => void;
    logout: () => void;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    refreshUser: () => Promise<void>;
};

// ✅ 컴포넌트가 아닌 값만 export
export const AuthContext = createContext<AuthContextValue | null>(null);