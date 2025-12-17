/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";

export default function PostList({ type }: { type: "NOTICE" | "FREE" }) {
    const { instCode, kindCode } = useParams();
    const [rows, setRows] = useState<any[]>([]);
    const { authFetch } = useAuth();

    useEffect(() => {
        authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/post?type=${type}`
        )
            .then(r => r.json())
            .then(setRows);
    }, [authFetch, instCode, kindCode, type]);

    return (
        <table className="w-full text-sm border-t border-gray-300">
            <thead className="bg-gray-100 text-gray-600">
            <tr>
                <th className="py-2 w-20">말머리</th>
                <th className="text-left">제목</th>
                <th className="w-32">작성자</th>
                <th className="w-32">작성일</th>
                <th className="w-20">조회</th>
            </tr>
            </thead>

            <tbody>
            {rows.map(p => (
                <PostRow key={p.id} post={p} />
            ))}
            </tbody>
        </table>
    );
}

function PostRow({ post }: any) {
    const { instCode, kindCode } = useParams();
    return (
        <tr className="border-b hover:bg-gray-50">
            {/* 말머리 */}
            <td className="py-2 text-center">
                {post.boardType == "NOTICE" ? (
                    <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                        공지
                    </span>
                ) : (
                    <span className="px-2 py-1 text-xs rounded bg-gray-300 text-gray-800">
                        자유
                    </span>
                )}
            </td>

            {/* 제목 */}
            <td className="py-2">
                <Link
                    to={`/facility/${instCode}/${kindCode}/community/post/${post.id}`}
                    className="hover:underline"
                >
                    {post.title}
                    {post.commentCount > 0 && (
                        <span className="text-lime-600 ml-1">
                            [{post.commentCount}]
                        </span>
                    )}
                </Link>
            </td>

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

