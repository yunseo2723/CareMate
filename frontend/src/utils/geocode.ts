type In = {
    id: string;
    name: string;
    address?: string;
    hint?: string; // 시도명
    post?: string; // 우편번호
    lat?: number;
    lng?: number;
};

type Out = In & { address?: string; lat?: number; lng?: number };

const getKakao = (): typeof window.kakao | null =>
    (window as any)?.kakao?.maps ? (window as any).kakao : null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cacheGet(id: string) {
    try { const s = localStorage.getItem(`geo:${id}`); return s ? JSON.parse(s) : null; }
    catch { return null; }
}
function cacheSet(id: string, v: {lat:number;lng:number;address?:string}) {
    try { localStorage.setItem(`geo:${id}`, JSON.stringify(v)); } catch {}
}

function addressSearch(addr: string): Promise<{lat:number;lng:number;address?:string}|null> {
    const kakao = getKakao(); if (!kakao) return Promise.resolve(null);
    return new Promise((resolve) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(addr, (result: any[], status: any) => {
            if (status === kakao.maps.services.Status.OK && result?.length) {
                const r = result[0];
                resolve({ lat: Number(r.y), lng: Number(r.x), address: r.address?.address_name });
            } else resolve(null);
        });
    });
}

function keywordSearch(q: string): Promise<{lat:number;lng:number;address?:string}|null> {
    const kakao = getKakao(); if (!kakao) return Promise.resolve(null);
    return new Promise((resolve) => {
        const places = new kakao.maps.services.Places();
        places.keywordSearch(q, (data: any[], status: any) => {
            if (status === kakao.maps.services.Status.OK && data?.length) {
                const d = data[0];
                resolve({ lat: Number(d.y), lng: Number(d.x), address: d.road_address_name || d.address_name });
            } else resolve(null);
        });
    });
}

/** 좌표가 없으면 address → (우편번호+이름) → (시도명+이름) 순서로 보강 */
async function geocodeOne(r: In): Promise<Out> {
    if (Number.isFinite(r.lat) && Number.isFinite(r.lng)) return r;

    const cached = cacheGet(r.id);
    if (cached) return { ...r, ...cached };

    let ans: {lat:number;lng:number;address?:string} | null = null;

    if (r.address && r.address.length > 2) {
        ans = await addressSearch(r.address);
    }
    if (!ans && r.post) {
        ans = await addressSearch(`(${r.post}) ${r.name}`);
    }
    if (!ans) {
        const key = r.hint ? `${r.hint} ${r.name}` : r.name;
        if (key && key.length > 1) ans = await keywordSearch(key);
    }

    if (ans) {
        cacheSet(r.id, ans);
        return { ...r, ...ans };
    }
    return r;
}

export async function geocodeBulk(rows: In[], concurrency = 5): Promise<Out[]> {
    const out: Out[] = Array(rows.length);
    let i = 0;
    const worker = async () => {
        while (i < rows.length) {
            const idx = i++;
            out[idx] = await geocodeOne(rows[idx]);
            await sleep(100); // API 부담 완화
        }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    return out;
}
