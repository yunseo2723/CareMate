import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const nav = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");

    // 이메일 인증 관련 상태
    const [isSending, setIsSending] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [serverCode, setServerCode] = useState<string | null>(null);
    const [codeInput, setCodeInput] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [cooldown, setCooldown] = useState(0); // 재전송 쿨다운(초)

    const startCooldown = (sec = 60) => {
        setCooldown(sec);
        const timer = setInterval(() => {
            setCooldown((s) => {
                if (s <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    };

    const sendEmailCode = async () => {
        if (!email) {
            alert("이메일을 입력하세요.");
            return;
        }
        if (isVerified) {
            alert("이미 인증이 완료되었습니다.");
            return;
        }
        try {
            setIsSending(true);

            const res = await fetch("http://localhost:8080/signup/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || "전송 실패");
            }

            setCodeSent(true);
            setIsVerified(false);
            setCodeInput("");
            startCooldown(60);
            alert("인증번호를 이메일로 전송했습니다. 메일함을 확인하세요.");
        } catch (e) {
            alert("인증 메일 전송에 실패했습니다. 잠시 후 다시 시도하세요.");
        } finally {
            setIsSending(false);
        }
    };

    const verifyCode = async () => {
        if (!codeSent) return;
        const authNum = codeInput.trim();
        if (!authNum) {
            alert("인증코드를 입력하세요.");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/signup/emailAuth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, authNum }), // ← 백엔드가 authNum 필드명을 기대
            });

            const text = await res.text().catch(() => "");
            if (res.ok) {
                setIsVerified(true);
                alert("이메일 인증이 완료되었습니다!");
            } else {
                console.error("verify 400:", text);
                alert(text || "인증코드가 올바르지 않거나 만료되었습니다.");
            }
        } catch (e) {
            console.error(e);
            alert("인증 처리 중 오류가 발생했습니다. 다시 시도하세요.");
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pw !== pw2) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!isVerified) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }

        // /users/register 규격에 맞춘 요청 바디
        const payload = {
            username: email,     // 이메일 → username
            password: pw,        // 비밀번호
            nickname: name,      // 닉네임: 일단 이름과 동일하게 전송 (원하면 별도 입력 필드 만들기)
            name: name,          // 실명
        };

        try {
            const res = await fetch("http://localhost:8080/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const text = await res.text().catch(() => "");
            if (res.ok) {
                alert("회원가입이 완료되었습니다! 로그인 해주세요.");
                nav("/login");
            } else {
                console.error("register error:", text);
                alert(text || "회원가입에 실패했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8">
            <h2 className="mb-6 text-2xl font-semibold">회원가입</h2>

            <form onSubmit={onSubmit} className="space-y-5">
                {/* 이름 */}
                <div>
                    <label className="mb-1 block text-sm">이름</label>
                    <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* 이메일 + 인증 버튼 */}
                <div>
                    <label className="mb-1 block text-sm">이메일</label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            className="flex-1 rounded-md border px-3 py-2 text-sm disabled:bg-slate-50"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                // 이메일 수정되면 인증 상태 초기화
                                setIsVerified(false);
                                setCodeSent(false);
                                setServerCode(null);
                                setCodeInput("");
                            }}
                            required
                            disabled={isVerified}
                        />
                        <button
                            type="button"
                            onClick={sendEmailCode}
                            disabled={isSending || !email || isVerified || cooldown > 0}
                            className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                        >
                            {isVerified
                                ? "인증완료"
                                : cooldown > 0
                                    ? `재전송(${cooldown}s)`
                                    : isSending
                                        ? "전송중..."
                                        : "이메일 인증"}
                        </button>
                    </div>

                    {/* 인증코드 입력 영역 (전송 후 표시) */}
                    {codeSent && !isVerified && (
                        <div className="mt-2 flex gap-2">
                            <input
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="인증코드 6자리"
                                className="flex-1 rounded-md border px-3 py-2 text-sm"
                                value={codeInput}
                                onChange={(e) =>
                                    setCodeInput(e.target.value.replace(/\D/g, ""))
                                }
                            />
                            <button
                                type="button"
                                onClick={verifyCode}
                                className="shrink-0 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:opacity-90"
                            >
                                인증
                            </button>
                        </div>
                    )}
                </div>

                {/* 비밀번호 */}
                <div>
                    <label className="mb-1 block text-sm">비밀번호</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                    <label className="mb-1 block text-sm">비밀번호 확인</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={pw2}
                        onChange={(e) => setPw2(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!isVerified}
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                    가입하기
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
                이미 계정이 있나요?{" "}
                <Link to="/login" className="underline">
                    로그인
                </Link>
            </div>
        </div>
    );
}
