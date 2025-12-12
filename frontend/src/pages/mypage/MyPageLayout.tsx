import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const CARD = "rounded-2xl border bg-white p-6";

export default function MyPageLayout(){
    const { user } = useAuth();
    console.log('[HEADER user]', user);
    const isAdmin = (user?.adminFacilities?.length ?? 0) > 0;

    const link = (to:string, label:string) => (
        <NavLink
            to={to}
            className={({isActive}) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`
            }>
            {label}
        </NavLink>
    );

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
            {/* 좌측 사이드바 */}
            <aside className={`${CARD} h-fit sticky top-[72px] space-y-4`}>
                <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">프로필</div>
                    <div className="space-y-1">
                        {link("profile","내 프로필")}
                        {link("password","비밀번호 변경")}
                        {link("notifications","알림 설정")}
                    </div>
                </div>

                {isAdmin && (
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-2">요양원관리</div>
                        <div className="space-y-1">
                            {link("admin-facility","시설 관리(커뮤니티 이동)")}
                        </div>
                    </div>
                )}

                <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">리뷰</div>
                    <div className="space-y-1">
                        {link("reviews","내 리뷰")}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">요양원 필터</div>
                    <div className="space-y-1">
                        {link("saved-filters","검색/필터 저장")}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">알림</div>
                    <div className="space-y-1">
                        {link("documents","문서함")}
                        {link("inbox","알림함")}
                    </div>
                </div>
            </aside>

            {/* 우측 콘텐츠 */}
            <section className={CARD}>
                <Outlet/>
            </section>
        </div>
    );
}