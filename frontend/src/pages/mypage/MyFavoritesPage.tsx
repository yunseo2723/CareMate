import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

type Fav = {
    instCode: string;
    kindCode: string;
    name: string;
    address: string;
};

export default function MyFavoritesPage() {
    const { authFetch } = useAuth();
    const [list, setList] = useState<Fav[]>([]);

    useEffect(() => {
        authFetch("http://localhost:8080/favorites/me")
            .then(r => r.json())
            .then(setList);
    }, [authFetch]);

    return (
        <div className="max-w-4xl space-y-6">

            {/* 타이틀 */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    즐겨찾기 요양원
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    관심 있는 요양원을 저장하고 빠르게 다시 확인할 수 있습니다.
                </p>
            </div>

            {/* 비어있을 때 */}
            {list.length === 0 && (
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                    즐겨찾기한 요양원이 없습니다.
                </div>
            )}

            {/* 리스트 */}
            <ul className="space-y-3">
                {list.map((f) => (
                    <li key={f.instCode}>
                        <Link
                            to={`/facility/${f.instCode}?kindCode=${f.kindCode}`}
                            className="group block rounded-2xl border bg-white p-5
                         transition hover:shadow-sm hover:border-yellow-400"
                        >
                            <div className="flex items-start gap-4">

                                {/* ⭐ 아이콘 */}
                                <div className="mt-0.5 text-yellow-400">
                                    <svg
                                        className="w-6 h-6 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                </div>

                                {/* 텍스트 */}
                                <div className="flex-1 min-w-0">
                                    <div
                                        className="font-semibold text-slate-900 truncate
                               group-hover:text-yellow-600 transition"
                                    >
                                        {f.name}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500 truncate">
                                        {f.address}
                                    </div>
                                </div>

                                {/* 화살표 */}
                                <div className="flex items-center text-slate-300
                                group-hover:text-yellow-400 transition">
                                    →
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
