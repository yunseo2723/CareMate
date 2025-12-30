/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRequireLogin } from "../hooks/useRequireLogin";

export default function FavoriteStar({ instCode, kindCode }: any) {
    const { authFetch, isLoggedIn } = useAuth();
    const requireLogin = useRequireLogin();

    const [fav, setFav] = useState(false);

    // 🔹 로그인 상태일 때만 즐겨찾기 조회
    useEffect(() => {
        if (!isLoggedIn) {
            setFav(false); // 로그인 안 했으면 항상 빈 별
            return;
        }

        authFetch(
            `https://caremate-fmp1.onrender.com/favorites/${instCode}/${kindCode}`
        )
            .then(r => r.json())
            .then(d => setFav(d.favorite));
    }, [authFetch, instCode, kindCode, isLoggedIn]);

    const toggle = () => {
        requireLogin(async () => {
            const res = await authFetch(
                `https://caremate-fmp1.onrender.com/favorites/${instCode}/${kindCode}`,
                { method: "POST" }
            );
            const data = await res.json();
            setFav(data.favorite);
        });
    };

    return (
        <button
            onClick={toggle}
            className="ml-3 text-2xl"
            title="즐겨찾기"
        >
            {fav ? "⭐" : "☆"}
        </button>
    );
}
