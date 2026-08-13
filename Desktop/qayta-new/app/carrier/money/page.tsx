"use client";

import { MONTH_PAYOUTS, formatKg, formatSum } from "@/lib/carrierData";

function StatusBadge({ status }: { status: "paid" | "pending" }) {
  const isPaid = status === "paid";
  return (
    <span className={`text-micro font-semibold ${isPaid ? "text-verified" : "text-amber-text"}`}>
      {isPaid ? "To'landi" : "Kutilmoqda"}
    </span>
  );
}

export default function CarrierMoneyPage() {
  const total = MONTH_PAYOUTS.reduce((sum, p) => sum + p.amountSum, 0);

  return (
    <main className="flex flex-1 justify-center px-6 py-8">
      <div className="flex w-full max-w-[720px] flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-micro text-ink-600">Bu oy topilgan:</span>
          <span className="font-mono text-display text-ink-900">{formatSum(total)}</span>
        </div>

        <div className="flex flex-col rounded border border-rule-soft bg-card">
          {MONTH_PAYOUTS.map((p, i) => (
              <div
                key={p.id}
                className={`flex h-12 items-center gap-4 px-4 ${
                  i !== MONTH_PAYOUTS.length - 1 ? "border-b border-rule-soft" : ""
                }`}
              >
                <span className="w-[140px] shrink-0 truncate text-body text-ink-900">
                  {p.recycler}
                </span>
                <span className="w-24 shrink-0 font-mono text-body text-ink-900">
                  {formatKg(p.weightKg)}
                </span>
                <span className="flex-1 text-right font-mono text-body text-ink-900">
                  {formatSum(p.amountSum)}
                </span>
                <span className="w-24 shrink-0 text-right">
                  <StatusBadge status={p.status} />
                </span>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
