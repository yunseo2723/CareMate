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

    const adminFacilities = user?.adminFacilities ?? [];
    const isAdmin = adminFacilities.length > 0;

    const [selectedInstCode, setSelectedInstCode] = useState(
        adminFacilities.length ? adminFacilities[0].instCode : ""
    );

    const [selectedKindCode] = useState(
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
    }, [authFetch, selectedInstCode]);

    if (!isAdmin)
        return (
            <div className="rounded-xl border bg-white p-6 text-red-600">
                관리자 권한이 없습니다.
            </div>
        );

    return (
        <div className="max-w-4xl space-y-6">

            {/* 페이지 타이틀 */}
            <div>
                <h2 className="text-xl font-semibold tracking-tight">
                    시설 관리
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    관리 중인 요양원 정보를 확인하고 커뮤니티를 관리할 수 있습니다.
                </p>
            </div>

            {/* 시설 선택 카드 */}
            <div className="rounded-2xl border bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="text-sm font-medium text-slate-700">
                        관리 시설 선택
                    </label>
                    <select
                        className="rounded-lg border px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
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
            </div>

            {/* 상태 */}
            {loading && (
                <div className="text-sm text-slate-500">
                    시설 정보를 불러오는 중입니다…
                </div>
            )}
            {err && (
                <div className="text-sm text-red-600">
                    {err}
                </div>
            )}

            {/* 시설 상세 카드 */}
            {facility && (
                <div className="rounded-2xl border bg-white p-6 space-y-5">

                    {/* 시설 기본 정보 */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            {facility.name}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                            <div>주소 · {facility.address ?? "-"}</div>
                            <div>전화번호 · {facility.phone ?? "-"}</div>
                        </div>
                    </div>

                    {/* 관리자 목록 */}
                    <div>
                        <h4 className="font-semibold mb-2">
                            관리자 목록
                        </h4>
                        {facility.admins.length === 0 ? (
                            <div className="text-sm text-slate-500">
                                현재 등록된 관리자가 없습니다.
                            </div>
                        ) : (
                            <ul className="space-y-1 text-sm text-slate-700">
                                {facility.admins.map((a) => (
                                    <li key={a.userId} className="flex gap-2">
                                        <span className="font-medium">{a.name}</span>
                                        <span className="text-slate-500">
                      ({a.email})
                    </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 커뮤니티 이동 */}
                    <div className="pt-4 border-t">
                        <a
                            href={`/facility/${selectedInstCode}/${selectedKindCode}/community`}
                            className="inline-flex items-center gap-2 rounded-xl
                         bg-lime-600 px-5 py-2.5 text-sm
                         font-semibold text-white
                         hover:bg-lime-500 transition"
                        >
                            커뮤니티 페이지로 이동 →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
