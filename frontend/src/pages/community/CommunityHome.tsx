import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "./PostList";
import { useAuth } from "../../hooks/useAuth";
import ReviewList from "../../components/ReviewList.tsx";

export default function CommunityHome() {
    const { instCode, kindCode } = useParams();
    const { authFetch } = useAuth();

    const [facilityName, setFacilityName] = useState<string>("");
    useEffect(() => {
        if (!instCode) return;

        authFetch(`http://localhost:8080/ltc/detail?instCode=${instCode}&kindCode=${kindCode}`)
            .then((res) => res.json())
            .then((data) => {
                setFacilityName(data.name);
            })
            .catch(() => {
                setFacilityName(instCode); // fallback
            });
    }, [authFetch, instCode, kindCode]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* 제목 */}
            <h1 className="text-2xl font-bold">
                커뮤니티 · {facilityName || "요양원 정보 불러오는 중..."}
            </h1>

            {/* 탭 */}
            <div className="flex gap-4 border-b pb-2">
            </div>

            {/* 게시글 리스트 */}
            <PostList type="NOTICE" />
            <PostList type="FREE" />

            <ReviewList />
        </div>
    );
}
