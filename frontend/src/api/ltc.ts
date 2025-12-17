/* eslint-disable @typescript-eslint/no-explicit-any */

export type FacilityLite = {
    instCode: string;
    kindCode: string;
    name: string;
    roadCode?: string;
    fullRoadAddr?: string;
    lat?: number;
    lng?: number;
    postNo?: string;
    phone?: string;
    grade?: string;
    caregiver?: number;
    doctor?: number;
    nurse?: number;
    socialWorker?: number;
    singleRm?: number;
    doubleRm?: number;
    tripleRm?: number;
    quadrupleRm?: number;
    programRoom?: number;
    diningKitchen?: number;
    bath?: number;

    programs?: Array<any>;
};

export type FacilityDetailDTO = {
    instCode?: string;
    kindCode?: string;
    name?: string;
    roadCode?: string;      // DB 원값
    fullRoadAddr?: string;  // 변환된 전체 주소
    lat?: string;
    lng?: string;
    postNo?: string;
    phone?: string;

    grade?: string;
    totalScore?: number;
    opScore?: number;
    safetyScore?: number;
    rightsScore?: number;
    processScore?: number;
    resultScore?: number;

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

/** 지도/검색용 전체 리스트 */
export async function fetchFacilitiesLiteAll(): Promise<FacilityLite[]> {
    const url = "http://localhost:8080/ltc/list/lite";

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return [];

    return await res.json();
}

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

    return {
        instCode: s.instCode,
        kindCode: s.kindCode,
        name: s.name,
        roadCode: s.roadCode,
        fullRoadAddr: s.fullRoadAddr,
        lat: s.lat,
        lng: s.lng,
        postNo: s.postNo,
        phone: s.phone,

        grade: s.grade,
        totalScore: s.totalScore,
        opScore: s.opScore,
        safetyScore: s.safetyScore,
        rightsScore: s.rightsScore,
        processScore: s.processScore,
        resultScore: s.resultScore,

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

/** 유사도 조회 */
export type SimilarFacility = {
    instCode: string;
    kindCode: string;
    name: string;
    fullRoadAddr?: string;
    score?: number;
};

export async function fetchSimilarFacilities(
    instCode: string,
    size = 5,
): Promise<SimilarFacility[]> {

    const url = new URL(
        `http://localhost:8080/ltc/similar/${encodeURIComponent(instCode)}`
    );
    url.searchParams.set("size", String(size));

    const res = await fetch(url.toString(), { credentials: "include" });
    if (!res.ok) return [];

    const raw = await res.json();

    return raw.map((r: any) => ({
        instCode: r.instCode,
        kindCode: r.kindCode,
        name: r.name,
        fullRoadAddr: r.fullRoadAddr || "-",   // 🔥 핵심
        score: (Array.isArray(r.similar) && typeof r.similar[0]?.score === "number")
            ? r.similar[0].score
            : 0
    }));
}


