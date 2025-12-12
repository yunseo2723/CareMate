// src/components/EditFilterModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../hooks/useAuth";
import type { SavedFilter } from "../types/savedFilter";

export default function EditFilterModal({
                                            filter,
                                            onClose,
                                            onSaved,
                                        }: {
    filter: SavedFilter;
    onClose: () => void;
    onSaved: () => void;
}) {
    const { authFetch } = useAuth();
    const [name, setName] = useState(filter.name);

    const save = async () => {
        await authFetch(`http://localhost:8080/filters/${filter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        alert("수정되었습니다");
        onClose();
        onSaved();
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white p-5 rounded w-80 space-y-4">
                <h3 className="font-semibold text-lg">필터 이름 수정</h3>

                <input
                    className="border p-2 w-full rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>취소</button>
                    <button
                        className="bg-blue-600 text-white px-3 py-2 rounded"
                        onClick={save}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    );
}
