import { useState } from "react";
import {useAuth} from "../hooks/useAuth.ts";

export default function ManagerVerify() {
    const [facilityName, setFacilityName] = useState("");
    const [facilityAddress, setFacilityAddress] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [done, setDone] = useState(false);
    const { authFetch } = useAuth()

    const submit = async () => {
        if (!file) return alert("사업자등록증 파일을 업로드하세요.");

        const form = new FormData();
        form.append("facilityName", facilityName);
        form.append("facilityAddress", facilityAddress);
        form.append("file", file);

        const res = await authFetch("http://localhost:8080/admin/verify/request", {
            method: "POST",
            body: form,
        });

        if (res.ok) setDone(true);
        else alert("오류 발생");
    };

    if (done)
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-semibold mb-3">인증 요청 완료</h2>
                <p>운영자가 서류 확인 후 승인하면 관리자 기능을 이용할 수 있습니다.</p>
            </div>
        );

    return (
        <div className="max-w-lg mx-auto mt-12 p-6 rounded-xl border shadow bg-white">
            <h2 className="text-xl font-bold mb-5">관리자 인증 (요양원 본인확인)</h2>

            <label className="block text-sm mb-1">요양원 이름</label>
            <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="예: 미소드림재가노인복지센터"
            />

            <label className="block text-sm mb-1">요양원 주소</label>
            <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={facilityAddress}
                onChange={(e) => setFacilityAddress(e.target.value)}
                placeholder="예: 서울 종로구 율곡로 432"
            />

            <label className="block text-sm mb-1">사업자등록증 업로드</label>
            <input
                type="file"
                className="w-full border rounded px-3 py-2 mb-4"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <button
                onClick={submit}
                className="w-full py-2 bg-slate-900 text-white rounded hover:bg-slate-700"
            >
                인증 요청하기
            </button>
        </div>
    );
}
