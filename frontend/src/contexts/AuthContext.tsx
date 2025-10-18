import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type User = {
    id?: number;
    username: string;
    nickname?: string;
    name?: string;
    phone?: string;
    adminCareMateIds?: number[];
};

type Tokens = { accessToken: string | null; refreshToken: string | null };

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    tokens: Tokens;
    login: (user: User, tokens: Tokens) => void;
    logout: () => void;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    refreshUser: () => Promise<void>; // ✅ value에 포함
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens>({ accessToken: null, refreshToken: null });
    const [loading, setLoading] = useState(true);

    // 로컬에서 복원
    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("cm-auth");
            const rawTokens = localStorage.getItem("cm-tokens");
            if (rawUser) setUser(JSON.parse(rawUser));
            if (rawTokens) setTokens(JSON.parse(rawTokens));
        } catch {}
        // 여기서 loading을 곧장 false로 하지 말고, 아래 refreshUser가 끝난 뒤에 false로!
    }, []);

    const login = (u: User, t: Tokens) => {
        // 권장: accessToken/refreshToken은 "Bearer " 없는 **순수 토큰**으로 저장
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

    // ✅ 보호 API 호출은 항상 이걸 사용
    const authFetch: AuthContextValue["authFetch"] = (input, init = {}) => {
        const headers = new Headers(init.headers || {});
        const at = tokens.accessToken || JSON.parse(localStorage.getItem("cm-tokens") || "null")?.accessToken || null;

        if (at) {
            // 토큰이 'Bearer ' 없이 저장돼 있다고 가정하고 접두어를 여기서 붙임
            headers.set("Authorization", `${at}`);
        }

        return fetch(input, { ...init, headers, credentials: init.credentials ?? "include" });
    };

    const refreshUser = async () => {
        setLoading(true);
        try {
            // 토큰은 state → localStorage 순으로 조회
            const at = tokens.accessToken || JSON.parse(localStorage.getItem("cm-tokens") || "null")?.accessToken || null;

            if (!at) {               // ✅ 토큰 없으면 호출 안 함
                setUser(null);
                return;
            }

            const res = await fetch("http://localhost:8080/users/me", {
                credentials: "include",
                headers: at ? { Authorization: `${at}` } : {},
            });

            if (!res.ok) {
                setUser(null);
                return;
            }

            const json = await res.json().catch(() => null);
            const u = json?.data ?? json; // 래핑/비래핑 모두 대응
            setUser(u);
            localStorage.setItem("cm-auth", JSON.stringify(u));
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // 앱 시작 시 최신 정보로 동기화
    useEffect(() => {
        refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({ user, loading, tokens, login, logout, authFetch, refreshUser }), // ✅ refreshUser 추가
        [user, loading, tokens]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
