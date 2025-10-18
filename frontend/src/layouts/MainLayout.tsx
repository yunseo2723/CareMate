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
            <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
                <div className="flex w-full items-center gap-3 px-4 py-3">
                    {/* 브랜드 */}
                    <div className="h-6 w-6 rounded-lg bg-slate-900" />
                    <h1 className="text-lg font-semibold tracking-tight">
                        <Link to="/" className="hover:opacity-80">CareMate</Link>
                    </h1>
                    <span className="ml-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs">
            요양원 추천
          </span>

                    {/* 좌측 네비 (중간 영역) */}
                    <nav className="ml-6 hidden sm:flex items-center gap-4">
                        <Link to="/mypage" className="text-sm hover:underline">마이페이지</Link>
                        <Link to="/bookmarks" className="text-sm hover:underline">즐겨찾기</Link>
                        <Link to="/inquiries" className="text-sm hover:underline">문의내역</Link>
                    </nav>

                    {/* 우측 액션: ml-auto는 한 번만 */}
                    <div className="ml-auto flex items-center gap-3">
                        {user ? (
                            <>
                                {/* 환영 문구 */}
                                <span className="hidden sm:inline text-sm text-slate-700">
                  {displayName}님 환영합니다
                </span>

                                {/* 버튼들 */}
                                <button
                                    className="rounded-md border bg-slate-400 px-3 py-1.5 text-sm text-white hover:opacity-90"
                                    onClick={() => nav("/admin")}
                                >
                                    관리자인증
                                </button>
                                <button
                                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                                    onClick={() => nav("/mypage")}
                                >
                                    마이페이지
                                </button>
                                <button
                                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:opacity-90"
                                    onClick={logout}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:opacity-90"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ✅ children 대신 Outlet 사용 */}
            <main className="flex-1 w-full p-4">
                <Outlet />
            </main>

            <footer className="border-t bg-white">
                <div className="w-full px-4 py-6 text-xs text-slate-500 flex justify-between">
                    <div>© {new Date().getFullYear()} CareMate • 졸업작품</div>
                    <div className="space-x-2">
                        <a className="hover:underline" href="#">개인정보처리방침</a>
                        <a className="hover:underline" href="#">이용약관</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
