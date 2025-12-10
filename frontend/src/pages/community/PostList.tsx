/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";

export default function PostList({ type }: { type: "NOTICE" | "FREE" }) {
    const { instCode } = useParams();
    const [rows, setRows] = useState([]);
    const { authFetch } = useAuth()

    useEffect(() => {
        authFetch(`http://localhost:8080/facility/${instCode}/post?type=${type}`)
            .then(r => r.json())
            .then(rows => setRows(rows));
    }, [instCode, type]);

    return (
        <div className="p-5">
            {/* 상단 제목 + 글쓰기 버튼 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    {type === "NOTICE" ? "공지사항" : "자유게시판"}
                </h2>

                <Link
                    to={`/facility/${instCode}/community/write?type=${type}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow"
                >
                    글쓰기
                </Link>
            </div>

            {/* 게시글 테이블 */}
            <table className="w-full text-sm border-t border-gray-300">
                <thead className="bg-gray-100 text-gray-600">
                <tr>
                    <th className="py-2 w-20">말머리</th>
                    <th className="py-2 text-left">제목</th>
                    <th className="py-2 w-32">작성자</th>
                    <th className="py-2 w-32">작성일</th>
                    <th className="py-2 w-20">조회</th>
                </tr>
                </thead>

                <tbody>
                {rows.map((p: any) => (
                    <PostRow key={p.id} post={p} />
                ))}
                </tbody>
            </table>
        </div>
    );
}

function PostRow({ post }: any) {
    const { instCode } = useParams();
    return (
        <tr className="border-b hover:bg-gray-50">
            {/* 말머리 */}
            <td className="py-2 text-center">
                {post.boardType === "NOTICE" ? (
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
                    to={`/facility/${instCode}/community/post/${post.id}`}
                    className="hover:underline"
                >
                    {post.title}
                    {post.commentCount > 0 && (
                        <span className="text-blue-600 ml-1">
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

