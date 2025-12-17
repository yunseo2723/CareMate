import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo2.png";
import FacilityQuickSearch from "../components/FacilityQuickSearch.tsx";

export default function MainLayout() {
    const { user, logout, loading } = useAuth();
    if (loading) return null;

    const displayName = user?.name ?? user?.nickname ?? user?.username;

    return (
        <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50">
            {/* Header */}
            <header className="w-full border-b bg-white">
                <div className="mx-auto max-w-[14200px] px-8">
                    <div className="flex items-center justify-between h-50">
                        {/* 좌 / 중 / 우 */}



                        {/* 브랜드 */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img
                            src={logo}
                            alt="CareMate"
                            className="h-40 w-auto object-contain"
                        />
                    </Link>

                        <div className="flex-1 flex justify-center">
                        <FacilityQuickSearch />
                    </div>

                        {/* 우측 영역 */}
                        <div className="flex flex-col items-end gap-3 min-w-[240px]">
                            {user ? (
                                <>
                                    {/* 환영 문구 (위) */}
                                    <div className="text-base text-slate-700 mr-1">
                                        <span className="font-semibold">{displayName}</span> 님 환영합니다
                                    </div>

                                    {/* 버튼 영역 (아래) */}
                                    <div className="flex items-center gap-3">
                                        {/* 관리자 */}
                                        <Link
                                            to="/admin"
                                            className="
            px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm
          "
                                        >
                                            관리자 인증
                                        </Link>

                                        {/* 마이페이지 */}
                                        <Link
                                            to="/mypage"
                                            className="
           px-4 py-2 rounded-md border hover:bg-slate-50 text-sm
          "
                                        >
                                            마이페이지
                                        </Link>

                                        {/* 로그아웃 */}
                                        <button
                                            onClick={logout}
                                            className="
            px-4 py-2 rounded-md bg-lime-600 text-white text-sm font-semibold hover:bg-lime-500
          "
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="
          rounded-lg
          border
          px-4 py-2
          text-sm font-medium
          hover:bg-slate-50
          transition
        "
                                    >
                                        로그인
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="
          rounded-lg
          bg-slate-900
          px-4 py-2
          text-sm font-semibold
          text-white
          hover:bg-slate-800
          transition
        "
                                    >
                                        회원가입
                                    </Link>
                                </div>
                            )}
                        </div>

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
