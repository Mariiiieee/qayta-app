"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { RoleIcon } from "@/components/RoleIcon";

type Role = "producer" | "recycler" | "weigher" | "carrier";

export default function RolePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);

  const roles: { id: Role; title: string; subtitle: string }[] = [
    { id: "producer", title: t.roleProducer, subtitle: t.roleProducerSub },
    { id: "recycler", title: t.roleRecycler, subtitle: t.roleRecyclerSub },
    { id: "weigher", title: t.roleWeigher, subtitle: t.roleWeigherSub },
    { id: "carrier", title: t.roleCarrier, subtitle: t.roleCarrierSub },
  ];

  const ROLE_ROUTES: Record<Role, string> = {
    producer: "/dashboard",
    recycler: "/recycler",
    weigher: "/weigher",
    carrier: "/carrier",
  };

  function handleContinue() {
    if (!selected) return;
    router.push(ROLE_ROUTES[selected]);
  }

  return (
    <main className="flex flex-1 justify-center bg-paper px-6">
      <div className="w-full max-w-[480px] py-6 flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/login")}
            aria-label={t.back}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            ←
          </button>
          <div className="flex flex-col">
            <h1 className="text-[28px] font-semibold leading-[1.2] text-ink-900">
              {t.roleTitle}
            </h1>
            <span className="text-[13px] font-medium uppercase text-ink-600">
              {t.roleStep(3, 3)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {roles.map((role) => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelected(role.id)}
                aria-pressed={isSelected}
                className={`flex h-[88px] w-full items-center rounded-md bg-card px-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                  isSelected
                    ? "border-2 border-amber-text"
                    : "border border-rule hover:bg-paper"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <RoleIcon name={role.id} />
                </span>
                <span className="ml-4 flex flex-1 flex-col">
                  <span className="text-[19px] font-medium leading-[1.35] text-ink-900">
                    {role.title}
                  </span>
                  <span className="text-[13px] font-medium leading-[1.4] text-ink-600">
                    {role.subtitle}
                  </span>
                </span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-text text-card"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7 L5.5 10.5 L12 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selected}
          onClick={handleContinue}
          className={`h-14 w-full rounded-md text-[16px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
            selected
              ? "bg-amber text-ink-900"
              : "bg-rule text-ink-500 cursor-not-allowed"
          }`}
        >
          {t.roleContinue}
        </button>
      </div>
    </main>
  );
}
