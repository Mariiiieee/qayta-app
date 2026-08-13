"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EVIDENCE,
  statusLabel,
  type Evidence,
  type EvidenceStatus,
} from "@/lib/evidenceData";

type FilterId = "all" | EvidenceStatus | "PET" | "HDPE" | "PP";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Hammasi" },
  { id: "verified", label: "Tasdiqlangan" },
  { id: "pending", label: "Kutilmoqda" },
  { id: "rejected", label: "Rad etilgan" },
  { id: "disputed", label: "Bahsli" },
  { id: "PET", label: "PET" },
  { id: "HDPE", label: "HDPE" },
  { id: "PP", label: "PP" },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 13.5 L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function StatusDot({ status }: { status: EvidenceStatus }) {
  if (status === "disputed") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-[10px] w-[10px] rounded-full border-2 border-short bg-transparent"
      />
    );
  }
  const color =
    status === "pending" ? "bg-amber" : status === "verified" ? "bg-verified" : "bg-short";
  return <span aria-hidden="true" className={`inline-block h-[10px] w-[10px] rounded-full ${color}`} />;
}

const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

function formatGroupDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Bugun";
  if (date.toDateString() === yesterday.toDateString()) return "Kecha";

  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function groupByDate(items: Evidence[]): { date: string; rows: Evidence[] }[] {
  const groups: { date: string; rows: Evidence[] }[] = [];
  for (const item of items) {
    const group = groups.find((g) => g.date === item.date);
    if (group) group.rows.push(item);
    else groups.push({ date: item.date, rows: [item] });
  }
  return groups;
}

function EvidenceListInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = (searchParams.get("filter") as FilterId | null) ?? "all";
  const q = searchParams.get("q") ?? "";

  const [searchOpen, setSearchOpen] = useState(q.length > 0);
  const [searchDraft, setSearchDraft] = useState(q);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function updateParams(next: { filter?: FilterId; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.filter !== undefined) {
      if (next.filter === "all") params.delete("filter");
      else params.set("filter", next.filter);
    }
    if (next.q !== undefined) {
      if (next.q === "") params.delete("q");
      else params.set("q", next.q);
    }
    const qs = params.toString();
    router.push(qs ? `/evidence?${qs}` : "/evidence");
  }

  const statusFilters: EvidenceStatus[] = ["verified", "pending", "rejected", "disputed"];
  const materialFilters = ["PET", "HDPE", "PP"] as const;

  const filtered = useMemo(() => {
    let rows = EVIDENCE;
    if (filter !== "all") {
      if ((statusFilters as string[]).includes(filter)) {
        rows = rows.filter((e) => e.status === filter);
      } else if ((materialFilters as readonly string[]).includes(filter)) {
        rows = rows.filter((e) => e.material === filter);
      }
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      rows = rows.filter(
        (e) =>
          e.recycler.toLowerCase().includes(needle) ||
          e.material.toLowerCase().includes(needle) ||
          e.id.toLowerCase().includes(needle)
      );
    }
    return rows;
  }, [filter, q]);

  const groups = groupByDate(filtered);
  const hasAny = EVIDENCE.length > 0;
  const hasResults = filtered.length > 0;

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchDraft("");
    updateParams({ q: "" });
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-rule-soft bg-paper px-6 py-4">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={searchDraft}
                onChange={(e) => {
                  setSearchDraft(e.target.value);
                  updateParams({ q: e.target.value });
                }}
                placeholder="Qayta ishlovchi, material yoki yuk ID"
                className="h-12 w-full rounded-md border border-rule bg-card px-4 text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Qidiruvni yopish"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-ink-600 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                <CloseIcon />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h1 className="text-headline text-ink-900">Dalillar</h1>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Qidirish"
                className="flex h-12 w-12 items-center justify-center rounded-md text-ink-600 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                <SearchIcon />
              </button>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateParams({ filter: f.id })}
                aria-pressed={filter === f.id}
                className={`flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 text-micro font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                  filter === f.id
                    ? "bg-amber text-ink-900"
                    : "border border-rule text-ink-600 bg-paper"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="text-[13px] text-ink-600">
            Faqat tasdiqlangan yuklar hisobga olinadi.
          </p>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="mx-auto flex w-full max-w-[960px] flex-col px-6 py-4">
            {!hasAny ? (
              <div className="flex flex-col items-start gap-4 rounded-md border border-rule-soft bg-card p-6">
                <p className="max-w-[420px] text-body text-ink-600">
                  Hali yuklar yo&apos;q. Birinchi yukingiz qayta ishlash korxonasi
                  tomonidan tortilganda shu yerda paydo bo&apos;ladi.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/directory")}
                  className="flex h-14 min-w-[200px] items-center justify-center rounded-md bg-amber px-6 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Katalogga o&apos;tish
                </button>
              </div>
            ) : !hasResults ? (
              <p className="px-1 py-6 text-body text-ink-600">Hech narsa topilmadi.</p>
            ) : (
              <div className="flex flex-col">
                {groups.map((group) =>
                  group.rows.length === 0 ? null : (
                    <div key={group.date} className="flex flex-col">
                      <div className="sticky top-[122px] z-[5] bg-paper px-1 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-500">
                        {formatGroupDate(group.date)}
                      </div>
                      <div className="overflow-hidden rounded-md border border-rule-soft bg-card">
                        {group.rows.map((row) => (
                          <div
                            key={row.id}
                            onClick={() => router.push(`/evidence/${row.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") router.push(`/evidence/${row.id}`);
                            }}
                            className="grid min-h-[48px] cursor-pointer items-center border-b border-rule-soft text-body text-ink-900 last:border-b-0 hover:bg-paper"
                            style={{
                              gridTemplateColumns: "40px 24px 100px 80px minmax(0,1fr) 120px",
                            }}
                          >
                            <span className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selected.has(row.id)}
                                onChange={() => toggleSelected(row.id)}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`${row.id} tanlash`}
                                className="h-5 w-5 accent-amber-text"
                              />
                            </span>
                            <span className="flex items-center justify-center">
                              <StatusDot status={row.status} />
                            </span>
                            <span className="whitespace-nowrap pr-3 text-right font-mono">
                              {row.weightT.toFixed(1)} t
                            </span>
                            <span className="truncate pr-2 text-center text-ink-600">
                              {row.material}
                            </span>
                            <span className="truncate pr-2 text-ink-600">{row.recycler}</span>
                            <span className="truncate pr-3 text-right text-ink-600">
                              {statusLabel(row.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </main>

        {selected.size > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-rule-soft bg-card px-6 py-3 shadow-lg">
            <div className="mx-auto flex w-full max-w-[960px] flex-wrap items-center justify-between gap-3">
              <span className="text-body font-medium text-ink-900">
                {selected.size} ta tanlandi
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Yuklab olish (PDF)
                </button>
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Yuklab olish (Excel)
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}

export default function EvidenceListPage() {
  return (
    <Suspense fallback={null}>
      <EvidenceListInner />
    </Suspense>
  );
}
