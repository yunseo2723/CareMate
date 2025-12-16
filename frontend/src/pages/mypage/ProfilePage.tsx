import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user, authFetch, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name ?? "");
    const [nickname, setNickname] = useState(user?.nickname ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");

    useEffect(() => {
        setName(user?.name ?? "");
        setNickname(user?.nickname ?? "");
        setPhone(user?.phone ?? "");
    }, [user]);

    const onSave = async () => {
        const res = await authFetch("http://localhost:8080/users/me/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, nickname, phone }),
        });
        if (res.ok) {
            alert("저장되었습니다.");
            refreshUser?.();
        } else {
            alert(await res.text());
        }
    };

    return (
        <div className="max-w-4xl space-y-6">

            {/* 페이지 타이틀 */}
            <div>
                <h2 className="text-xl font-semibold tracking-tight">내 프로필</h2>
                <p className="text-sm text-slate-500 mt-1">
                    개인 정보를 수정하고 계정을 관리할 수 있습니다.
                </p>
            </div>

            {/* 프로필 카드 */}
            <div className="rounded-2xl border bg-white p-6 space-y-6">

                <div className="grid gap-5 md:grid-cols-2">

                    {/* 이름 */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            이름
                        </label>
                        <input
                            className="w-full h-11 rounded-lg border px-3
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* 닉네임 */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            닉네임
                        </label>
                        <input
                            className="w-full h-11 rounded-lg border px-3
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    {/* 이메일 */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            이메일
                        </label>
                        <input
                            disabled
                            className="w-full h-11 rounded-lg border px-3
                         bg-slate-50 text-slate-500 cursor-not-allowed"
                            value={user?.username ?? ""}
                        />
                        <p className="text-xs text-slate-400">
                            이메일은 수정할 수 없습니다.
                        </p>
                    </div>

                    {/* 연락처 */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            연락처
                        </label>
                        <input
                            className="w-full h-11 rounded-lg border px-3
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-0000-0000"
                        />
                    </div>
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={onSave}
                        className="rounded-xl bg-slate-900 px-6 py-2.5
                       text-white font-semibold
                       hover:bg-slate-800 transition"
                    >
                        변경 사항 저장
                    </button>
                </div>
            </div>
        </div>
    );
}
