import {useCallback, useEffect, useState} from "react";

type VerifyRow = {
    id: number;
    facilityName: string;
    facilityAddress: string;
    businessDocUrl: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    instCode?: string;
    rejectReason?: string;
    createdAt: string;
};

export default function AdminVerifyList() {
    const [rows, setRows] = useState<VerifyRow[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("https://caremate-fmp1.onrender.com/admin/verify/list");
            const data = await res.json();
            setRows(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const approve = async (id: number) => {
        const inst = prompt("해당 요양원의 instCode를 입력하세요.");
        if (!inst) return;

        await fetch("https://caremate-fmp1.onrender.com/admin/verify/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, instCode: inst }),
        });

        alert("승인 완료");
        await load();
    };

    const reject = async (id: number) => {
        const reason = prompt("반려 사유 입력");
        if (!reason) return;

        await fetch("https://caremate-fmp1.onrender.com/admin/verify/reject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, reason }),
        });

        alert("반려 처리됨");
        await load();
    };

    if (loading) return <div className="p-10">불러오는 중...</div>;

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-6">관리자 인증 요청 목록</h2>

            <table className="w-full border text-sm">
                <thead>
                <tr className="bg-gray-200">
                    <th className="p-2">ID</th>
                    <th className="p-2">요양원명</th>
                    <th className="p-2">주소</th>
                    <th className="p-2">첨부 서류</th>
                    <th className="p-2">상태</th>
                    <th className="p-2">instCode</th>
                    <th className="p-2">처리</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((r) => (
                    <tr key={r.id} className="border-t">
                        <td className="p-2">{r.id}</td>

                        <td className="p-2 font-medium">{r.facilityName}</td>

                        <td className="p-2">{r.facilityAddress}</td>

                        <td className="p-2">
                            <a
                                href={r.businessDocUrl}
                                target="_blank"
                                className="text-lime-600 underline"
                            >
                                서류 보기
                            </a>
                        </td>

                        <td className="p-2">
                            {r.status === "PENDING" && (
                                <span className="text-yellow-600 font-semibold">
                                        대기중
                                    </span>
                            )}
                            {r.status === "APPROVED" && (
                                <span className="text-green-600 font-semibold">
                                        승인됨
                                    </span>
                            )}
                            {r.status === "REJECTED" && (
                                <span className="text-red-600 font-semibold">
                                        반려됨
                                    </span>
                            )}
                        </td>

                        <td className="p-2">{r.instCode ?? "-"}</td>

                        <td className="p-2">
                            {r.status === "PENDING" && (
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                        onClick={() => approve(r.id)}
                                    >
                                        승인
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                        onClick={() => reject(r.id)}
                                    >
                                        반려
                                    </button>
                                </div>
                            )}

                            {r.status === "REJECTED" && (
                                <div className="text-xs text-red-500">
                                    사유: {r.rejectReason ?? "없음"}
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
