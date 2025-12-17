/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StarRating from "../../components/StarRating";

export default function ReviewDetail() {
    const { postId, instCode, kindCode } = useParams();
    const navigate = useNavigate();
    const { authFetch, user } = useAuth();

    const [review, setReview] = useState<any>(null);

    useEffect(() => {
        authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/review/${postId}`
        )
            .then((r) => r.json())
            .then(setReview);
    }, [authFetch, instCode, kindCode, postId]);

    const removeReview = async () => {
        if (!confirm("리뷰를 삭제할까요?")) return;

        await authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/review/${postId}`,
            { method: "DELETE" }
        );

        alert("삭제되었습니다");
        navigate(`/facility/${instCode}/${kindCode}/community`);
    };

    if (!review) return <div className="p-6">불러오는 중...</div>;

    const isMine = user?.name === review.writerName;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* 제목 + 삭제 */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{review.title}</h1>
                    <div className="mt-2">
                        <StarRating value={review.rating} readOnly />
                    </div>
                </div>

                {isMine && (
                    <button
                        className="px-3 py-1 border text-red-500 rounded hover:bg-red-50"
                        onClick={removeReview}
                    >
                        삭제
                    </button>
                )}
            </div>

            {/* 작성자 */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                    <div className="font-semibold">{review.writerName}</div>
                    <div className="text-xs text-gray-500">
                        {review.createdAt?.replace("T", " ").slice(0, 16)}
                    </div>
                </div>
            </div>

            {/* 본문 */}
            <div className="border rounded p-4 bg-white whitespace-pre-line">
                {review.content}
            </div>
        </div>
    );
}
