import { useNavigate } from "react-router-dom";

type Item = {
    instCode: string;
    kindCode: string;
    name: string;
    address: string;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[520px] rounded-2xl p-6 space-y-5
                      max-h-[80vh] overflow-y-auto shadow-lg">

                <h3 className="text-lg font-semibold">AI 추천 결과</h3>

                <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">요구 정리</span>
                    <span className="ml-1">· {normalizedNeed}</span>
                </p>

                <div className="space-y-3">
                    {items.map((it) => (
                        <div
                            key={it.instCode}
                            className="rounded-xl border p-4 cursor-pointer
                         hover:border-slate-400 hover:bg-slate-50 transition"
                            onClick={() =>
                                navigate(`/facility/${it.instCode}?kindCode=${it.kindCode}`)
                            }
                        >
                            <div className="font-semibold">{it.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                {it.address}
                            </div>
                            <div className="text-sm mt-2 text-slate-700">
                                {it.reason}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        className="rounded-lg border px-4 py-2 text-sm
                       hover:bg-slate-50 transition"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
