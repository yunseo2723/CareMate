/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/FilterPreviewModal.tsx

export default function FilterPreviewModal({
                                               filter,
                                               onClose,
                                           }: {
    filter: any;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                {/* 헤더 */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold">검색 조건 상세</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        저장된 검색 조건 요약입니다
                    </p>
                </div>

                {/* 내용 */}
                <div className="space-y-4 text-sm">
                    {/* 위치 */}
                    <Item
                        icon="📍"
                        label="위치"
                        value={filter.center}
                    />

                    {/* 반경 */}
                    <Item
                        icon="📏"
                        label="검색 반경"
                        value={`${filter.radiusKm}km`}
                    />

                    {/* 유형 */}
                    <Item
                        icon="🏷"
                        label="유형"
                        value={filter.careLevel}
                    />

                    {/* 등급 */}
                    <Item
                        icon="⭐"
                        label="평가 등급"
                        value={filter.gradeFilter}
                    />

                    {/* 요양보호사 */}
                    <Item
                        icon="👩‍⚕️"
                        label="요양보호사"
                        value={`${filter.minCaregiver}명 이상`}
                    />

                    {/* 병실 */}
                    {filter.roomTypes?.length > 0 && (
                        <TagSection
                            icon="🛏"
                            label="병실 / 시설"
                            items={filter.roomTypes}
                        />
                    )}

                    {/* 프로그램 */}
                    {filter.programTypes?.length > 0 && (
                        <TagSection
                            icon="🎵"
                            label="프로그램"
                            items={filter.programTypes}
                        />
                    )}
                </div>

                {/* 버튼 */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-sm
                       hover:bg-slate-50 transition"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===================== 서브 컴포넌트 ===================== */

function Item({
                  icon,
                  label,
                  value,
              }: {
    icon: string;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-lg">{icon}</div>
            <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="font-medium text-slate-900">{value}</div>
            </div>
        </div>
    );
}

function TagSection({
                        icon,
                        label,
                        items,
                    }: {
    icon: string;
    label: string;
    items: string[];
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-lg">{icon}</div>
            <div>
                <div className="text-xs text-slate-500 mb-1">{label}</div>
                <div className="flex flex-wrap gap-2">
                    {items.map((it: string) => (
                        <span
                            key={it}
                            className="rounded-full border bg-slate-50
                         px-3 py-1 text-xs font-medium text-slate-700"
                        >
              {it}
            </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
