"use client";

import { useState } from "react";

type DisputedLoad = {
  id: string;
  material: string;
  driverKg: number;
  scaleKg: number;
  time: string;
};

const DISPUTED: DisputedLoad[] = [
  { id: "ld-2195", material: "PET", driverKg: 4200, scaleKg: 3900, time: "Bugun 11:58" },
  { id: "ld-2190", material: "PP", driverKg: 2100, scaleKg: 2260, time: "Kecha 15:04" },
];

function formatKg(n: number): string {
  return n.toLocaleString("en-US");
}

function DisputedCard({ item }: { item: DisputedLoad }) {
  const [splitOpen, setSplitOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [resolved, setResolved] = useState<string | null>(null);
  const diffKg = item.driverKg - item.scaleKg;
  const pct = ((diffKg / item.driverKg) * 100).toFixed(1);

  if (resolved) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-rule-soft bg-card p-4">
        <span className="text-body text-ink-900">{resolved}</span>
        <span className="text-[13px] text-ink-500">{item.time}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-rule-soft bg-card p-4">
      <span className="text-micro font-medium uppercase tracking-wide text-short">
        Og&apos;irlik mos kelmadi
      </span>

      <div className="flex flex-col gap-1 font-mono text-body text-ink-900">
        <div className="flex justify-between">
          <span className="text-ink-600">Haydovchi:</span>
          <span>{formatKg(item.driverKg)} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-600">Tarozi:</span>
          <span>{formatKg(item.scaleKg)} kg</span>
        </div>
        <div className="flex justify-between text-short">
          <span>Farq:</span>
          <span>
            {formatKg(diffKg)} kg ({pct}%)
          </span>
        </div>
      </div>

      <span className="text-[13px] text-ink-500">{item.material} · {item.time}</span>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setResolved(`${formatKg(item.driverKg)} kg qabul qilindi`)}
          className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card px-3 text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          Haydovchi og&apos;irligini qabul qilish
        </button>
        <button
          type="button"
          onClick={() => setResolved(`${formatKg(item.scaleKg)} kg qabul qilindi`)}
          className="flex h-12 flex-1 items-center justify-center rounded-md bg-amber px-3 text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          O&apos;z og&apos;irligimni qabul qilish
        </button>
        <button
          type="button"
          onClick={() => setSplitOpen((v) => !v)}
          aria-expanded={splitOpen}
          className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card px-3 text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          Farqni bo&apos;lish
        </button>
      </div>

      {splitOpen && (
        <div className="flex flex-col gap-2 rounded-md border border-rule-soft bg-paper p-3">
          <label htmlFor={`reason-${item.id}`} className="text-[13px] font-medium text-ink-600">
            Sabab (majburiy)
          </label>
          <textarea
            id={`reason-${item.id}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nima sababdan farq bo'lingan holda tasdiqlanmoqda?"
            rows={2}
            className="w-full rounded-md border border-rule bg-card px-3 py-2 text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          />
          <button
            type="button"
            disabled={reason.trim().length === 0}
            onClick={() => {
              const midKg = Math.round((item.driverKg + item.scaleKg) / 2);
              setResolved(`Farq bo'lindi — ${formatKg(midKg)} kg`);
            }}
            className="flex h-12 w-full items-center justify-center rounded-md bg-amber px-3 text-[16px] font-semibold text-ink-900 disabled:cursor-not-allowed disabled:bg-rule-soft disabled:text-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            Tasdiqlash
          </button>
        </div>
      )}
    </div>
  );
}

export default function GateQueuePage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-6 py-6">
        <h1 className="text-headline text-ink-900">Navbat</h1>

            {DISPUTED.length === 0 ? (
              <p className="text-body text-ink-600">Kutilayotgan yuk yo&apos;q.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {DISPUTED.map((item) => (
                  <DisputedCard key={item.id} item={item} />
                ))}
              </div>
            )}
      </div>
    </main>
  );
}
