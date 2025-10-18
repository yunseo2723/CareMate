import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

type Facility = {
    id: number;
    name: string;
    phone?: string;
    communityUrl?: string;
};

type ResponseDTO<T> = {
    code: string;
    message: string;
    data: T;
};

    export default function AdminFacilityPage() {
        const { user, authFetch } = useAuth();

        // ✅ /users/me 의 adminCareMateIds 로 관리자 여부 판별
        const adminIds = user?.adminCareMateIds ?? [];
        const isAdmin = adminIds.length > 0;

    // 여러 시설을 관리할 수도 있으니 선택 가능하게
    const [selectedId, setSelectedId] = useState<number | "">(
        adminIds.length ? adminIds[0] : ""
    );

    const [facility, setFacility] = useState<Facility | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const hasSelection = useMemo(
        () => typeof selectedId === "number" && selectedId > 0,
        [selectedId]
    );

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!isAdmin || !hasSelection) {
                setFacility(null);
                return;
            }
            setLoading(true);
            setErr(null);
            try {
                // 보호 리소스이므로 authFetch 사용 (Authorization 헤더 자동 첨부)
                const res = await authFetch(`http://localhost:8080/caremates/${selectedId}`, {
                    method: "GET",
                });

                if (!res.ok) {
                    // ⛳ API가 아직 없을 수도 있으니, 실패 시엔 폴백 메시지로 처리
                    const text = await res.text().catch(() => "");
                    throw new Error(text || `시설 정보를 불러오지 못했습니다. (HTTP ${res.status})`);
                }

                // ResponseDTO<T> 혹은 T 자체 모두 대응
                const ct = res.headers.get("content-type") || "";
                if (ct.includes("application/json")) {
                    const json = (await res.json()) as Facility | ResponseDTO<Facility>;
                    const data = (json as ResponseDTO<Facility>).data ?? (json as Facility);
                    if (!cancelled) setFacility(data);
                } else {
                    const text = await res.text();
                    try {
                        const json = JSON.parse(text) as Facility | ResponseDTO<Facility>;
                        const data = (json as ResponseDTO<Facility>).data ?? (json as Facility);
                        if (!cancelled) setFacility(data);
                    } catch {
                        throw new Error("알 수 없는 응답 형식입니다.");
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [isAdmin, hasSelection, selectedId, authFetch]);

    if (!isAdmin) return <div>관리자 권한이 없습니다.</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">시설 관리</h2>

            {/* 관리 중인 시설 선택 */}
            <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">관리 시설 선택:</label>
                <select
                    className="rounded-md border px-2 py-2 text-sm"
                    value={String(selectedId)}
                    onChange={(e) => {
                        const v = e.target.value;
                        setSelectedId(v === "" ? "" : Number(v));
                    }}
                >
                    {adminIds.map((id) => (
                        <option key={id} value={id}>
                            #{id}
                        </option>
                    ))}
                </select>
            </div>

            {/* 상세 */}
            {loading ? (
                <div className="text-sm text-slate-600">불러오는 중…</div>
            ) : err ? (
                // ⛳ 상세 API가 아직 없을 때도 여기로 떨어질 수 있음 (폴백 안내)
                <div className="rounded-lg border p-4 text-sm">
                    <div className="font-medium mb-1">시설 ID: #{selectedId}</div>
                    <div className="text-slate-600">
                        상세 정보를 불러오지 못했습니다. 시설 ID만 표시합니다.
                    </div>
                    {err && <div className="mt-2 text-red-600">사유: {err}</div>}
                </div>
            ) : facility ? (
                <div className="rounded-lg border p-4">
                    <div className="font-medium">{facility.name}</div>
                    {facility.phone && (
                        <div className="text-sm text-slate-600">전화: {facility.phone}</div>
                    )}
                    {facility.communityUrl && (
                        <a
                            href={facility.communityUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-sm text-blue-600 underline"
                        >
                            커뮤니티 페이지로 이동
                        </a>
                    )}
                </div>
            ) : (
                <div className="rounded-lg border p-4 text-sm">
                    <div className="font-medium mb-1">시설 ID: #{selectedId}</div>
                    <div className="text-slate-600">시설 상세가 없습니다.</div>
                </div>
            )}
        </div>
    );
}
