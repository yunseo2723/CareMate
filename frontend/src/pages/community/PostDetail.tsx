/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import EditPostModal from "../../components/EditPostModal";


export default function PostDetail() {
    const navigate = useNavigate();
    const { postId, instCode, kindCode } = useParams();
    const { authFetch } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [newComment, setNewComment] = useState("");

    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        authFetch(`https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/post/${postId}`)
            .then(r => r.json())
            .then(setPost);
    }, [postId, instCode, kindCode, authFetch]);

    const removePost = async () => {
        if (!confirm("삭제할까요?")) return;

        await authFetch(`https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/post/${postId}`, {
            method: "DELETE",
        });
        alert("삭제되었습니다");
        navigate(`/facility/${instCode}/${kindCode}/community`);
    };

    if (!post) return null;

    const writeComment = async (parentId: number | null, content: string) => {
        await authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/post/${postId}/comment`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, parentId })
            }
        );
        location.reload();
    };

    const refreshPost = () => {
        authFetch(`https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/post/${postId}`)
            .then(r => r.json())
            .then(setPost);
    };

    if (!post) return <div className="p-6">불러오는 중...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* 제목 + 수정/삭제 버튼 */}
            {/* 제목 + 수정/삭제 */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{post.title}</h1>

                {post.writerName && (
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 border rounded hover:bg-gray-50"
                            onClick={() => setEditOpen(true)}
                        >
                            수정
                        </button>

                        <button
                            className="px-3 py-1 border rounded text-red-500 hover:bg-red-50"
                            onClick={removePost}
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>
            <EditPostModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                post={post}
                instCode={instCode!}
                kindCode={kindCode!}
                onUpdated={refreshPost}
            />
            
            {/* 게시글 작성자 정보 (댓글 UI와 동일 스타일) */}
            <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

                <div>
                    <div className="font-semibold">{post.writerName}</div>
                    <div className="text-xs text-gray-500">
                        {post.createdAt?.replace("T", " ").slice(0, 16)}
                    </div>
                </div>
            </div>

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
                    refresh={refreshPost}
                    instCode={instCode}
                    postId={postId}
                />
            )}
        </div>
    );
}

/* ----------------------------- 댓글 컴포넌트 ----------------------------- */

const countAllComments = (list: any[]): number =>
    list.reduce((acc, c) => {
        const isDeleted = c.deleted === true || c.content === null || c.content === "삭제된 댓글입니다.";

        const self = isDeleted ? 0 : 1;  // 삭제된 댓글은 카운트 제외
        const children = countAllComments(c.replies ?? []);

        return acc + self + children;
    }, 0);

function CommentSection({
                            comments,
                            newComment,
                            setNewComment,
                            onSubmit,
                            refresh,
                            instCode,
                            postId
                        }: any) {

    const total = countAllComments(comments);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">댓글 {total}</h2>

            {comments.map((c: any) => (
                <CommentItem
                    key={c.id}
                    comment={c}
                    onSubmit={onSubmit}
                    refresh={refresh}
                    instCode={instCode}
                    postId={postId}
                    depth={0}
                />
            ))}

            <div className="flex gap-2 mt-6">
                <input
                    className="border p-2 flex-1"
                    value={newComment}
                    placeholder="댓글 입력"
                    onChange={e => setNewComment(e.target.value)}
                />
                <button
                    className="px-4 py-2 bg-lime-600 text-white rounded"
                    onClick={() => onSubmit(null, newComment)}
                >
                    댓글 등록
                </button>
            </div>
        </div>
    );
}


/* ----------------------------- 댓글 항목 ----------------------------- */

function CommentItem({ comment, onSubmit, refresh, instCode, kindCode, postId, depth = 0 }: any) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const { authFetch, user } = useAuth();

    const isMyComment = user?.name === comment.writerName;

    /** ⭐ 들여쓰기: 내용만 들여쓰기 */
    const indentStyle = depth > 0 ? "ml-12" : "";

    /** 답글 토글 */
    const toggleReply = () => {
        setReplyOpen(!replyOpen);
        if (!replyOpen) setReplyText(`@${comment.writerName} `);
    };

    /** 수정 */
    const updateComment = async () => {
        await authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/${kindCode}/post/${postId}/comment/${comment.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editText })
            }
        );
        setEditMode(false);
        refresh();
    };

    /** 삭제 */
    const deleteComment = async () => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;
        await authFetch(
            `https://caremate-fmp1.onrender.com/facility/${instCode}/post/${postId}/comment/${comment.id}`,
            { method: "DELETE" }
        );
        refresh();
    };

    return (
        <div className="mt-6">
            {/* ---------------- 상단 프로필 + 이름 + 날짜 + 메뉴 ---------------- */}
            <div className={`relative flex items-center gap-3 ${indentStyle}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

                <div>
                    <div className="font-semibold">
                        {comment.deleted ? "(알 수 없음)" : comment.writerName}
                    </div>
                    <div className="text-xs text-gray-500">
                        {comment.createdAt?.replace("T", " ").slice(0, 16)}
                    </div>
                </div>

                {/* 메뉴 버튼 - 항상 오른쪽 끝 */}
                {isMyComment && (
                    <div className="absolute right-0 top-2">
                        <button
                            className="text-gray-400 hover:text-black text-xl"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            ⋯
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-1 bg-white border shadow rounded w-24 text-sm">
                                <button
                                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setEditMode(true);
                                        setMenuOpen(false);
                                    }}
                                >
                                    수정하기
                                </button>
                                <button
                                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
                                    onClick={deleteComment}
                                >
                                    삭제하기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ---------------- 내용 구역 (여기만 들여쓰기 적용) ---------------- */}
            {!editMode ? (
                <div className={`${indentStyle} mt-3 whitespace-pre-line text-gray-800`}>
                    {comment.content}
                </div>
            ) : (
                <div className={`${indentStyle} mt-3 flex gap-2`}>
                    <input
                        className="border p-2 flex-1 rounded"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <button
                        className="px-3 py-2 bg-lime-600 text-white rounded"
                        onClick={updateComment}
                    >
                        저장
                    </button>
                </div>
            )}

            {/* ---------------- 좋아요 + 답글 버튼 ---------------- */}
            {!editMode && (
                <div className={`${indentStyle} mt-2 flex gap-4 text-sm text-gray-500`}>
                    <button>♡ 0</button>
                    <button onClick={toggleReply}>답글쓰기</button>
                </div>
            )}

            {/* ---------------- 대댓글 입력 ---------------- */}
            {replyOpen && (
                <div className={`${indentStyle} mt-3 flex gap-2`}>
                    <input
                        className="border p-2 flex-1 rounded"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                        className="px-3 py-2 bg-lime-600 text-white rounded"
                        onClick={() => onSubmit(comment.id, replyText)}
                    >
                        등록
                    </button>
                </div>
            )}

            {/* ---------------- 하단 선 ---------------- */}
            <div className="border-b border-gray-300/30 mt-6"></div>

            {/* ---------------- 대댓글 재귀 ---------------- */}
            {comment.replies?.map((r: any) => (
                <CommentItem
                    key={r.id}
                    comment={r}
                    onSubmit={onSubmit}
                    refresh={refresh}
                    instCode={instCode}
                    postId={postId}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
}
