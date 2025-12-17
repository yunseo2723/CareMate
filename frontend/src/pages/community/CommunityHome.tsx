import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PostList from "./PostList";
import { useAuth } from "../../hooks/useAuth";
import ReviewList from "./ReviewList.tsx";

export default function CommunityHome() {
    const { instCode, kindCode } = useParams();
    const { authFetch } = useAuth();

    const [facilityName, setFacilityName] = useState<string>("");

    useEffect(() => {
        if (!instCode) return;

        authFetch(
            `https://caremate-fmp1.onrender.com/ltc/detail?instCode=${instCode}&kindCode=${kindCode}`
        )
            .then((res) => res.json())
            .then((data) => setFacilityName(data.name))
            .catch(() => setFacilityName(instCode));
    }, [authFetch, instCode, kindCode]);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-10">
            {/* 헤더 */}
            <div>
                <h1 className="text-2xl font-bold">
                    {facilityName || "요양원 정보 불러오는 중..."} 커뮤니티
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    해당 요양원의 공지사항, 자유게시판, 리뷰를 확인할 수 있습니다.
                </p>
            </div>

            {/* 공지사항 */}
            <Section
                title="공지사항"
                actionLabel="글쓰기"
                actionHref="community/write?type=NOTICE"
            >
                <PostList type="NOTICE" />
            </Section>

            {/* 자유게시판 */}
            <Section
                title="자유게시판"
                actionLabel="글쓰기"
                actionHref="community/write?type=FREE"
            >
                <PostList type="FREE" />
            </Section>

            {/* 리뷰 */}
            <Section
                title="리뷰"
                actionLabel="리뷰 쓰기"
                actionHref="community/write?type=REVIEW"
            >
                <ReviewList />
            </Section>
        </div>
    );
}

/* ===================== 공통 섹션 컴포넌트 ===================== */

function Section({
                     title,
                     actionLabel,
                     actionHref,
                     children,
                 }: {
    title: string;
    actionLabel: string;
    actionHref: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <a
                    href={actionHref}
                    className="rounded-md bg-lime-600 px-3 py-1.5
                     text-sm text-white hover:bg-lime-500 transition"
                >
                    {actionLabel}
                </a>
            </div>

            <div className="p-4">{children}</div>
        </div>
    );
}
