// src/components/SaveFilterModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { createPortal } from "react-dom";
import { useSearch } from "../hooks/useSearch";

export default function SaveFilterModal({
                                          filter,
                                          editingId,
                                        }: {
  filter: any;
  editingId?: number | null;
}) {
  const { authFetch } = useAuth();
  const { setEditingFilterId } = useSearch();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const openModal = () => {
    setOpen(true);
  };

  const save = async () => {
    if (!name.trim()) {
      alert("필터 이름을 입력해주세요");
      return;
    }

    if (editingId) {
      // 🔧 수정
      await authFetch(`http://localhost:8080/filters/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          filter,
        }),
      });

      setEditingFilterId(null); // ⭐ 중요
    } else {
      // 🆕 신규 저장
      await authFetch("http://localhost:8080/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          filter,
        }),
      });
    }

    alert(editingId ? "수정되었습니다" : "저장되었습니다");
    setOpen(false);
    setName("");
    setEditingFilterId(null);
  };

  return (
      <>
        <button
            className="flex-1 border py-2 rounded text-sm hover:bg-gray-50"
            onClick={openModal}
        >
          {editingId ? "수정 저장" : "현재 검색 조건 저장"}
        </button>

        {open &&
            createPortal(
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                  <div className="bg-white p-6 rounded-xl w-[360px] space-y-4">
                    <h3 className="text-lg font-bold">
                      {editingId ? "검색 조건 수정" : "검색 조건 저장"}
                    </h3>

                    <input
                        className="border p-2 w-full rounded"
                        placeholder="예) 치매전문"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="flex justify-end gap-2">
                      <button onClick={() => setOpen(false)}>취소</button>
                      <button
                          className="bg-lime-600 text-white px-4 py-2 rounded"
                          onClick={save}
                      >
                        {editingId ? "수정 완료" : "저장"}
                      </button>
                    </div>
                  </div>
                </div>,
                document.getElementById("modal-root")!
            )}
      </>
  );
}
