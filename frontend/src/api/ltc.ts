// src/api/ltc.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export type FacilityLite = {
    id: string;
    name: string;
    kindCode?: string;
    sido?: string;
    sgg?: string;
    postNo?: string;
    address?: string;
    phone?: string;
};

/** 지도/검색용 전체 리스트 */
export async function fetchFacilitiesLiteAll(): Promise<FacilityLite[]> {
    const url = "http://localhost:8080/ltc/list/lite";

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data;
}

/* ----------------------------------------------------
 * 상세 DTO
 * ---------------------------------------------------- */

export type FacilityDetailSummary = {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    lat?: number;
    lng?: number;
};

export type FacilityDetailDTO = {
    summary: FacilityDetailSummary;

    capacityTotal?: number;
    residentMale?: number;
    residentFemale?: number;

    nurse?: number;
    doctor?: number;
    caregiver?: number;
    socialWorker?: number;
    nurseAide?: number;
    physicalTher?: number;
    occupTher?: number;
    nutritionist?: number;
    cook?: number;
    manager?: number;
    assistant?: number;

    singleRm?: number;
    doubleRm?: number;
    tripleRm?: number;
    quadrupleRm?: number;
    specialRm?: number;
    adlTraining?: number;
    programRoom?: number;
    diningKitchen?: number;
    toilet?: number;
    bath?: number;
    laundry?: number;

    homepage?: string;
    transport?: string;
    parking?: string;

    programs?: Array<any>;
    contracts?: Array<any>;
};

/** 상세 조회 */
export async function fetchFacilityDetailByInst(
    instCode: string,
    kindCode: string,
): Promise<FacilityDetailDTO> {
    const url = new URL("http://localhost:8080/ltc/detail");
    url.searchParams.set("instCode", instCode);
    url.searchParams.set("kindCode", kindCode);

    const res = await fetch(url.toString(), { credentials: "include" });
    if (!res.ok) throw new Error("detail load failed");

    const s = await res.json();

    const summary: FacilityDetailSummary = {
        id: s.instCode,
        name: s.name,
        address: s.address ?? s.roadAddr ?? s.addr,
        phone: s.phone,
        lat: s.lat,
        lng: s.lon,
    };

    return {
        summary,
        capacityTotal: s.capacityTotal,
        residentMale: s.residentMale,
        residentFemale: s.residentFemale,

        nurse: s.nurse,
        doctor: s.doctor,
        caregiver: s.caregiver,
        socialWorker: s.socialWorker,
        nurseAide: s.nurseAide,
        physicalTher: s.physicalTher,
        occupTher: s.occupTher,
        nutritionist: s.nutritionist,
        cook: s.cook,
        manager: s.manager,
        assistant: s.assistant,

        singleRm: s.singleRm,
        doubleRm: s.doubleRm,
        tripleRm: s.tripleRm,
        quadrupleRm: s.quadrupleRm,
        specialRm: s.specialRm,

        adlTraining: s.adlTraining,
        programRoom: s.programRoom,
        diningKitchen: s.diningKitchen,
        toilet: s.toilet,
        bath: s.bath,
        laundry: s.laundry,

        homepage: s.homepage,
        transport: s.transport,
        parking: s.parking,

        programs: s.programs ?? [],
        contracts: s.contracts ?? [],
    };
}

/* ----------------------------------------------------
 * 유사 추천
 * ---------------------------------------------------- */

export type SimilarFacility = {
    id: string;
    name: string;
    address?: string;
    careLevel?: string;
    similarity?: number;
};

export async function fetchSimilarFacilities(
    instCode: string,
    size = 5,
): Promise<SimilarFacility[]> {
    const url = new URL(
        `http://localhost:8080/ltc/similar/${encodeURIComponent(instCode)}`,
    );
    url.searchParams.set("size", String(size));

    const res = await fetch(url.toString(), { credentials: "include" });
    if (!res.ok) return [];

    const raw = await res.json().catch(() => []);

    return raw.map((r: any) => ({
        id: r.instCode,
        name: r.name,
        address: r.address ?? r.addr ?? r.roadAddr,
        careLevel: r.kindCode,
        similarity:
            typeof r.similarity === "number"
                ? r.similarity
                : typeof r.score === "number"
                    ? r.score
                    : undefined,
    }));
}
