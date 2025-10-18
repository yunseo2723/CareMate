// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { username: string; nickname?: string; name?: string };
type Tokens = { accessToken: string | null; refreshToken: string | null };

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    tokens: Tokens;
    login: (user: User, tokens: Tokens) => void;
    logout: () => void;
    /** ✅ 보호 API는 반드시 이걸로 호출 */
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens>({ accessToken: null, refreshToken: null });
    const [loading, setLoading] = useState(true);

    // 앱 시작 시 localStorage에서 복원
    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("cm-auth");
            const rawTokens = localStorage.getItem("cm-tokens");
            if (rawUser) setUser(JSON.parse(rawUser));
            if (rawTokens) setTokens(JSON.parse(rawTokens));
        } catch {}
        setLoading(false);
    }, []);

    const login = (u: User, t: Tokens) => {
        setUser(u);
        setTokens(t);
        localStorage.setItem("cm-auth", JSON.stringify(u));
        localStorage.setItem("cm-tokens", JSON.stringify(t));
    };

    const logout = () => {
        setUser(null);
        setTokens({ accessToken: null, refreshToken: null });
        localStorage.removeItem("cm-auth");
        localStorage.removeItem("cm-tokens");
    };

    const authFetch: AuthContextValue["authFetch"] = (input, init = {}) => {
        const headers = new Headers(init.headers || {});
        if (tokens.accessToken) {
            headers.set("Authorization", `${tokens.accessToken}`);
        }
        // 디버그 확인용
        // console.log("[authFetch]", { url: String(input), auth: headers.get("Authorization") });

        return fetch(input, { ...init, headers, credentials: init.credentials ?? "include" });
    };

    const value = useMemo(
        () => ({ user, loading, tokens, login, logout, authFetch }),
        [user, loading, tokens]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
