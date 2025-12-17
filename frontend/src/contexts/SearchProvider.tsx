// src/providers/SearchProvider.tsx

import React, { useState } from "react";
import {Ctx, type SearchFilter} from "./Ctx.ts";

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

    const [editingFilterId, setEditingFilterId] = useState<number | null>(null);
    const [_initialized, setInitialized] = useState(false);

    const [aiPrompt, setAiPrompt] = useState("");
    const [aiResult, setAiResult] = useState(null);

    const applyFilter = (f: SearchFilter) => {
        if (f.center !== undefined) setCenter(f.center);
        if (f.radiusKm !== undefined) setRadiusKm(f.radiusKm);
        if (f.careLevel !== undefined) setCareLevel(f.careLevel);
        if (f.gradeFilter !== undefined) setGradeFilter(f.gradeFilter);

        if (f.minCaregiver !== undefined) setMinCaregiver(f.minCaregiver);
        if (f.hasNurse !== undefined) setHasNurse(f.hasNurse);
        if (f.hasDoctor !== undefined) setHasDoctor(f.hasDoctor);
        if (f.hasSocial !== undefined) setHasSocial(f.hasSocial);

        if (f.roomTypes !== undefined) setRoomTypes(f.roomTypes);
        if (f.programTypes !== undefined) setProgramTypes(f.programTypes);
    };

    const clearAll = () => {
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
    };

    return (
        <Ctx.Provider
            value={{
                center, setCenter,
                radiusKm, setRadiusKm,
                careLevel, setCareLevel,
                gradeFilter, setGradeFilter,

                minCaregiver, setMinCaregiver,
                hasNurse, setHasNurse,
                hasDoctor, setHasDoctor,
                hasSocial, setHasSocial,

                roomTypes, setRoomTypes,
                programTypes, setProgramTypes,

                applyFilter,
                editingFilterId, setEditingFilterId,

                aiPrompt, setAiPrompt,
                aiResult, setAiResult,

                clearAll,

                loading: false,
                setLoading: () => {},

                results: [],
                setCircleFacilities: () => {},

                _initialized,
                setInitialized,


                compare: [],
                setCompare: () => {},
                toggleCompare: () => {}
            }}
        >
            {children}
        </Ctx.Provider>
    );
}
