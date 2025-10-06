import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pw !== pw2) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        // TODO: API 연동
        console.log({ name, email, pw });
        nav("/login"); // 가입 완료 후 로그인 이동 가정
    };

    return (
        <div className="mx-auto max-w-md rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">회원가입</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="mb-1 block text-sm">이름</label>
                    <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                        minLength={6}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm">비밀번호 확인</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={pw2}
                        onChange={(e) => setPw2(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                >
                    가입하기
                </button>
            </form>
            <div className="mt-3 text-center text-sm text-slate-600">
                이미 계정이 있나요? <Link to="/login" className="underline">로그인</Link>
            </div>
        </div>
    );
}
