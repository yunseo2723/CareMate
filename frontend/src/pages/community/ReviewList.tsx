// src/components/review/ReviewList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";

type Review = {
    id: number;
    title: string;
    rating: number;
    writerName: string;
    createdAt: string;
    viewCount: number;
};

export default function ReviewList() {
    const { instCode, kindCode } = useParams();
    const { authFetch } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/review`
        )
            .then(res => res.json())
            .then(setReviews);
    }, [authFetch, instCode, kindCode]);

    return (
        <table className="w-full text-sm border-t border-gray-300">
            <thead className="bg-gray-100 text-gray-600">
            <tr>
                <th className="py-2 w-20">말머리</th>
                <th className="text-left">제목</th>
                <th className="w-32">별점</th>
                <th className="w-32">작성자</th>
                <th className="w-32">작성일</th>
                <th className="w-20">조회</th>
            </tr>
            </thead>

            <tbody>
            {reviews.map(r => (
                <ReviewRow key={r.id} post={r} />
            ))}
            </tbody>
        </table>
    );
}

function ReviewRow({ post }: any) {
    const { instCode, kindCode } = useParams();
    return (
        <tr className="border-b hover:bg-gray-50">
            {/* 말머리 */}
            <td className="py-2 text-center">
                    <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-white">
                        리뷰
                    </span>
            </td>

            {/* 제목 */}
            <td className="py-2">
                <Link
                    to={`/facility/${instCode}/${kindCode}/community/review/${post.id}`}
                    className="hover:underline"
                >
                    {post.title}
                </Link>
            </td>

            {/* 평점 */}
            <td>{"★".repeat(post.rating)}{"☆".repeat(5 - post.rating)}</td>

            {/* 작성자 */}
            <td className="text-center">{post.writerName}</td>

            {/* 작성일 */}
            <td className="text-center">
                {post.createdAt?.slice(0, 10)}
            </td>

            {/* 조회수 — 없으므로 기본 0 */}
            <td className="text-center">
                {post.views ?? 0}
            </td>
        </tr>
    );
}