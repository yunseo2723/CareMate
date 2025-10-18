import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AUTH_CARD =
    "mx-auto w-full max-w-xl md:max-w-2xl rounded-2xl border bg-white p-8 shadow-sm";
const INPUT = "w-full rounded-md border px-3 h-11 text-base";
const PRIMARY_BTN =
    "w-full rounded-md bg-slate-900 h-11 text-base font-medium text-white hover:opacity-90 disabled:opacity-50";

export default function Login() {
    const nav = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !pw) return;

        try {
            // x-www-form-urlencoded 바디 구성
            const params = new URLSearchParams();
            params.set("username", email);
            params.set("password", pw);

            const res = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                credentials: "include", // 세션/쿠키 사용 시 필요
                body: params.toString(),
            });

            if (res.ok) {
                login({ username: email });
                alert("로그인에 성공했습니다.");
                nav("/"); // 홈으로 이동
            } else {
                const msg = await res.text().catch(() => "");
                // 401/403 등 실패 대응
                alert(msg || "이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
        }
    };

    return (
        <div className={AUTH_CARD}>
            <h2 className="mb-6 text-2xl font-semibold">로그인</h2>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm">이메일</label>
                    <input
                        type="email"
                        className={INPUT}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm">비밀번호</label>
                    <input
                        type="password"
                        className={INPUT}
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={PRIMARY_BTN}>
                    로그인
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
                계정이 없나요? <Link to="/signup" className="underline">회원가입</Link>
            </div>
        </div>
    );
}