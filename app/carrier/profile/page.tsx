"use client";

import { useRouter } from "next/navigation";
import { useLanguage, type Lang } from "@/lib/i18n";

const user = {
  name: "Bekzod",
  company: "Yakka haydovchi",
};

export default function CarrierProfilePage() {
  const { lang, setLang } = useLanguage();
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[480px] flex-col px-6 py-6">
        <h1 className="text-[28px] font-semibold leading-[1.2] text-ink-900">Profil</h1>

        <div className="mt-6 flex flex-col rounded-md bg-card px-4">
          <div className="flex min-h-[48px] items-center justify-between border-b border-rule-soft py-2 text-[16px]">
            <span className="text-ink-600">Ism</span>
            <span className="text-ink-900">{user.name}</span>
          </div>
          <div className="flex min-h-[48px] items-center justify-between border-b border-rule-soft py-2 text-[16px]">
            <span className="text-ink-600">Kompaniya</span>
            <span className="text-ink-900">{user.company}</span>
          </div>
          <div className="flex min-h-[48px] items-center justify-between py-2 text-[16px]">
            <span className="text-ink-600">Til</span>
            <div className="flex overflow-hidden rounded-md border border-rule">
              {(["uz", "ru", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={`flex h-10 w-11 items-center justify-center text-[13px] font-medium uppercase focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-text ${
                    lang === l ? "bg-amber text-ink-900" : "text-ink-600 hover:bg-paper"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-8 w-fit text-left text-[16px] text-short underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          Chiqish
        </button>
      </div>
    </main>
  );
}
