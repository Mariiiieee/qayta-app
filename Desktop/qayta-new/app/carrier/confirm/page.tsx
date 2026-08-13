"use client";

import { useState } from "react";
import { DISPUTE_REASONS, PENDING_PAYOUT, formatKg, formatSum } from "@/lib/carrierData";

type Stage = "idle" | "disputing" | "confirmed";

export default function CarrierConfirmPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [reason, setReason] = useState<string | null>(null);
  const load = PENDING_PAYOUT;

  return (
    <main className="flex flex-1 justify-center px-6 py-8">
      <div className="flex w-full max-w-[480px] flex-col gap-6">
        <h1 className="text-headline text-ink-900">Pul olish</h1>

          <div className="flex flex-col gap-6 rounded bg-card p-6">
            <div className="flex flex-col gap-1">
              <span className="text-title-s text-ink-900">{load.recycler}</span>
              <span className="font-mono text-display text-ink-900">
                {formatKg(load.weightKg)} &nbsp; {load.material}
              </span>
            </div>

            <div className="relative min-h-[220px]">
              <div
                className={`flex flex-col gap-6 transition-opacity duration-200 ${
                  stage === "confirmed" ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                {stage === "idle" && (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="text-micro text-ink-600">Sizga:</span>
                      <span className="font-mono text-display text-ink-900">
                        {formatSum(load.amountSum)}
                      </span>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[88px] w-[88px] rounded bg-rule-soft"
                    />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStage("disputing")}
                        className="h-14 flex-1 rounded border border-rule text-body font-medium text-ink-900 transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                      >
                        Noto&apos;g&apos;ri
                      </button>
                      <button
                        type="button"
                        onClick={() => setStage("confirmed")}
                        className="h-14 flex-1 rounded bg-amber text-body font-semibold text-ink-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                      >
                        Tasdiqlash
                      </button>
                    </div>
                  </>
                )}

                {stage === "disputing" && (
                  <>
                    <div className="flex flex-col gap-3">
                      {DISPUTE_REASONS.map((r) => (
                        <label
                          key={r.id}
                          className="flex h-12 items-center gap-3 rounded border border-rule-soft px-4 text-body text-ink-900"
                        >
                          <input
                            type="radio"
                            name="dispute-reason"
                            value={r.id}
                            checked={reason === r.id}
                            onChange={() => setReason(r.id)}
                            className="h-4 w-4 accent-[var(--amber-text)]"
                          />
                          {r.label}
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={!reason}
                      className={`h-12 w-full rounded text-body font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                        reason
                          ? "border border-rule text-ink-900 hover:bg-paper"
                          : "border border-rule-soft text-ink-500 cursor-not-allowed"
                      }`}
                    >
                      Yuborish
                    </button>
                  </>
                )}
              </div>

              <div
                aria-hidden={stage !== "confirmed"}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-200 ${
                  stage === "confirmed" ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-verified text-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12.5 L10 17.5 L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-title-s font-medium text-verified">To&apos;lov yo&apos;lda</span>
              </div>
            </div>
          </div>
      </div>
    </main>
  );
}
