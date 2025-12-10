// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ManagerVerify from "./pages/ManagerVerify.tsx";
import FacilityDetail from "./pages/FacilityDetail";
import CommunityHome from "./pages/community/CommunityHome";
import PostWrite from "./pages/community/PostWrite";
import PostDetail from "./pages/community/PostDetail";

// MyPage 묶음
import MyPageLayout from "./pages/mypage/MyPageLayout";
import ProfilePage from "./pages/mypage/ProfilePage";
import PasswordPage from "./pages/mypage/PasswordPage";
import NotificationsPage from "./pages/mypage/NotificationsPage";
import AdminFacilityPage from "./pages/mypage/AdminFacilityPage";
// import ReviewsPage from "./pages/mypage/ReviewsPage";
// import PreferencesPage from "./pages/mypage/PreferencesPage";
// import SavedFiltersPage from "./pages/mypage/SavedFiltersPage";
// import DocumentsPage from "./pages/mypage/DocumentsPage";
// import InboxPage from "./pages/mypage/InboxPage";

export default function App() {
    return (
        <BrowserRouter>
            {/* MainLayout를 레이아웃 라우트로 사용 */}
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="admin" element={<ManagerVerify />} />
                    <Route path="/facility/:instCode" element={<FacilityDetail />} />
                    <Route path="/facility/:instCode/community" element={<CommunityHome />} />
                    <Route path="/facility/:instCode/community/write" element={<PostWrite />} />
                    <Route path="/facility/:instCode/community/post/:postId" element={<PostDetail />} />
                    {/* ✅ 마이페이지 라우트와 하위 라우트들 */}
                    <Route path="mypage" element={<MyPageLayout />}>
                        {/* /mypage 접근 시 기본 탭을 profile로 리다이렉트 */}
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="password" element={<PasswordPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="admin-facility" element={<AdminFacilityPage />} />
                        {/*<Route path="reviews" element={<ReviewsPage />} />*/}
                        {/*<Route path="preferences" element={<PreferencesPage />} />*/}
                        {/*<Route path="saved-filters" element={<SavedFiltersPage />} />*/}
                        {/*<Route path="documents" element={<DocumentsPage />} />*/}
                        {/*<Route path="inbox" element={<InboxPage />} />*/}
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<div className="p-6">페이지가 없습니다.</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
