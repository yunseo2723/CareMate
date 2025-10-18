import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function PasswordPage(){
    const { authFetch } = useAuth();
    const [cur,setCur]=useState(""); const [n1,setN1]=useState(""); const [n2,setN2]=useState("");

    const onChange = async ()=>{
        if(n1!==n2) return alert("새 비밀번호가 일치하지 않습니다.");
        const res = await authFetch("http://localhost:8080/users/me/password",{
            method:"POST", headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ currentPassword:cur, newPassword:n1 })
        });
        if(res.ok) alert("변경되었습니다."); else alert(await res.text());
    };

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">비밀번호 변경</h2>
            <input className="w-full h-10 rounded-md border px-3" type="password" placeholder="현재 비밀번호" value={cur} onChange={e=>setCur(e.target.value)} />
            <input className="w-full h-10 rounded-md border px-3" type="password" placeholder="새 비밀번호" value={n1} onChange={e=>setN1(e.target.value)} />
            <input className="w-full h-10 rounded-md border px-3" type="password" placeholder="새 비밀번호 확인" value={n2} onChange={e=>setN2(e.target.value)} />
            <button onClick={onChange} className="rounded-md bg-slate-900 text-white px-4 h-10">변경</button>
        </div>
    );
}