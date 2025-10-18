import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !pw) return;

        try {
            setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">로그인</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="mb-1 block text-sm">이메일</label>
                    <input
                        type="email"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm">비밀번호</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>
            </form>
            <div className="mt-3 text-center text-sm text-slate-600">
                계정이 없나요? <Link to="/signup" className="underline">회원가입</Link>
            </div>
        </div>
    );
}
