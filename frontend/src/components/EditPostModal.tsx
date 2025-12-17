/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
    open: boolean;
    onClose: () => void;
    post: any;
    instCode: string;
    kindCode: string;
    onUpdated: () => void;
};

export default function EditPostModal({open, onClose, post, instCode, kindCode, onUpdated,}: Props) {
    const { authFetch } = useAuth();
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const save = async () => {
        setLoading(true);
        await authFetch(
            `http://localhost:8080/facility/${instCode}/${kindCode}/post/${post.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            }
        );
        setLoading(false);
        onUpdated();
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
            <div className="bg-white w-[600px] rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">게시글 수정</h2>

                <input
                    className="w-full border rounded px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                />

                <textarea
                    className="w-full border rounded px-3 py-2 h-40 resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용"
                />

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        className="px-4 py-2 border rounded"
                        onClick={onClose}
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-lime-600 text-white rounded"
                        onClick={save}
                        disabled={loading}
                    >
                        {loading ? "저장 중..." : "수정 완료"}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    );
}
