import { useAuth } from "../../hooks/useAuth";
import {useEffect, useState} from "react";

export default function ProfilePage(){
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
        const res = await authFetch("http://localhost:8080/users/me", {
            method:"PATCH",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ name, nickname, phone }),
        });
        if (res.ok){ alert("저장되었습니다."); refreshUser?.(); }
        else { alert(await res.text()); }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">내 프로필</h2>
            <div className="grid gap-3 md:grid-cols-2">
                <div>
                    <label className="block text-sm mb-1">이름</label>
                    <input className="w-full h-10 rounded-md border px-3"
                           value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">닉네임</label>
                    <input className="w-full h-10 rounded-md border px-3"
                           value={nickname} onChange={e=>setNickname(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">이메일 (수정불가)</label>
                    <input disabled className="w-full h-10 rounded-md border px-3 bg-slate-50"
                           value={user?.username ?? ""} />
                </div>
                <div>
                    <label className="block text-sm mb-1">연락처</label>
                    <input className="w-full h-10 rounded-md border px-3"
                           value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>
            </div>
            <button onClick={onSave} className="rounded-md bg-slate-900 text-white px-4 h-10">저장</button>
        </div>
    );
}