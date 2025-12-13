import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

type FacilityInfo = {
    instCode: string;
    name: string;
    phone?: string;
    address?: string;
    admins: { userId: number; name: string; email: string }[];
};

export default function AdminFacilityPage() {
    const { user, authFetch } = useAuth();

    // 🔥 User에서 관리자 InstCode 목록 가져오기
    const adminFacilities = user?.adminFacilities ?? [];
    const isAdmin = adminFacilities.length > 0;

    const [selectedInstCode, setSelectedInstCode] = useState<string>(
        adminFacilities.length ? adminFacilities[0].instCode : ""
    );

    const [selectedKindCode] = useState<string>(
        adminFacilities.length ? adminFacilities[0].kindCode : ""
    );

    const [facility, setFacility] = useState<FacilityInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedInstCode) return;

        setLoading(true);
        setErr(null);

        authFetch(`http://localhost:8080/facility/admin/${selectedInstCode}/info`)
            .then(r => r.json())
            .then(setFacility)
            .catch(e => setErr(e.message))
            .finally(() => setLoading(false));
    }, [selectedInstCode]);

    if (!isAdmin)
        return <div className="p-4 text-red-600">관리자 권한이 없습니다.</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">시설 관리</h2>

            {/* 시설 선택 */}
            <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">관리 시설 선택:</label>

                <select
                    className="rounded-md border px-3 py-2"
                    value={selectedInstCode}
                    onChange={(e) => setSelectedInstCode(e.target.value)}
                >
                    {adminFacilities.map((fac) => (
                        <option key={fac.instCode} value={fac.instCode}>
                            {fac.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 상세 */}
            {loading && <div className="text-sm">불러오는 중...</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}

            {facility && (
                <div className="rounded-lg border p-4 space-y-2">
                    <div className="text-lg font-bold">{facility.name}</div>
                    <div className="text-sm text-slate-600">
                        주소: {facility.address}
                    </div>
                    <div className="text-sm text-slate-600">
                        전화번호: {facility.phone ?? "-"}
                    </div>
                    <div className="mt-3">
                        <div className="font-semibold mb-1">관리자 목록</div>
                        {facility.admins.length === 0 ? (
                            <div className="text-sm text-slate-500">현재 관리자 없음</div>
                        ) : (
                            <ul className="list-disc ml-5 text-sm">
                                {facility.admins.map((a) => (
                                    <li key={a.userId}>
                                        {a.name} ({a.email})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <a
                        href={`/facility/${selectedInstCode}/${selectedKindCode}/community`}
                        className="inline-block mt-3 text-blue-600 underline"
                    >
                        커뮤니티 페이지로 이동
                    </a>
                </div>
            )}
        </div>
    );
}
