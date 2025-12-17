import React, {useCallback, useEffect, useMemo, useState} from "react";
import { AuthContext, type User, type Tokens, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens>({ accessToken: null, refreshToken: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("cm-auth");
            const rawTokens = localStorage.getItem("cm-tokens");
            if (rawUser) setUser(JSON.parse(rawUser));
            if (rawTokens) setTokens(JSON.parse(rawTokens));
        } finally {
            // refreshUser 쪽에서 최종 false로 내림
        }
    }, []);

    const login = useCallback((u: User, t: Tokens) => {
        setUser(u);
        setTokens(t);
        localStorage.setItem("cm-auth", JSON.stringify(u));
        localStorage.setItem("cm-tokens", JSON.stringify(t));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setTokens({ accessToken: null, refreshToken: null });
        localStorage.removeItem("cm-auth");
        localStorage.removeItem("cm-tokens");
    }, []);

    const authFetch: AuthContextValue["authFetch"] = useCallback(
        (input, init = {}) => {
        const headers = new Headers(init.headers || {});
        const at = tokens.accessToken || JSON.parse(localStorage.getItem("cm-tokens") || "null")?.accessToken || null;
        if (at) headers.set("Authorization", `${at}`);
        return fetch(input, { ...init, headers, credentials: init.credentials ?? "include" });
    },
        [tokens.accessToken]
    );

    const refreshUser = useCallback(async () => {
        setLoading(true);
        try {
            const at = tokens.accessToken || JSON.parse(localStorage.getItem("cm-tokens") || "null")?.accessToken || null;

            if (!at) {               // ✅ 토큰 없으면 호출 안 함
                setUser(null);
                return;
            }

            const res = await fetch("https://caremate-fmp1.onrender.com/users/me", {
                credentials: "include",
                headers: at ? { Authorization: `${at}` } : {},
            });
            if (!res.ok) { setUser(null); return; }
            const json = await res.json().catch(() => null);
            const u = json?.data ?? json;
            setUser(u);
            localStorage.setItem("cm-auth", JSON.stringify(u));
        } finally {
            setLoading(false);
        }
    }, [tokens.accessToken]);

    useEffect(() => {
        void refreshUser();
    }, [refreshUser]);

    const value = useMemo(
        () => ({ user, loading, tokens, login, logout, authFetch, refreshUser }),
        [user, loading, tokens, login, logout, authFetch, refreshUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
