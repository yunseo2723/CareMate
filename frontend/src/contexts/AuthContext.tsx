import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
    username: string;   // 이메일
    nickname?: string;
    name?: string;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 앱 시작 시 localStorage에서 복원
    useEffect(() => {
        try {
            const raw = localStorage.getItem("cm-auth");
            if (raw) setUser(JSON.parse(raw));
        } catch {}
        setLoading(false);
    }, []);

    const login = (u: User) => {
        setUser(u);
        localStorage.setItem("cm-auth", JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("cm-auth");
        // 세션/쿠키 쓰면 서버 로그아웃도 호출 (선택)
        // fetch("http://localhost:8080/users/logout", { method:"POST", credentials:"include" }).catch(()=>{});
    };

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
