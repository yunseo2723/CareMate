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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[420px] space-y-4">
                <h2 className="text-xl font-bold">검색 조건 상세</h2>

                <ul className="text-sm space-y-1">
                    <li>📍 위치: {filter.center}</li>
                    <li>📏 반경: {filter.radiusKm}km</li>
                    <li>🏷 유형: {filter.careLevel}</li>
                    <li>⭐ 등급: {filter.gradeFilter}</li>
                    <li>👩‍⚕️ 요양보호사: {filter.minCaregiver}명 이상</li>
                    <li>🛏 병실: {filter.roomTypes?.join(", ")}</li>
                    <li>🎵 프로그램: {filter.programTypes?.join(", ")}</li>
                </ul>

                <div className="text-right">
                    <button className="border px-4 py-2 rounded" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
