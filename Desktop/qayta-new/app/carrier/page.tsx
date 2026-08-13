"use client";

import { CARRIER_LOADS, formatKg } from "@/lib/carrierData";

function StatusBadge({ status }: { status: "paid" | "pending" }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`text-micro font-semibold ${isPaid ? "text-verified" : "text-amber-text"}`}
    >
      {isPaid ? "To'landi" : "Kutilmoqda"}
    </span>
  );
}

export default function CarrierLoadsPage() {
  return (
    <main className="flex flex-1 justify-center px-6 py-8">
      <div className="flex w-full max-w-[720px] flex-col gap-6">
        <h1 className="text-headline text-ink-900">Yuklarim</h1>

          <div className="flex flex-col rounded border border-rule-soft bg-card">
            {CARRIER_LOADS.map((load, i) => (
              <div
                key={load.id}
                className={`flex h-12 items-center gap-4 px-4 ${
                  i !== CARRIER_LOADS.length - 1 ? "border-b border-rule-soft" : ""
                }`}
              >
                <span className="w-[140px] shrink-0 truncate text-body text-ink-900">
                  {load.recycler}
                </span>
                <span className="w-16 shrink-0 text-micro text-ink-600">{load.material}</span>
                <span className="w-24 shrink-0 font-mono text-body text-ink-900">
                  {formatKg(load.weightKg)}
                </span>
                <span className="flex-1 text-right text-micro text-ink-500">{load.date}</span>
                <span className="w-24 shrink-0 text-right">
                  <StatusBadge status={load.status} />
                </span>
              </div>
            ))}
          </div>
      </div>
    </main>
  );
}
