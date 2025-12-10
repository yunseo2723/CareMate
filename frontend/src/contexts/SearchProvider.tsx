// src/providers/SearchProvider.tsx

import { useState, useCallback, useMemo } from "react";
import { Ctx } from "./Ctx.ts";
import type { Facility } from "../types/facility";

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [center, setCenter] = useState("");         // 위치 검색
    const [radiusKm, setRadiusKm] = useState(10);

    const [careLevel, setCareLevel] = useState("전체");
    const [gradeFilter, setGradeFilter] = useState("전체");

    const [minCaregiver, setMinCaregiver] = useState(0);
    const [hasNurse, setHasNurse] = useState(false);
    const [hasDoctor, setHasDoctor] = useState(false);
    const [hasSocial, setHasSocial] = useState(false);

    const [roomTypes, setRoomTypes] = useState<string[]>([]);
    const [programTypes, setProgramTypes] = useState<string[]>([]);

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
        setCareLevel("전체");
        setGradeFilter("전체");
        setMinCaregiver(0);
        setHasNurse(false);
        setHasDoctor(false);
        setHasSocial(false);
        setRoomTypes([]);
        setProgramTypes([]);
    }, []);

    const value = useMemo(
        () => ({
            center,
            setCenter,

            radiusKm,
            setRadiusKm,

            careLevel,
            setCareLevel,

            gradeFilter,
            setGradeFilter,

            minCaregiver,
            setMinCaregiver,
            hasNurse,
            setHasNurse,
            hasDoctor,
            setHasDoctor,
            hasSocial,
            setHasSocial,

            roomTypes,
            setRoomTypes,

            programTypes,
            setProgramTypes,

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
            careLevel,
            gradeFilter,
            minCaregiver,
            hasNurse,
            hasDoctor,
            hasSocial,
            roomTypes,
            programTypes,
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
