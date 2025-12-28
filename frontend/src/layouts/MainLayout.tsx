import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo2.png";
import FacilityQuickSearch from "../components/FacilityQuickSearch.tsx";
import MobileSideDrawer from "../components/MobileSideDrawer";

export default function MainLayout() {
    const { user, logout, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (loading) return null;

    const displayName = user?.name ?? user?.nickname ?? user?.username;

    return (
        <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50">
            {/* Header */}
            <header className="w-full border-b bg-white sticky top-0 z-40">
                <div className="mx-auto max-w-[1200px] px-4">

                    {/* 데스크톱 헤더 */}
                    <div className="hidden md:flex items-center justify-between h-30">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img
                                src={logo}
                                alt="CareMate"
                                className="h-20 w-auto scale-125 origin-left"
                            />

                        </Link>

                        <div className="flex-1 flex justify-center px-6">
                            <FacilityQuickSearch />
                        </div>


                        {/* 기존 우측 영역 그대로 */}
                        <div className="hidden md:flex flex-col items-end gap-2 min-w-[220px]">
                            {user ? (
                                <>
                                    <div className="text-sm text-slate-700">
                                        <span className="font-semibold">{displayName}</span> 님 환영합니다
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            to="/admin"
                                            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-sm"
                                        >
                                            관리자 인증
                                        </Link>

                                        <Link
                                            to="/mypage"
                                            className="px-3 py-1.5 rounded-md border hover:bg-slate-50 text-sm"
                                        >
                                            마이페이지
                                        </Link>

                                        <button
                                            onClick={logout}
                                            className="px-3 py-1.5 rounded-md bg-lime-600 text-white text-sm font-semibold hover:bg-lime-500"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                                    >
                                        로그인
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="rounded-md bg-lime-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-lime-500"
                                    >
                                        회원가입
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* 모바일 헤더 */}
                    <div className="md:hidden flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center">
                            <img
                                src={logo}
                                alt="CareMate"
                                className="h-15 w-auto scale-125 origin-left"
                            />
                        </Link>


                        <button
                            className="text-2xl"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            ☰
                        </button>
                    </div>

                    {/* 모바일 검색 (헤더 내부) */}
                    <div className="md:hidden border-t px-4 py-3">
                        <FacilityQuickSearch />
                    </div>

                </div>
            </header>

            <MobileSideDrawer
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                user={user}
                logout={logout}
            />

            {/* Main */}
            <main className="flex-1 w-full py-6">
                <div className="app-container">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-white">
                <div className="mx-auto max-w-[1200px] px-4 py-6 text-xs text-slate-500 flex justify-between">
                    <div>© {new Date().getFullYear()} CareMate</div>
                    <div className="space-x-3">
                        <a className="hover:underline" href="#">개인정보처리방침</a>
                        <a className="hover:underline" href="#">이용약관</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
