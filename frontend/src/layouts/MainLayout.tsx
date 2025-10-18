import type { PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MainLayout({ children }: PropsWithChildren) {
    const nav = useNavigate();
    const { user, logout } = useAuth();

    const displayName = user?.name ?? user?.nickname ?? user?.username;

    return (
        <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50">
            <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
                <div className="flex w-full items-center gap-3 px-4 py-3">
                    <div className="h-6 w-6 rounded-lg bg-slate-900" />
                    <h1 className="text-lg font-semibold tracking-tight">
                        <Link to="/" className="hover:opacity-80">CareMate</Link>
                    </h1>

                    <span className="ml-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs">
            요양원 추천
          </span>

                    {/* 오른쪽 영역: ml-auto는 한 번만 */}
                    <div className="ml-auto flex items-center gap-2">
                        {user ? (
                            <>
                                {/* 환영 문구 */}
                                <span className="hidden sm:inline text-sm text-slate-700 mr-1">
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

            <main className="flex-1 w-full p-4">{children}</main>

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
