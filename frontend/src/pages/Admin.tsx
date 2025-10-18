import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const AUTH_CARD =
    "mx-auto w-full max-w-xl md:max-w-2xl rounded-2xl border bg-white p-8 shadow-sm";
const INPUT =
    "w-full rounded-md border px-3 h-11 text-base disabled:bg-slate-50";

type RequestCodeResp = { phoneMask?: string; maskedPhone?: string; message?: string };

// 응답 바디를 '한 번만' 읽는 헬퍼
async function readBody<T = unknown>(res: Response): Promise<T | string> {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        try {
            return (await res.json()) as T;
        } catch {
            return {} as T;
        }
    }
    try {
        return await res.text();
    } catch {
        return "";
    }
}

export default function Admin() {
    const { authFetch } = useAuth();
    const [careMateId, setCareMateId] = useState<number | "">("");
    const [maskedPhone, setMaskedPhone] = useState<string | null>(null);

    const [isRequesting, setIsRequesting] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const [code, setCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const startCooldown = (sec = 60) => {
        setCooldown(sec);
        const t = setInterval(() => {
            setCooldown((s) => {
                if (s <= 1) {
                    clearInterval(t);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    };

    const requestCode = async () => {
        if (careMateId === "" || careMateId <= 0) {
            alert("요양원 번호(careMateId)를 입력하세요.");
            return;
        }
        try {
            setIsRequesting(true);
            setVerified(false);
            setMaskedPhone(null);
            setCode("");

            // ✅ 보호 API는 authFetch 사용 (Authorization 자동 부착 + 401 처리)
            const res = await authFetch(
                "http://localhost:8080/admin/onboarding/request-code",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ careMateId: Number(careMateId) }),
                }
            );

            const body = await readBody<RequestCodeResp>(res); // ← 한 번만 읽기
            if (!res.ok) {
                const msg =
                    typeof body === "string" ? body : body?.message || "인증번호 요청에 실패했습니다.";
                console.error(body);
                alert(msg);
                return;
            }

            // 서버가 phoneMask 또는 maskedPhone 중 하나를 줄 수 있으므로 병합 처리
            const masked =
                typeof body === "string" ? "" : body.phoneMask ?? body.maskedPhone ?? "";
            setMaskedPhone(masked);
            startCooldown(60);
            alert("인증번호를 전송했습니다. 휴대전화의 문자 또는 ARS를 확인하세요.");
        } catch (e) {
            console.error(e);
            alert("요청 중 오류가 발생했습니다.");
        } finally {
            setIsRequesting(false);
        }
    };

    const verify = async () => {
        if (careMateId === "" || careMateId <= 0) {
            alert("요양원 번호를 입력하세요.");
            return;
        }
        if (!code.trim()) {
            alert("수신한 인증번호를 입력하세요.");
            return;
        }
        try {
            setIsVerifying(true);
            const res = await authFetch(
                "http://localhost:8080/admin/onboarding/verify",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        careMateId: Number(careMateId),
                        code: code.trim(),
                    }),
                }
            );

            const body = await readBody<any>(res); // ← 한 번만
            if (res.ok) {
                setVerified(true);
                alert("관리자 인증이 완료되었습니다!");
            } else {
                const msg =
                    typeof body === "string" ? body : body?.message || "인증에 실패했습니다. 번호를 다시 확인하세요.";
                console.error(body);
                alert(msg);
            }
        } catch (e) {
            console.error(e);
            alert("인증 처리 중 오류가 발생했습니다.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className={AUTH_CARD}>
            <h2 className="mb-6 text-2xl font-semibold">관리자 인증 (요양원 온보딩)</h2>

            {/* careMateId 입력 + 인증번호 요청 */}
            <div className="space-y-2">
                <label className="mb-1 block text-sm">요양원 번호 (careMateId)</label>
                <div className="flex gap-2">
                    <input
                        inputMode="numeric"
                        className={INPUT + " flex-1"}
                        placeholder="예) 1"
                        value={careMateId}
                        onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "");
                            setCareMateId(v === "" ? "" : Number(v));
                            setVerified(false);
                        }}
                        disabled={isRequesting}
                    />
                    <button
                        type="button"
                        onClick={requestCode}
                        disabled={isRequesting || careMateId === "" || cooldown > 0}
                        className="shrink-0 rounded-md border px-3 h-11 text-base hover:bg-slate-50 disabled:opacity-50"
                    >
                        {cooldown > 0 ? `재전송(${cooldown}s)` : isRequesting ? "요청중..." : "인증번호 요청"}
                    </button>
                </div>
                {maskedPhone !== null && (
                    <p className="text-sm text-slate-600">
                        수신번호: <span className="font-medium">{maskedPhone || "비공개"}</span>
                    </p>
                )}
            </div>

            {/* 인증번호 입력 */}
            <div className="mt-5 space-y-2">
                <label className="mb-1 block text-sm">수신한 인증번호</label>
                <div className="flex gap-2">
                    <input
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="6자리"
                        className={INPUT + " flex-1"}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        disabled={cooldown === 0 && maskedPhone === null}
                    />
                    <button
                        type="button"
                        onClick={verify}
                        disabled={!code || isVerifying}
                        className="shrink-0 rounded-md bg-slate-900 px-3 h-11 text-base text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {isVerifying ? "확인중..." : "인증"}
                    </button>
                </div>
                {verified && (
                    <div className="text-sm text-emerald-600">
                        인증 완료! 관리자 기능 사용이 가능합니다.
                    </div>
                )}
            </div>
        </div>
    );
}
