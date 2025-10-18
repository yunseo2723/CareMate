import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type NotiPrefs = {
    // 채널
    email: boolean;
    sms: boolean;
    push: boolean;

    // 알림 종류
    marketing: boolean;      // 마케팅/프로모션
    service: boolean;        // 서비스 공지 (권장: 항상 on)
    activity: boolean;       // 내 활동(댓글/답글/리뷰) 알림

    // 빈도
    digest: "realtime" | "daily" | "weekly";
};

// 기본값(서버에 설정이 없을 때)
const DEFAULT_PREFS: NotiPrefs = {
    email: true,
    sms: false,
    push: true,

    marketing: false,
    service: true,
    activity: true,

    digest: "realtime",
};

const ROW = "flex items-center justify-between rounded-md border px-4 py-3";
const SWITCH =
    "h-5 w-10 cursor-pointer rounded-full bg-slate-200 relative transition";
const KNOB =
    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition";

export default function NotificationsPage() {
    const { authFetch } = useAuth();
    const [prefs, setPrefs] = useState<NotiPrefs>(DEFAULT_PREFS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 서버에서 불러오기
    useEffect(() => {
        let ignore = false;

        (async () => {
            try {
                const res = await authFetch("http://localhost:8080/users/me/notifications");
                const txt = await res.text().catch(() => "");
                if (!res.ok) {
                    // 설정이 아직 없으면 기본값 유지
                    console.warn("[notifications] load failed:", res.status, txt);
                    return;
                }
                const json = txt ? JSON.parse(txt) : {};
                const data = json?.data ?? json;
                if (!ignore && data) {
                    setPrefs((p) => ({ ...p, ...data }));
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [authFetch]);

    const toggle = (key: keyof NotiPrefs) =>
        setPrefs((p) => ({ ...p, [key]: typeof p[key] === "boolean" ? !p[key] : p[key] }));

    const onSave = async () => {
        setSaving(true);
        try {
            // 백엔드가 PUT을 기대한다고 가정하고 시도 → 실패하면 PATCH 재시도
            const reqInit = (method: "PUT" | "PATCH") => ({
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prefs),
            });

            let res = await authFetch("http://localhost:8080/users/me/notifications", reqInit("PUT"));
            if (!res.ok) {
                // PATCH fallback
                res = await authFetch("http://localhost:8080/users/me/notifications", reqInit("PATCH"));
            }
            const text = await res.text().catch(() => "");
            if (res.ok) {
                alert("알림 설정이 저장되었습니다.");
            } else {
                console.error(text);
                alert(text || "저장에 실패했습니다.");
            }
        } catch (e) {
            console.error(e);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-slate-600">알림 설정을 불러오는 중…</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">알림 설정</h2>

            {/* 채널 */}
            <section className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500">수신 채널</h3>

                <div className={ROW}>
                    <div>
                        <div className="font-medium">이메일</div>
                        <div className="text-xs text-slate-600">계정/보안, 활동 소식 등 이메일 수신</div>
                    </div>
                    <button
                        onClick={() => toggle("email")}
                        className={SWITCH}
                        aria-pressed={prefs.email}
                    >
            <span
                className={KNOB}
                style={{ left: prefs.email ? "1.5rem" : "0.25rem" }}
            />
                    </button>
                </div>

                <div className={ROW}>
                    <div>
                        <div className="font-medium">문자 (SMS)</div>
                        <div className="text-xs text-slate-600">긴급 알림/본인인증 등 문자 수신</div>
                    </div>
                    <button
                        onClick={() => toggle("sms")}
                        className={SWITCH}
                        aria-pressed={prefs.sms}
                    >
            <span
                className={KNOB}
                style={{ left: prefs.sms ? "1.5rem" : "0.25rem" }}
            />
                    </button>
                </div>

                <div className={ROW}>
                    <div>
                        <div className="font-medium">푸시 알림</div>
                        <div className="text-xs text-slate-600">브라우저/앱의 즉시 푸시 알림</div>
                    </div>
                    <button
                        onClick={() => toggle("push")}
                        className={SWITCH}
                        aria-pressed={prefs.push}
                    >
            <span
                className={KNOB}
                style={{ left: prefs.push ? "1.5rem" : "0.25rem" }}
            />
                    </button>
                </div>
            </section>

            {/* 알림 종류 */}
            <section className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500">알림 종류</h3>

                <div className={ROW}>
                    <div>
                        <div className="font-medium">서비스 공지</div>
                        <div className="text-xs text-slate-600">필수 공지/정책 변경/보안 안내</div>
                    </div>
                    <button
                        onClick={() => toggle("service")}
                        className={SWITCH}
                        aria-pressed={prefs.service}
                    >
            <span
                className={KNOB}
                style={{ left: prefs.service ? "1.5rem" : "0.25rem" }}
            />
                    </button>
                </div>

                <div className={ROW}>
                    <div>
                        <div className="font-medium">내 활동 알림</div>
                        <div className="text-xs text-slate-600">내 리뷰/댓글/답글 관련 이벤트</div>
                    </div>
                    <button
                        onClick={() => toggle("activity")}
                        className={SWITCH}
                        aria-pressed={prefs.activity}
                    >
            <span
                className={KNOB}
                style={{ left: prefs.activity ? "1.5rem" : "0.25rem" }}
            />
                    </button>
                </div>

                <div className={ROW}>
                    <div>
                        <div className="font-medium">마케팅 정보</div>
                        <div className="text-xs text-slate-600">프로모션/혜택/이벤트 수신 동의</div>
                    </div>
                    <button
                        onClick={() => toggle("marketing")}
                        className={SWITCH}
                        aria-pressed={prefs.marketing}
                    >
            <span
                className={KNOB}
                style={{ left: prefs.marketing ? "1.5rem" : "0.25rem" }}
            />
                    </button>
                </div>
            </section>

            {/* 빈도 */}
            <section className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500">알림 빈도</h3>
                <div className="grid gap-2 sm:grid-cols-3">
                    {(["realtime", "daily", "weekly"] as const).map((v) => (
                        <label key={v} className="flex items-center gap-2 rounded-md border px-4 py-3 cursor-pointer">
                            <input
                                type="radio"
                                name="digest"
                                value={v}
                                checked={prefs.digest === v}
                                onChange={() => setPrefs((p) => ({ ...p, digest: v }))}
                            />
                            <span className="text-sm">
                {v === "realtime" ? "실시간" : v === "daily" ? "하루에 한 번" : "주 1회"}
              </span>
                        </label>
                    ))}
                </div>
            </section>

            <div className="pt-2">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="rounded-md bg-slate-900 text-white px-4 h-10 disabled:opacity-50"
                >
                    {saving ? "저장 중…" : "저장"}
                </button>
            </div>
        </div>
    );
}
