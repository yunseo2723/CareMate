// src/providers/SearchProvider.tsx

import { useState, useCallback, useMemo } from "react";
import { Ctx } from "../contexts/Ctx"; // 경로 맞춰줘
import type { Facility } from "../types/facility";

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [center, setCenter] = useState("");         // 위치 검색
    const [radiusKm, setRadiusKm] = useState(10);

    const [budget, setBudget] = useState(2_000_000);
    const [careLevel, setCareLevel] = useState("전체");
    const [gradeFilter, setGradeFilter] = useState("전체");
    const [onlyAvailable, setOnlyAvailable] = useState(true);

    const [ins, setIns] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);

    const [sort, setSort] = useState("추천순");
    const [loading, setLoading] = useState(false);

    const [results] = useState<Facility[]>([]);
    const [circleFacilities, setCircleFacilities] = useState<Facility[]>([]);

    const [compare, setCompare] = useState<Facility[]>([]);

    const toggleCompare = useCallback((f: Facility) => {
        setCompare((prev) => {
            const exists = prev.some((x) => x.instCode === f.instCode);
            return exists ? prev.filter((x) => x.instCode !== f.instCode) : [...prev, f];
        });
    }, []);

    const clearAll = useCallback(() => {
        setCenter("");
        setRadiusKm(10);
        setBudget(2_000_000);
        setCareLevel("전체");
        setGradeFilter("전체")
        setOnlyAvailable(true);
        setIns([]);
        setAmenities([]);
        setSort("추천순");
        // results / circleFacilities 는 그대로 둬도 되고, 같이 초기화해도 됨
    }, []);

    const value = useMemo(
        () => ({
            center,
            setCenter,

            radiusKm,
            setRadiusKm,

            budget,
            setBudget,

            careLevel,
            setCareLevel,

            gradeFilter,
            setGradeFilter,

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

            results: circleFacilities.length ? circleFacilities : results,

            setCircleFacilities,

            compare,
            setCompare,
            toggleCompare,

            clearAll,
        }),
        [
            center,
            radiusKm,
            budget,
            careLevel,
            gradeFilter,
            onlyAvailable,
            ins,
            amenities,
            sort,
            loading,
            results,
            circleFacilities,
            compare,
            toggleCompare,
            clearAll,
        ],
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
