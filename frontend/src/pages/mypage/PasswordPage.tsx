import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function PasswordPage() {
    const { authFetch } = useAuth();
    const [cur, setCur] = useState("");
    const [n1, setN1] = useState("");
    const [n2, setN2] = useState("");

    const onChange = async () => {
        if (n1 !== n2) return alert("새 비밀번호가 일치하지 않습니다.");
        const res = await authFetch("http://localhost:8080/users/me/password", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword: cur, newPassword: n1 }),
        });
        if (res.ok) alert("비밀번호가 변경되었습니다.");
        else alert(await res.text());
    };

    return (
        <div className="max-w-3xl space-y-6">

            {/* 타이틀 */}
            <div>
                <h2 className="text-xl font-semibold tracking-tight">
                    비밀번호 변경
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    보안을 위해 주기적으로 비밀번호를 변경해 주세요.
                </p>
            </div>

            {/* 카드 */}
            <div className="rounded-2xl border bg-white p-6 space-y-6">

                {/* 현재 비밀번호 */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        현재 비밀번호
                    </label>
                    <input
                        type="password"
                        className="w-full h-11 rounded-lg border px-3
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={cur}
                        onChange={(e) => setCur(e.target.value)}
                        placeholder="현재 비밀번호 입력"
                    />
                </div>

                {/* 새 비밀번호 */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        새 비밀번호
                    </label>
                    <input
                        type="password"
                        className="w-full h-11 rounded-lg border px-3
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={n1}
                        onChange={(e) => setN1(e.target.value)}
                        placeholder="새 비밀번호 입력"
                    />
                    <p className="text-xs text-slate-400">
                        영문, 숫자, 특수문자를 포함해 8자 이상을 권장합니다.
                    </p>
                </div>

                {/* 새 비밀번호 확인 */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        새 비밀번호 확인
                    </label>
                    <input
                        type="password"
                        className="w-full h-11 rounded-lg border px-3
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={n2}
                        onChange={(e) => setN2(e.target.value)}
                        placeholder="새 비밀번호 다시 입력"
                    />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={onChange}
                        className="rounded-xl bg-slate-900 px-6 py-2.5
                       text-white font-semibold
                       hover:bg-slate-800 transition"
                    >
                        비밀번호 변경
                    </button>
                </div>
            </div>
        </div>
    );
}
