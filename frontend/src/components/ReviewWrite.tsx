// src/components/review/ReviewWrite.tsx
import { useState } from "react";
import StarRating from "./StarRating";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";

export default function ReviewWrite() {
    const { instCode, kindCode } = useParams();
    const { authFetch } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);

    const submit = async () => {
        await authFetch(`http://localhost:8080/facility/${instCode}/${kindCode}/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "REVIEW",
                title,
                content,
                rating,
            }),
        });
        alert("리뷰가 등록되었습니다");
        location.reload();
    };

    return (
        <div className="border p-4 rounded space-y-3 mt-6">
            <h3 className="font-semibold">리뷰 작성</h3>

            <StarRating value={rating} onChange={setRating} />

            <input
                className="border p-2 w-full"
                placeholder="제목"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <textarea
                className="border p-2 w-full"
                placeholder="리뷰 내용"
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={submit}
            >
                등록
            </button>
        </div>
    );
}
