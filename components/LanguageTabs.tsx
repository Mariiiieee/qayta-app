"use client";

import { useLanguage, type Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["uz", "ru", "en"];

export function LanguageTabs() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-2" role="tablist" aria-label="Til / Язык / Language">
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setLang(l)}
            className={`h-12 w-14 rounded-md text-[13px] font-medium uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
              active
                ? "bg-amber text-ink-900"
                : "bg-paper text-ink-600 border border-rule"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
