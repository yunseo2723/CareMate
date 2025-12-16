// FacilityDetailHeader.tsx (일부)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function FavoriteStar({ instCode, kindCode }: any) {
    const { authFetch } = useAuth();
    const [fav, setFav] = useState(false);

    useEffect(() => {
        authFetch(
            `http://localhost:8080/favorites/${instCode}/${kindCode}`
        )
            .then(r => r.json())
            .then(d => setFav(d.favorite));
    }, [authFetch, instCode, kindCode]);

    const toggle = async () => {
        const res = await authFetch(
            `http://localhost:8080/favorites/${instCode}/${kindCode}`,
            { method: "POST" }
        );
        const data = await res.json();
        setFav(data.favorite);
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
