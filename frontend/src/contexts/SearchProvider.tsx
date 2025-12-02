// src/contexts/SearchProvider.tsx

import { useState, type ReactNode, useMemo } from "react";
import { Ctx, type SearchContextValue } from "./Ctx";
import type { Facility } from "../types/facility";

export function SearchProvider({ children }: { children: ReactNode }) {
    const [q, setQ] = useState("");

    const [center, setCenter] = useState("서울특별시");
    const [detailCenter, setDetailCenter] = useState("");

    const [radiusKm, setRadiusKm] = useState(10);
    const [budget, setBudget] = useState(2_000_000);
    const [careLevel, setCareLevel] = useState("all");
    const [minRating, setMinRating] = useState(0);

    const [onlyAvailable, setOnlyAvailable] = useState(true);
    const [ins, setIns] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [sort, setSort] = useState("추천순");

    const [loading, setLoading] = useState(false);

    // 👉 지도에서 들어온 "반경 내 시설"
    const [circleFacilities, setCircleFacilities] = useState<Facility[]>([]);

    // 👉 리스트에서 비교하기 위한 배열
    const [compare, setCompare] = useState<Facility[]>([]);

    const toggleCompare = (f: Facility) => {
        setCompare((prev) => {
            const exist = prev.find((p) => p.id === f.id);
            if (exist) return prev.filter((p) => p.id !== f.id);
            return [...prev.slice(0, 3), f];
        });
    };

    /** 🔥 검색 + 필터 + 정렬 적용한 결과 */
    const results = useMemo(() => {
        let list = [...circleFacilities];

        if (q) {
            list = list.filter(
                (v) => v.name.includes(q) || v.address?.includes(q),
            );
        }

        if (careLevel !== "all") {
            list = list.filter((v) => v.careLevel === careLevel);
        }

        if (minRating > 0) {
            list = list.filter((v) => (v.rating ?? 0) >= minRating);
        }

        if (onlyAvailable) {
            list = list.filter((v) => (v.bedsAvailable ?? 1) > 0);
        }

        // 정렬
        switch (sort) {
            case "가격낮은순":
                list.sort((a, b) => (a.monthlyCost ?? 0) - (b.monthlyCost ?? 0));
                break;
            case "평점높은순":
                list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
        }

        return list;
    }, [
        q,
        careLevel,
        minRating,
        onlyAvailable,
        sort,
        circleFacilities,
    ]);

    const clearAll = () => {
        setQ("");
        setCareLevel("all");
        setMinRating(0);
        setOnlyAvailable(true);
        setIns([]);
        setAmenities([]);
        setSort("추천순");
    };

    const value: SearchContextValue = {
        q,
        setQ,

        center,
        setCenter,

        detailCenter,
        setDetailCenter,

        setCircleFacilities,

        radiusKm,
        setRadiusKm,

        budget,
        setBudget,

        careLevel,
        setCareLevel,

        minRating,
        setMinRating,

        onlyAvailable,
        setOnlyAvailable,

        ins,
        setIns,

        amenities,
        setAmenities,

        sort,
        setSort,

        loading,
        setLoading,

        results,

        compare,
        setCompare,
        toggleCompare,
        clearAll,
    };

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
