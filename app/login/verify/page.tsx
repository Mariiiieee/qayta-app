"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;
const EXPIRE_SECONDS = 120;
const VALID_CODE = "123456";

function VerifyForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";

  const [values, setValues] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [wrong, setWrong] = useState(false);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const [expireLeft, setExpireLeft] = useState(EXPIRE_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const expired = expireLeft <= 0;
  const status: "idle" | "wrong" | "expired" = expired ? "expired" : wrong ? "wrong" : "idle";

  useEffect(() => {
    if (resendLeft <= 0) return;
    const id = setInterval(() => setResendLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendLeft]);

  useEffect(() => {
    if (expireLeft <= 0) return;
    const id = setInterval(() => setExpireLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [expireLeft]);

  function verify(code: string) {
    if (code === VALID_CODE) {
      router.push("/role");
    } else {
      setWrong(true);
    }
  }

  function handleChange(index: number, raw: string) {
    if (status === "expired") return;
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    if (status === "wrong") setWrong(false);

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "") && next.join("").length === CODE_LENGTH) {
      verify(next.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    if (status === "expired") return;
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setValues(next);
    if (status === "wrong") setWrong(false);
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
    if (pasted.length === CODE_LENGTH) verify(pasted);
  }

  function handleResend() {
    if (resendLeft > 0) return;
    setValues(Array(CODE_LENGTH).fill(""));
    setWrong(false);
    setResendLeft(RESEND_SECONDS);
    setExpireLeft(EXPIRE_SECONDS);
    inputsRef.current[0]?.focus();
  }

  const boxBorder =
    status === "wrong"
      ? "border-short"
      : status === "expired"
      ? "border-rule"
      : "border-rule focus:border-amber-text";

  return (
    <main className="flex flex-1 justify-center bg-paper px-6">
      <div className="w-full max-w-[440px] py-16 flex flex-col gap-8">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="self-start text-[13px] font-medium uppercase text-ink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          ← {t.back}
        </button>

        <div>
          <h1 className="text-[23px] font-semibold leading-[1.3] text-ink-900">
            {t.otpTitle}
          </h1>
          <p className="text-[16px] leading-[1.5] text-ink-600 mt-2">
            {t.otpSubtitle(phone)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {values.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                disabled={status === "expired"}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 rounded-md border-2 text-center text-[23px] font-mono text-ink-900 bg-card outline-none disabled:bg-paper disabled:text-ink-500 ${boxBorder}`}
              />
            ))}
          </div>
          {status === "wrong" && (
            <p className="text-[16px] text-short">{t.otpWrong}</p>
          )}
          {status === "expired" && (
            <p className="text-[16px] text-short">{t.otpExpired}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendLeft > 0}
          className={`self-start text-[16px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
            resendLeft > 0 ? "text-ink-500 cursor-not-allowed" : "text-amber-text"
          }`}
        >
          {resendLeft > 0 ? t.resendWithTimer(resendLeft) : t.resend}
        </button>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
