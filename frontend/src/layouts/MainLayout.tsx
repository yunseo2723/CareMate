// src/layouts/MainLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function MainLayout() {
    const nav = useNavigate();
    const { user, logout, loading } = useAuth();
    if (loading) return null;

    const displayName = user?.name ?? user?.nickname ?? user?.username;

    return (
        <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-screen-2xl items-center px-6 py-3">

                    {/* 브랜드 */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90">
                        <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">C</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold tracking-tight">
                                CareMate
                            </h1>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                요양원 추천
              </span>
                        </div>
                    </Link>

                    {/* 우측 영역 */}
                    <div className="ml-auto flex items-center gap-3">
                        {user ? (
                            <>
                                {/* 환영 문구 */}
                                <span className="hidden md:inline text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    {displayName}
                  </span>
                  님 환영합니다
                </span>

                                {/* 관리자 */}
                                <button
                                    onClick={() => nav("/admin")}
                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm
                             text-slate-700 hover:bg-slate-200 transition"
                                >
                                    관리자 인증
                                </button>

                                {/* 마이페이지 */}
                                <button
                                    onClick={() => nav("/mypage")}
                                    className="rounded-lg border px-3 py-1.5 text-sm
                             hover:bg-slate-50 transition"
                                >
                                    마이페이지
                                </button>

                                {/* 로그아웃 (Primary) */}
                                <button
                                    onClick={logout}
                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm
                             text-white hover:bg-slate-800 transition"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-lg border px-3 py-1.5 text-sm
                             hover:bg-slate-50 transition"
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm
                             text-white hover:bg-slate-800 transition"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 w-full px-4 py-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t bg-white">
                <div className="mx-auto max-w-screen-2xl px-6 py-6
                        text-xs text-slate-500 flex justify-between">
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
