"use client";

import { useState } from "react";

type Request = {
  id: string;
  producer: string;
  material: string;
  tons: number;
  time: string;
};

const INITIAL: Request[] = [
  { id: "rq-301", producer: "Tashkent Plast MChJ", material: "PET", tons: 8, time: "Bugun 10:12" },
  { id: "rq-300", producer: "Aral Suv Kompaniyasi", material: "HDPE", tons: 5, time: "Kecha 16:40" },
  { id: "rq-298", producer: "Andijon Oziq-ovqat", material: "PP", tons: 3, time: "2 kun oldin" },
];

export default function RecyclerRequestsPage() {
  const [requests, setRequests] = useState<Request[]>(INITIAL);

  function remove(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-6 py-6">
        <h1 className="text-headline text-ink-900">Yangi so&apos;rovlar</h1>

            {requests.length === 0 ? (
              <p className="text-body text-ink-600">Yangi so&apos;rov yo&apos;q.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {requests.map((r) => (
                  <div key={r.id} className="flex flex-col gap-3 rounded-md border border-rule-soft bg-card p-4">
                    <div className="flex items-center justify-between font-mono text-body text-ink-900">
                      <span className="font-sans font-medium">{r.producer}</span>
                      <span>{r.tons} t</span>
                    </div>
                    <span className="text-[13px] text-ink-500">
                      {r.material} · {r.time}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                      >
                        Rad etish
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        className="flex h-12 flex-1 items-center justify-center rounded-md bg-amber text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                      >
                        Qabul qilish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </main>
  );
}
