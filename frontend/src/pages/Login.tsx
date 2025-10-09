import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 연동
        console.log({ email, pw });
        nav("/"); // 로그인 성공 가정
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
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                >
                    로그인
                </button>
            </form>
            <div className="mt-3 text-center text-sm text-slate-600">
                계정이 없나요? <Link to="/signup" className="underline">회원가입</Link>
            </div>
        </div>
    );
}
