// src/api/ltc.ts
import type { Facility } from "../types/facility";

/* =========================
 * 타입 정의 (네가 쓰던 형태 유지)
 * ========================= */
export type StaffStats = {
    capacityTotal?: number;        // 정원
    residentMale?: number;         // 현재 입소(남)
    residentFemale?: number;       // 현재 입소(여)
    nurseCount?: number;           // 간호사
    doctorCount?: number;          // 의사(상근+촉탁 합산)
    caregiverCount?: number;       // 요양보호사(1/2/유예 합산)
    otherStaffCount?: number;      // 기타 인원(사무/조리/청소/관리/기타 등 합산)
};

export type RoomStats = {
    single?: number; double?: number; triple?: number; quadruple?: number; etc?: number;
    totalRooms?: number; special?: number;
};

export type Amenities = {
    hasElevator?: boolean;
    hasCCTV?: boolean;
    hasLaundry?: boolean;
    hasMealService?: boolean;
    hasRehabProgram?: boolean;  // 재활/인지 프로그램
    has24hDesk?: boolean;
    parking?: "none" | "limited" | "free";
};

export type Transport = {
    nearestSubway?: string;
    nearestBusStop?: string;
    shuttleInfo?: string;
    directionsNote?: string; // 찾아오는 길(텍스트)
};

export type Links = {
    homepage?: string;
    phone?: string;
};

export type NonpayItem = { item?: string; unit?: string; price?: number; note?: string };
export type ContractItem = { title?: string; unit?: string; price?: number; note?: string };

export type FacilitySummaryDTO = {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    capacityTotal?: number;
    residentMale?: number;
    residentFemale?: number;
    lat?: number;
    lng?: number;      // 백엔드가 lon을 주면 아래에서 lng로 변환
    rating?: number;
    type?: string;
    sido?: string;
    sgg?: string;
    monthlyCost?: number;
};

export type FacilityDetailDTO = {
    summary: FacilitySummaryDTO;
    staff?: StaffStats;
    rooms?: RoomStats;
    amenities?: Amenities;
    transport?: Transport;
    links?: Links;
    nonpayItems?: NonpayItem[];
    contracts?: ContractItem[];
};

/* =========================
 * 목록 API (이미 쓰던 형태 유지)
 * ========================= */
type FacilityRowFromBackend = {
    id: string;
    name: string;
    type?: string;
    sido?: string;
    sgg?: string;
    capacityTotal?: number;
    residentMale?: number;
    residentFemale?: number;
    lat?: number;
    lon?: number;
};

function extractArray(raw: unknown): FacilityRowFromBackend[] {
    if (!raw) return [];
    const anyRaw = raw as any;
    if (Array.isArray(anyRaw)) return anyRaw;
    if (Array.isArray(anyRaw?.content)) return anyRaw.content;
    return [];
}

/** ✅ 목록은 무조건 Facility[]로 확정 매핑해서 반환 */
export async function fetchFacilities(): Promise<Facility[]> {
    const res = await fetch("http://localhost:8080/facilities", { credentials: "include" });
    if (!res.ok) {
        console.error("[api] /facilities failed:", res.status, await res.text().catch(() => ""));
        return [];
    }
    const raw = await res.json().catch(() => null);
    const list = extractArray(raw);

    const mapped: Facility[] = list
        .map((f) => {
            const lat = Number(f.lat);
            const lng = Number(f.lon); // 🔁 lon -> lng
            return {
                id: f.id,
                name: f.name,
                address: [f.sido, f.sgg].filter(Boolean).join(" ") || "",
                phone: undefined,
                lat,
                lng,
                rating: 0,
                monthlyCost: 0,
                careLevel: f.type ?? "",
                bedsAvailable: Math.max(
                    0,
                    (f.capacityTotal ?? 0) - ((f.residentMale ?? 0) + (f.residentFemale ?? 0))
                ),
            } as Facility;
        })
        .filter((f) => Number.isFinite(f.lat) && Number.isFinite(f.lng));

    console.log("[api] facilities mapped:", mapped.length);
    console.table(mapped.slice(0, 10));
    return mapped;
}

/* =========================
 * 상세 API 매퍼
 * 백엔드 응답 { facility: {...} } 를 가정
 * ========================= */

function n(v: unknown): number | undefined {
    const x = Number(v);
    return Number.isFinite(x) ? x : undefined;
}

function pickFirstString(...candidates: unknown[]): string | undefined {
    for (const c of candidates) {
        if (typeof c === "string" && c.trim().length > 0) return c.trim();
    }
    return undefined;
}

export async function fetchFacilityDetail(id: string): Promise<FacilityDetailDTO> {
    const res = await fetch(`http://localhost:8080/facilities/${id}`, {
        credentials: "include",
    });
    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "상세를 불러오지 못했습니다.");
    }

    const raw = await res.json().catch(() => null);
    const f = raw?.data?.facility ?? raw?.facility ?? raw; // 어떤 래핑이든 대응
    console.log("[detail] facility:", f);

    // ----- summary -----
    const phone = pickFirstString(f?.tel, f?.phone, f?.telNo, f?.phoneNumber);
    const address = pickFirstString(
        f?.address,
        f?.addr,
        [f?.sido, f?.sgg].filter(Boolean).join(" ")
    );

    const summary: FacilitySummaryDTO = {
        id: f?.id ?? id,
        name: f?.name ?? id,
        address,
        phone,
        lat: n(f?.lat),
        lng: n(f?.lon ?? f?.lng ?? f?.longitude),
        type: f?.type,
        sido: f?.sido,
        sgg: f?.sgg,
        capacityTotal: n(f?.capacityTotal),
        residentMale: n(f?.residentMale),
        residentFemale: n(f?.residentFemale),
        // rating / monthlyCost 는 원데이터에 없으니 생략
    };

    // ----- staff (객체형 합산) -----
    const staff: StaffStats = {
        capacityTotal: n(f?.capacityTotal),
        residentMale: n(f?.residentMale),
        residentFemale: n(f?.residentFemale),
        nurseCount: n(f?.staffNurse),
        doctorCount: (n(f?.staffDoctorFulltime) ?? 0) + (n(f?.staffDoctorContract) ?? 0) || undefined,
        caregiverCount:
            (n(f?.staffCaregiverLevel1) ?? 0) +
            (n(f?.staffCaregiverLevel2) ?? 0) +
            (n(f?.staffCaregiverDeferred) ?? 0) || undefined,
        otherStaffCount: [
            f?.staffOfficeHead, f?.staffSocialWorker, f?.staffNurseAide, f?.staffDentalHygienist,
            f?.staffPhysicalTherapist, f?.staffOccupationalTherapist, f?.staffOffice, f?.staffNutritionist,
            f?.staffCook, f?.staffCleaner, f?.staffManager, f?.staffAssistant, f?.staffEtc
        ].map(n).reduce((acc, v) => acc + (v ?? 0), 0) || undefined,
    };

    // ----- rooms -----
    const rooms: RoomStats = {
        totalRooms: n(f?.roomCount),
        single: n(f?.room1p),
        double: n(f?.room2p),
        triple: n(f?.room3p),
        quadruple: n(f?.room4p),
        special: n(f?.specialRoom),
        // 기타 등은 별도 필드가 없으니 생략
    };

    // ----- amenities (간단 유무 태그 변환) -----
    const amenities: Amenities = {
        hasLaundry: (n(f?.laundryDryCount) ?? 0) > 0 || undefined,
        hasMealService: (n(f?.diningKitchen) ?? 0) > 0 || undefined,
        hasRehabProgram:
            (n(f?.adlTrainingRoom) ?? 0) > 0 || (n(f?.programRoom) ?? 0) > 0 || undefined,
        // 엘리베이터/CCTV/24시간 데스크는 더미 데이터에 없음 → 필요 시 백엔드 필드 매핑
        hasElevator: undefined,
        hasCCTV: undefined,
        has24hDesk: undefined,
        parking: (() => {
            const p: string | undefined = f?.parking;
            if (!p) return undefined;
            const t = p.trim();
            if (/(무료|free|무상)/i.test(t)) return "free";
            if (/(없음|불가|no)/i.test(t)) return "none";
            return "limited"; // "지하 10대"처럼 숫자 있으면 제한적
        })(),
    };

    // ----- transport / links -----
    const transport: Transport = {
        directionsNote: f?.transport || undefined,
        // 필요 시 문자열 파싱해서 역/정류장 분리 가능
    };

    const links: Links = {
        homepage: pickFirstString(f?.homepage, f?.url, f?.homePage),
        phone,
    };

    // ----- 비급여/계약 (단건 필드를 표 형태로 노출) -----
    const nonpayItems: NonpayItem[] =
        f?.nonpayKindName || f?.nonpayAmount
            ? [{ item: f.nonpayKindName, unit: undefined, price: n(f.nonpayAmount), note: f.nonpayBasis }]
            : [];

    const contracts: ContractItem[] =
        f?.contractOrgName || f?.contractStart
            ? [{
                title: f.contractOrgName,
                unit: [f?.contractStart, f?.contractEnd].filter(Boolean).join(" ~ ") || undefined,
                price: undefined,
                note: undefined,
            }]
            : [];

    // ----- 최종 반환 -----
    return {
        summary,
        staff,
        rooms,
        amenities,
        transport,
        links,
        nonpayItems,
        contracts,
    };
}
