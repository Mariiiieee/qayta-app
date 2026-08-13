"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { getDirectoryEntryById, isStale } from "@/lib/directoryData";

type Role = "producer" | "recycler";

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4 L6.5 10 L12.5 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6.5" fill="currentColor" />
      <path d="M4 7 L6 9.2 L10 4.8" stroke="var(--card)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DirectoryProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role: Role = searchParams.get("role") === "recycler" ? "recycler" : "producer";
  const [requestOpen, setRequestOpen] = useState(false);
  const [amount, setAmount] = useState("128");
  const [sent, setSent] = useState(false);

  const entry = getDirectoryEntryById(role, params.id);

  if (!entry) {
    return (
      <div className="flex h-full min-h-screen">
        <Sidebar role={role} userName="Aziz" companyName="Tashkent Plast MChJ" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-paper px-6">
          <p className="text-body text-ink-600">Kompaniya topilmadi.</p>
          <button
            type="button"
            onClick={() => router.push("/directory")}
            className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            Katalogga qaytish
          </button>
        </div>
      </div>
    );
  }

  const quantityLabel = role === "recycler" ? "Kerakli miqdor" : "Bo'sh quvvat";
  const maxTons = Math.max(...entry.historicalVerified.map((h) => h.tons));
  const stale = isStale(entry);

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar role={role} userName="Aziz" companyName="Tashkent Plast MChJ" />

      <div className="flex flex-1 flex-col bg-paper">
        <header className="flex items-center gap-3 border-b border-rule-soft bg-paper px-6 py-4">
          <button
            type="button"
            onClick={() => router.push("/directory")}
            aria-label="Orqaga"
            className="flex h-12 w-12 items-center justify-center rounded-md text-ink-600 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            <BackIcon />
          </button>
          <h1 className="text-title-s text-ink-900">{entry.name}</h1>
          {entry.verified && (
            <span className="flex h-7 items-center gap-1 rounded-pill bg-verified/10 px-2 text-micro font-medium text-verified">
              <CheckBadge />
              Tasdiqlangan
            </span>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-6 py-6">
            <div className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded-md border border-rule-soft bg-ink-900/80 text-card">
              <span className="text-micro uppercase tracking-wide">
                {entry.photoCaption}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-caption text-ink-500">
                {entry.city} · {entry.distanceKm} km
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {entry.materials.map((m) => (
                  <span
                    key={m}
                    className="flex h-8 items-center rounded-md border border-rule bg-card px-3 text-micro font-medium text-ink-600"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-md border border-rule-soft bg-card p-4">
              <div className="flex flex-col gap-1">
                <span className="text-micro uppercase tracking-wide text-ink-600">
                  {quantityLabel}
                </span>
                <span className="font-mono text-display text-ink-900">
                  {entry.quantityT} t
                </span>
                {stale && (
                  <span className="text-caption text-ink-500">Ma'lumot eskirgan</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-micro uppercase tracking-wide text-ink-600">
                  O'rtacha javob vaqti
                </span>
                <span className="font-mono text-display text-ink-900">
                  {entry.avgResponseHours} soat
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-micro uppercase tracking-wide text-ink-600">
                Litsenziyalar
              </span>
              <ul className="flex flex-col gap-1">
                {entry.licenses.map((l) => (
                  <li key={l} className="text-body text-ink-900">
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-micro uppercase tracking-wide text-ink-600">
                Tasdiqlangan hajmlar
              </span>
              <div className="overflow-hidden rounded-md border border-rule-soft bg-card">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-rule-soft text-left text-micro uppercase text-ink-600">
                      <th className="px-4 py-3">Oy</th>
                      <th className="px-4 py-3 text-right">Tonna</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.historicalVerified.map((h, i) => (
                      <tr
                        key={h.month}
                        className={`h-12 text-body text-ink-900 ${
                          i === entry.historicalVerified.length - 1 ? "" : "border-b border-rule-soft"
                        }`}
                      >
                        <td className="px-4">{h.month}</td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-md bg-rule-soft">
                              <div
                                className="h-full rounded-md bg-verified"
                                style={{ width: `${(h.tons / maxTons) * 100}%` }}
                              />
                            </div>
                            <span className="font-mono">{h.tons} t</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRequestOpen(true)}
              className="flex h-14 w-full items-center justify-center rounded-md bg-amber px-6 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              So'rov yuborish
            </button>
          </div>
        </main>
      </div>

      {requestOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
          onClick={() => setRequestOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[420px] flex-col gap-4 rounded-md bg-card p-6 shadow-lg"
          >
            {sent ? (
              <>
                <h2 id="request-modal-title" className="text-title-s text-ink-900">
                  So'rov yuborildi
                </h2>
                <p className="text-body text-ink-600">
                  {entry.name} kompaniyasiga {amount} t bo'yicha so'rov yuborildi.
                </p>
                <button
                  type="button"
                  onClick={() => setRequestOpen(false)}
                  className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Yopish
                </button>
              </>
            ) : (
              <>
                <h2 id="request-modal-title" className="text-title-s text-ink-900">
                  So'rov yuborish — {entry.name}
                </h2>
                <label className="flex flex-col gap-1">
                  <span className="text-micro font-medium uppercase text-ink-600">
                    Miqdor (tonna)
                  </span>
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-14 rounded-md border border-rule bg-card px-3 font-mono text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSent(true)}
                    disabled={!(Number(amount) > 0)}
                    className="flex h-14 flex-1 items-center justify-center rounded-md bg-amber px-4 text-body font-semibold text-ink-900 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    So'rov yuborish
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestOpen(false)}
                    className="flex h-14 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Bekor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
