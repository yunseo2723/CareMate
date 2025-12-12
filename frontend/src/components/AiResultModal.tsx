import { useNavigate } from "react-router-dom";

type Item = {
    instCode: string;
    kindCode: string;
    name: string;
    address: string; // fullRoadNm
    reason: string;
};

export default function AiResultModal({
                                          open,
                                          onClose,
                                          normalizedNeed,
                                          items,
                                      }: {
    open: boolean;
    onClose: () => void;
    normalizedNeed: string;
    items: Item[];
}) {
    const navigate = useNavigate();
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white w-[520px] rounded-xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold">AI 추천 결과</h3>

                <p className="text-sm text-gray-600">
                    <b>요구 정리:</b> {normalizedNeed}
                </p>

                <div className="space-y-3">
                    {items.map((it) => (
                        <div
                            key={it.instCode}
                            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/facility/${it.instCode}?kindCode=${it.kindCode}`)}
                        >
                            <div className="font-semibold">{it.name}</div>
                            <div className="text-xs text-gray-500">{it.address}</div>
                            <div className="text-sm mt-1">{it.reason}</div>
                        </div>
                    ))}
                </div>

                <div className="text-right">
                    <button
                        className="px-4 py-2 border rounded-md"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
