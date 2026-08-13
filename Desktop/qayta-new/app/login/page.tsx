"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { LanguageTabs } from "@/components/LanguageTabs";
import { GoogleIcon } from "@/components/GoogleIcon";

function formatPhone(digits: string) {
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return parts.filter(Boolean).join(" ");
}

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [digits, setDigits] = useState("");

  const formatted = useMemo(() => formatPhone(digits), [digits]);
  const complete = digits.length === 9;

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setDigits(raw);
  }

  function handleSubmit() {
    if (!complete) return;
    router.push(`/login/verify?phone=${digits}`);
  }

  function handleGoogle() {
    router.push("/role");
  }

  return (
    <main className="flex flex-1 justify-center bg-paper px-6">
      <div className="w-full max-w-[440px] py-16 flex flex-col gap-8">
        <div>
          <h1 className="text-left text-[28px] font-semibold leading-[1.2] text-ink-900">
            QAYTA
          </h1>
          <p className="text-left text-[23px] font-semibold leading-[1.3] text-ink-600 mt-2">
            {t.subtitle}
          </p>
        </div>

        <LanguageTabs />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="phone"
            className="text-[13px] font-medium uppercase text-ink-600"
          >
            {t.phoneLabel}
          </label>
          <div className="flex h-14 rounded-md border border-rule overflow-hidden bg-card focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-amber-text">
            <div className="flex items-center justify-center w-16 shrink-0 text-ink-500 font-mono text-[16px] border-r border-rule select-none">
              +998
            </div>
            <input
              id="phone"
              type="text"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder={t.phonePlaceholder}
              value={formatted}
              onChange={handlePhoneChange}
              className="flex-1 px-4 bg-transparent text-[16px] font-mono text-ink-900 placeholder:text-ink-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-rule-soft" />
          <span className="text-[16px] text-ink-500">{t.or}</span>
          <div className="flex-1 h-px bg-rule-soft" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="relative h-14 w-full rounded-md bg-card border border-rule flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          <span className="absolute left-4 flex items-center">
            <GoogleIcon />
          </span>
          <span className="text-[16px] text-ink-900">{t.google}</span>
        </button>

        <button
          type="button"
          disabled={!complete}
          onClick={handleSubmit}
          className={`h-14 w-full rounded-md text-[16px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
            complete
              ? "bg-amber text-ink-900"
              : "bg-rule text-ink-500 cursor-not-allowed"
          }`}
        >
          {t.continue}
        </button>
      </div>
    </main>
  );
}
