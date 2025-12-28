/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useState } from "react";
import { Filters } from "./Filters";
import AiRecommendSidePanel from "./AiRecommendSidePanel";

type Tab =
    | "login"
    | "signup"
    | "logout"
    | "mypage"
    | "filter"
    | "ai";

export default function MobileSideDrawer({
                                             open,
                                             onClose,
                                             user,
                                             logout,
                                         }: any) {
    const [activeTab, setActiveTab] = useState<Tab | null>(null);

    if (!open) return null;

    const isLoggedIn = !!user;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-[85%] max-w-sm bg-white h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="font-semibold text-lg">메뉴</div>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div className="flex flex-col divide-y">

                    {!isLoggedIn && (
                        <>
                            <button
                                className="p-4 text-left"
                                onClick={() => setActiveTab("login")}
                            >
                                로그인
                            </button>

                            <button
                                className="p-4 text-left"
                                onClick={() => setActiveTab("signup")}
                            >
                                회원가입
                            </button>
                        </>
                    )}

                    {isLoggedIn && (
                        <>
                            <button
                                className="p-4 text-left"
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                            >
                                로그아웃
                            </button>

                            <button
                                className="p-4 text-left"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                <Link to="/mypage">마이페이지</Link>
                            </button>

                            <button
                                className="p-4 text-left"
                                onClick={() => setActiveTab("filter")}
                            >
                                필터
                            </button>

                            <button
                                className="p-4 text-left"
                                onClick={() => setActiveTab("ai")}
                            >
                                AI 추천
                            </button>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === "login" && (
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="block text-center px-4 py-2 rounded-md border"
                        >
                            로그인 페이지로 이동
                        </Link>
                    )}

                    {activeTab === "signup" && (
                        <Link
                            to="/signup"
                            onClick={onClose}
                            className="block text-center px-4 py-2 rounded-md bg-lime-600 text-white"
                        >
                            회원가입 페이지로 이동
                        </Link>
                    )}

                    {activeTab === "filter" && <Filters />}

                    {activeTab === "ai" && <AiRecommendSidePanel />}
                </div>
            </div>
        </div>
    );
}
