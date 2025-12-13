// src/components/review/ReviewList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
        authFetch(`http://localhost:8080/facility/${instCode}/${kindCode}/review`)
            .then((res: { json: () => any; }) => res.json())
            .then(setReviews);
    }, [authFetch, instCode, kindCode]);

    return (
        <div className="p-5">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
                리뷰</h2>

            <Link
                to={`/facility/${instCode}/${kindCode}/community/write?type=REVIEW`}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow"
            >
                리뷰 쓰기
            </Link>
        </div>

            <table className="w-full text-sm border-t border-gray-300">
                <thead className="bg-gray-100 text-gray-600">
                <tr>
                    <th className="py-2 w-20">말머리</th>
                    <th className="py-2 text-left">제목</th>
                    <th className="py-2 w-32">별점</th>
                    <th className="py-2 w-32">작성자</th>
                    <th className="py-2 w-32">작성일</th>
                    <th className="py-2 w-20">조회</th>
                </tr>
                </thead>

                <tbody>
                {reviews.map((p: any) => (
                    <PostRow key={p.id} post={p} />
                ))}
                </tbody>
            </table>
        </div>
    );
}

function PostRow({ post }: any) {
    const { instCode, kindCode } = useParams();
    return (
        <tr className="border-b hover:bg-gray-50">
            {/* 말머리 */}
            <td className="py-2 text-center">
                    <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                        리뷰
                    </span>
            </td>

            {/* 제목 */}
            <td className="py-2">
                <Link
                    to={`/facility/${instCode}/${kindCode}/community/post/${post.id}`}
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