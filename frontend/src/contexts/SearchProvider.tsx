// src/contexts/SearchProvider.tsx
import { useState, useMemo, useEffect } from "react";
import { Ctx, type SearchContextValue } from "./Ctx";
import type { Facility } from "../types/facility";
import { fetchFacilities } from "../api/ltc"; // ✅ .ts 제거

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [q, setQ] = useState("");
    const [center, setCenter] = useState("서울 강남구");
    const [detailCenter, setDetailCenter] = useState("");
    const [radiusKm, setRadiusKm] = useState(10);
    const [budget, setBudget] = useState(2_000_000);
    const [careLevel, setCareLevel] = useState("all");
    const [minRating, setMinRating] = useState(0);
    const [onlyAvailable, setOnlyAvailable] = useState(true);
    const [ins, setIns] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [sort, setSort] = useState("추천순");
    const [compare, setCompare] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(false);
    const [all, setAll] = useState<Facility[]>([]); // ✅ Facility[]

    useEffect(() => {
        setLoading(true);
        fetchFacilities()
            .then((rows) => {
                // 좌표 sanity check (대한민국 박스)
                const ok = rows.filter(
                    (r) =>
                        Number.isFinite(r.lat) &&
                        Number.isFinite(r.lng) &&
                        r.lat >= 33 && r.lat <= 39 &&
                        r.lng >= 124 && r.lng <= 132
                );
                console.log("[SEARCH] loaded from backend:", ok.length);
                setAll(ok);
            })
            .catch((e) => {
                console.error("[SEARCH] facilities load failed:", e);
                setAll([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const results = useMemo(() => {
        let list = [...all];

        if (q) list = list.filter((v) => v.name.includes(q) || v.address.includes(q));
        if (careLevel !== "all") list = list.filter((v) => v.careLevel === careLevel);
        list = list.filter((v) => (v.monthlyCost ?? 0) <= budget);
        list = list.filter((v) => (v.rating ?? 0) >= minRating);
        if (onlyAvailable) list = list.filter((v) => (v.bedsAvailable ?? 0) > 0);
        if (ins.length) list = list.filter((v) => ins.every((i) => (v.insurance ?? []).includes(i)));

        switch (sort) {
            case "가격낮은순":
                list.sort((a, b) => (a.monthlyCost ?? 0) - (b.monthlyCost ?? 0));
                break;
            case "평점높은순":
                list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
            default:
                list.sort(
                    (a, b) =>
                        (b.rating ?? 0) * 2 - (b.monthlyCost ?? 0) / 1e6 -
                        ((a.rating ?? 0) * 2 - (a.monthlyCost ?? 0) / 1e6)
                );
        }

        console.log("[SEARCH] results after filters:", list.length);
        return list;
    }, [all, q, careLevel, budget, minRating, onlyAvailable, ins, sort]);

    const toggleCompare = (f: Facility) => {
        setCompare((prev) => {
            const exist = prev.find((p) => p.id === f.id);
            if (exist) return prev.filter((p) => p.id !== f.id);
            return [...prev.slice(0, 3), f];
        });
    };

    const clearAll = () => {
        setQ(""); setCareLevel("all"); setBudget(2_000_000); setMinRating(0);
        setOnlyAvailable(true); setIns([]); setAmenities([]); setSort("추천순");
    };

    const value: SearchContextValue = {
        q, setQ, center, setCenter, detailCenter, setDetailCenter, radiusKm, setRadiusKm,
        budget, setBudget, careLevel, setCareLevel, minRating, setMinRating, onlyAvailable, setOnlyAvailable,
        ins, setIns, amenities, setAmenities, sort, setSort,
        loading, setLoading, results, compare, setCompare, toggleCompare, clearAll
    };

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
