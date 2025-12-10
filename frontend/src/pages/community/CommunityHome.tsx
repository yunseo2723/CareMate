import { Link, useParams } from "react-router-dom";
import PostList from "./PostList.tsx";

export default function CommunityHome() {
    const { instCode } = useParams();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                커뮤니티 · {instCode}
            </h1>

            <div className="flex gap-4 border-b pb-2">
                <Link to={`?tab=notice`} className="text-blue-600 font-semibold">
                    공지사항
                </Link>
                <Link to={`?tab=free`} className="text-blue-600 font-semibold">
                    자유게시판
                </Link>
            </div>

            {/* 두 리스트를 재사용 */}
            <PostList type="NOTICE" />
            <PostList type="FREE" />
        </div>
    );
}
