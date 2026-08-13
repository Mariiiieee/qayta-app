"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const currentUser = {
  orgRole: "owner" as const,
  name: "Nodira",
  company: "EcoPlast",
};

const receivedThisMonthT = 142.6;

type PendingLoad = {
  id: string;
  producer: string;
  material: string;
  weightT: number;
  time: string;
};

type DisputedLoad = {
  id: string;
  producer: string;
  material: string;
  driverKg: number;
  scaleKg: number;
  time: string;
};

const PENDING_CONFIRM: PendingLoad[] = [
  { id: "ld-2201", producer: "Tashkent Plast MChJ", material: "PET", weightT: 6.2, time: "Bugun 09:40" },
  { id: "ld-2198", producer: "Aral Suv Kompaniyasi", material: "HDPE", weightT: 3.1, time: "Kecha 17:12" },
];

const DISPUTED: DisputedLoad[] = [
  {
    id: "ld-2195",
    producer: "Tashkent Plast MChJ",
    material: "PET",
    driverKg: 4200,
    scaleKg: 3900,
    time: "Bugun 11:58",
  },
  {
    id: "ld-2190",
    producer: "Andijon Oziq-ovqat",
    material: "PP",
    driverKg: 2100,
    scaleKg: 2260,
    time: "Kecha 15:04",
  },
];

function formatKg(n: number): string {
  return n.toLocaleString("en-US");
}

function CapacityCard() {
  const [capacity, setCapacity] = useState(85);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(capacity));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function save() {
    const n = Number(draft);
    if (Number.isFinite(n) && n >= 0) setCapacity(n);
    setEditing(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-md border border-rule-soft bg-card p-4">
      <span className="text-micro font-medium uppercase tracking-wide text-ink-600">
        Bo&apos;sh quvvat
      </span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="number"
            min={0}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setDraft(String(capacity));
                setEditing(false);
              }
            }}
            className="w-24 rounded-md border border-rule bg-paper px-2 font-mono text-[33px] font-semibold leading-[1.15] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          />
          <button
            type="button"
            onClick={save}
            className="flex h-10 items-center justify-center rounded-md bg-amber px-3 text-[13px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            Saqlash
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(String(capacity));
            setEditing(true);
          }}
          className="w-fit rounded-md font-mono text-[33px] font-semibold leading-[1.15] text-ink-900 underline decoration-1 decoration-rule-soft underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          {capacity} t
        </button>
      )}
    </div>
  );
}

function NewRequestsCard() {
  const router = useRouter();
  const count = 3;
  return (
    <button
      type="button"
      onClick={() => router.push("/recycler/requests")}
      className="flex flex-1 flex-col items-start gap-2 rounded-md border border-rule-soft bg-card p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
    >
      <span className="text-micro font-medium uppercase tracking-wide text-ink-600">
        Yangi so&apos;rovlar
      </span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-[33px] font-semibold leading-[1.15] text-ink-900">
          {count} ta
        </span>
        {count > 0 && (
          <span
            aria-hidden="true"
            className="flex h-6 min-w-[24px] items-center justify-center rounded-pill bg-amber px-2 font-mono text-[13px] font-semibold text-ink-900"
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
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
        <span className="text-[13px] text-ink-500">
          {item.producer} · {item.time}
        </span>
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

      <span className="text-[13px] text-ink-500">
        {item.producer} · {item.material} · {item.time}
      </span>

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

function PendingCard({ item }: { item: PendingLoad }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-rule-soft bg-card p-4">
      <span className="text-micro font-medium uppercase tracking-wide text-amber-text">
        Haydovchidan tasdiqlash kutilmoqda
      </span>
      <div className="flex justify-between font-mono text-body text-ink-900">
        <span>{item.material}</span>
        <span>{item.weightT.toFixed(1)} t</span>
      </div>
      <span className="text-[13px] text-ink-500">
        {item.producer} · {item.time}
      </span>
    </div>
  );
}

export default function RecyclerHomePage() {
  const router = useRouter();

  const queueCount = PENDING_CONFIRM.length + DISPUTED.length;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-6 py-6">
        <h1 className="text-headline text-ink-900">Bosh sahifa</h1>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col gap-2 rounded-md border border-rule-soft bg-card p-4">
                <span className="text-micro font-medium uppercase tracking-wide text-ink-600">
                  Bu oy qabul qilindi
                </span>
                <span className="font-mono text-[33px] font-semibold leading-[1.15] text-ink-900">
                  {receivedThisMonthT.toFixed(1)} t
                </span>
              </div>

              <CapacityCard />
              <NewRequestsCard />
            </div>

            <button
              type="button"
              onClick={() => router.push("/directory?role=recycler")}
              className="flex h-14 w-full items-center justify-center rounded-md bg-amber text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              Quvvatni yangilash
            </button>

            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-[19px] font-medium leading-[1.35] text-ink-900">
                  Tasdiqlash kutilmoqda
                </h2>
                {queueCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="flex h-6 min-w-[24px] items-center justify-center rounded-pill bg-amber px-2 font-mono text-[13px] font-semibold text-ink-900"
                  >
                    {queueCount}
                  </span>
                )}
              </div>

              {queueCount === 0 ? (
                <p className="text-body text-ink-600">Hammasi tartibda. Kutilayotgan yuk yo&apos;q.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {DISPUTED.map((item) => (
                    <DisputedCard key={item.id} item={item} />
                  ))}
                  {PENDING_CONFIRM.map((item) => (
                    <PendingCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
      </div>
    </main>
  );
}
