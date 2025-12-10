import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {useAuth} from "../../hooks/useAuth.ts";

export default function PostWrite() {
    const { instCode } = useParams();
    const [params] = useSearchParams();
    const boardType = params.get("type") ?? "FREE";
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [allowComment, setAllowComment] = useState(true);
    const { authFetch } = useAuth()

    const submit = async () => {
        await authFetch(`http://localhost:8080/facility/${instCode}/post`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                content,
                boardType,
                allowComment
            })
        });

        alert("등록되었습니다!");
        navigate(`/facility/${instCode}/community`);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-xl font-bold">글쓰기</h1>

            <input
                className="border p-2 w-full"
                placeholder="제목"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <textarea
                className="border p-2 w-full h-60"
                placeholder="내용 입력"
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={allowComment}
                    onChange={e => setAllowComment(e.target.checked)}
                />
                댓글 허용
            </label>

            <button
                onClick={submit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                등록
            </button>
        </div>
    );
}
