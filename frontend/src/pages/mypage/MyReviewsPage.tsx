// src/pages/mypage/MyReviews.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type MyReview = {
    id: number;
    instCode: string;
    kindCode: string;
    facilityName: string;
    title: string;
    rating: number;
    createdAt: string;
    viewCount: number;
};

export default function MyReviewsPage() {
    const { authFetch } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<MyReview[]>([]);

    useEffect(() => {
        authFetch("http://localhost:8080/myreview/reviews")
            .then(res => res.json())
            .then(setReviews);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">내가 작성한 리뷰</h1>

            {reviews.length === 0 && (
                <div className="text-gray-500">
                    아직 작성한 리뷰가 없습니다.
                </div>
            )}

            <table className="w-full text-sm border-t border-gray-300">
                <thead className="bg-gray-100 text-gray-600">
                <tr>
                    <th className="py-2 text-left">요양원</th>
                    <th className="text-left">제목</th>
                    <th className="w-24">별점</th>
                    <th className="w-32">작성일</th>
                    <th className="w-20">조회</th>
                </tr>
                </thead>

                <tbody>
                {reviews.map(r => (
                    <tr
                        key={r.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                            navigate(
                                `/facility/${r.instCode}/${r.kindCode}/community/post/${r.id}`
                            )
                        }
                    >
                        <td className="py-3">{r.facilityName}</td>
                        <td className="font-medium">{r.title}</td>
                        <td className="text-center">
                            {"★".repeat(r.rating)}
                            {"☆".repeat(5 - r.rating)}
                        </td>
                        <td className="text-center">
                            {r.createdAt.slice(0, 10)}
                        </td>
                        <td className="text-center">{r.viewCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
