import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ManagerVerify() {
    const [facilityName, setFacilityName] = useState("");
    const [facilityAddress, setFacilityAddress] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [done, setDone] = useState(false);
    const { authFetch } = useAuth();

    const submit = async () => {
        if (!file) return alert("사업자등록증 파일을 업로드하세요.");

        const form = new FormData();
        form.append("facilityName", facilityName);
        form.append("facilityAddress", facilityAddress);
        form.append("file", file);

        const res = await authFetch(
            "https://caremate-fmp1.onrender.com/admin/verify/request",
            {
                method: "POST",
                body: form,
            }
        );

        if (res.ok) setDone(true);
        else alert("오류가 발생했습니다.");
    };

    /* ===================== 완료 화면 ===================== */

    if (done) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="max-w-md w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
                    <div className="text-4xl mb-4">✅</div>
                    <h2 className="text-xl font-bold mb-2">인증 요청이 접수되었습니다</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        운영자가 서류를 확인한 뒤<br />
                        관리자 권한이 승인됩니다.
                    </p>

                    <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                        ✔ 승인까지는 보통 <b>1~2영업일</b>이 소요됩니다
                    </div>
                </div>
            </div>
        );
    }

    /* ===================== 입력 화면 ===================== */

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
                {/* 헤더 */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">관리자 인증</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        요양원 운영자 본인 확인을 위한 절차입니다
                    </p>
                </div>

                {/* 폼 */}
                <div className="space-y-5">
                    {/* 요양원 이름 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            요양원 이름
                        </label>
                        <input
                            className="w-full rounded-lg border px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-lime-600"
                            value={facilityName}
                            onChange={(e) => setFacilityName(e.target.value)}
                            placeholder="예: ㅇㅇ요양원"
                        />
                    </div>

                    {/* 주소 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            요양원 주소
                        </label>
                        <input
                            className="w-full rounded-lg border px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={facilityAddress}
                            onChange={(e) => setFacilityAddress(e.target.value)}
                            placeholder="예: 서울특별시 강남구"
                        />
                    </div>

                    {/* 파일 업로드 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            사업자등록증 업로드
                        </label>

                        <label
                            className="flex flex-col items-center justify-center
                         rounded-xl border-2 border-dashed
                         border-slate-300 bg-slate-50
                         px-4 py-6 cursor-pointer
                         hover:bg-slate-100 transition"
                        >
                            <div className="text-2xl mb-2">📎</div>
                            <div className="text-sm text-slate-700">
                                {file ? file.name : "파일을 선택하세요 (이미지 / PDF)"}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                        </label>
                    </div>
                </div>

                {/* 버튼 */}
                <button
                    onClick={submit}
                    className="mt-6 w-full rounded-lg bg-lime-600 py-2.5
                     text-white font-medium
                     hover:bg-lime-500 transition"
                >
                    인증 요청하기
                </button>

                {/* 안내 */}
                <p className="mt-4 text-xs text-slate-500 text-center">
                    제출된 서류는 관리자 확인 용도로만 사용됩니다
                </p>
            </div>
        </div>
    );
}
