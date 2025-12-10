/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PostDetail() {
    const { postId, instCode } = useParams();
    const { authFetch } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        authFetch(`http://localhost:8080/facility/${instCode}/post/${postId}`)
            .then(r => r.json())
            .then(setPost);
    }, [postId, instCode]);

    const writeComment = async (parentId: number | null, content: string) => {
        await authFetch(
            `http://localhost:8080/facility/${instCode}/post/${postId}/comment`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, parentId })
            }
        );
        location.reload();
    };


    if (!post) return <div className="p-6">불러오는 중...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* 제목 */}
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="text-gray-600">{post.writerName}</div>

            {/* 본문 */}
            <div className="p-4 border rounded bg-white whitespace-pre-line">
                {post.content}
            </div>

            {/* 댓글 구역 */}
            {post.allowComment && (
                <CommentSection
                    comments={post.comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onSubmit={writeComment}
                />
            )}
        </div>
    );
}

/* ----------------------------- 댓글 컴포넌트 ----------------------------- */

function CommentSection({ comments, newComment, setNewComment, onSubmit }: any) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">댓글 {comments.length}</h2>

            {/* 상위 댓글 목록 */}
            {comments.map((c: any) => (
                <CommentItem key={c.id} comment={c} onSubmit={onSubmit} />
            ))}

            {/* 새 댓글 입력 */}
            <div className="flex gap-2 mt-4">
                <input
                    className="border p-2 flex-1"
                    value={newComment}
                    placeholder="댓글 입력"
                    onChange={e => setNewComment(e.target.value)}
                />
                <button
                    onClick={() => onSubmit(null, newComment)}
                >
                    댓글 등록
                </button>
            </div>
        </div>
    );
}

/* ----------------------------- 댓글 항목 ----------------------------- */

function CommentItem({ comment, onSubmit }: any) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");

    return (
        <div className="border p-3 rounded bg-gray-50">
            <div className="font-semibold">{comment.writerName}</div>
            <div>{comment.content}</div>

            <button
                className="text-sm text-blue-600 mt-1"
                onClick={() => setReplyOpen(!replyOpen)}
            >
                답글 달기
            </button>

            {/* 대댓글 입력창 */}
            {replyOpen && (
                <div className="flex gap-2 mt-2 ml-4">
                    <input
                        className="border p-2 flex-1"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="대댓글 입력"
                    />
                    <button
                        onClick={() => onSubmit(comment.id, replyText)}
                    >
                        등록
                    </button>

                </div>
            )}

            {/* 대댓글 목록 */}
            {comment.replies?.length > 0 && (
                <div className="ml-6 mt-3 space-y-2 border-l pl-3">
                    {comment.replies.map((r: any) => (
                        <div key={r.id} className="bg-gray-100 p-2 rounded">
                            <div className="text-sm font-semibold">{r.writerName}</div>
                            <div className="text-sm">{r.content}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
