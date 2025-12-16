/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {useAuth} from "../../hooks/useAuth.ts";
import StarRating from "../../components/StarRating.tsx";

export default function PostWrite() {
    const { instCode, kindCode } = useParams();
    const [params] = useSearchParams();
    const boardType = params.get("type") ?? "FREE";
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [allowComment, setAllowComment] = useState(true);
    const { authFetch } = useAuth()

    const submit = async () => {
        let url: string;
        let payload: any;

        if (boardType === "REVIEW") {
            // ⭐ 리뷰 전용
            url = `http://localhost:8080/facility/${instCode}/${kindCode}/review`;
            payload = {
                title,
                content,
                rating,
            };
        } else {
            // 자유 / 공지
            url = `http://localhost:8080/facility/${instCode}/${kindCode}/post`;
            payload = {
                title,
                content,
                boardType,
                allowComment,
            };
        }

        await authFetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        alert("등록되었습니다!");
        navigate(`/facility/${instCode}/${kindCode}/community`);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">
                {boardType === "REVIEW" ? "리뷰 작성" : "게시글 작성"}
            </h1>

            {/* ⭐ 리뷰 전용 별점 */}
            {boardType === "REVIEW" && (
                <StarRating value={rating} onChange={setRating} />
            )}

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

            {boardType !== "REVIEW" && (
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={allowComment}
                        onChange={e => setAllowComment(e.target.checked)}
                    />
                    댓글 허용
                </label>
            )}


            <button
                onClick={submit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                등록
            </button>
        </div>
    );
}
