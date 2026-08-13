"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  getDirectoryEntries,
  isStale,
  sortByQuantityDesc,
  type DirectoryEntry,
  type Material,
} from "@/lib/directoryData";

type Role = "producer" | "recycler";
type ViewMode = "list" | "map";
type MaterialFilter = Material | "Hammasi";

const MATERIALS: MaterialFilter[] = ["PET", "HDPE", "PP", "Hammasi"];

function FilterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5 H17 M6 10 H14 M9 15 H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10.2 L16.5 4.5 L14 15.5 L9.8 12.6 L7.8 14.5 L7.5 11.3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 3 H8 L9.5 6.5 L7.5 8 C8.3 10 10 11.7 12 12.5 L13.5 10.5 L17 12 V15 C17 16.1 16.1 17 15 17 C9 17 3 11 3 5 C3 3.9 3.9 3 5 3 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 16 L8.5 14 H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ContactPopover({
  entry,
  onClose,
}: {
  entry: DirectoryEntry;
  onClose: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-[52px] z-20 flex w-[220px] flex-col rounded-md border border-rule-soft bg-card p-1 shadow-lg"
    >
      <a
        role="menuitem"
        href={`https://t.me/${entry.telegram.replace("@", "")}`}
        target="_blank"
        rel="noreferrer"
        onClick={onClose}
        className="flex h-11 items-center gap-3 rounded-md px-3 text-body text-ink-900 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
      >
        <TelegramIcon />
        Telegram
      </a>
      <a
        role="menuitem"
        href={`tel:${entry.phone.replace(/\s/g, "")}`}
        onClick={onClose}
        className="flex h-11 items-center gap-3 rounded-md px-3 text-body text-ink-900 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
      >
        <PhoneIcon />
        Telefon
      </a>
      <button
        type="button"
        role="menuitem"
        onClick={onClose}
        className="flex h-11 items-center gap-3 rounded-md px-3 text-left text-body text-ink-900 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
      >
        <MessageIcon />
        Ilova ichida xabar
      </button>
    </div>
  );
}

function RequestModal({
  entry,
  gapT,
  onClose,
}: {
  entry: DirectoryEntry;
  gapT: number;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(String(gapT));
  const [sent, setSent] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
      onClick={onClose}
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
              onClick={onClose}
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
                onClick={onClose}
                className="flex h-14 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                Bekor
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EntryCard({
  entry,
  role,
  userGapT,
  onOpenRequest,
}: {
  entry: DirectoryEntry;
  role: Role;
  userGapT: number;
  onOpenRequest: (entry: DirectoryEntry) => void;
}) {
  const router = useRouter();
  const [contactOpen, setContactOpen] = useState(false);
  const stale = isStale(entry);
  const isFull = role === "producer" && entry.quantityT === 0;
  const quantityLabel = role === "recycler" ? "Kerakli miqdor" : "Bo'sh quvvat";

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/directory/${entry.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/directory/${entry.id}`);
      }}
      className={`relative flex cursor-pointer flex-col gap-4 rounded-md border border-rule-soft bg-card p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
        isFull ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-title-s text-ink-900">{entry.name}</span>
          <span className="text-caption text-ink-500">
            {entry.city} · {entry.distanceKm} km
          </span>
        </div>
        {entry.verified && (
          <span className="flex h-7 shrink-0 items-center gap-1 rounded-pill bg-verified/10 px-2 text-micro font-medium text-verified">
            <CheckBadge />
            Tasdiqlangan
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {entry.materials.map((m) => (
          <span
            key={m}
            className="flex h-8 items-center rounded-md border border-rule bg-paper px-3 text-micro font-medium text-ink-600"
          >
            {m}
          </span>
        ))}
      </div>

      {isFull ? (
        <span className="flex h-8 w-fit items-center rounded-pill bg-rule-soft px-3 text-micro font-medium text-ink-600">
          Hozircha to'lgan
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-micro text-ink-600">{quantityLabel}:</span>
          <span className="font-mono text-body font-semibold text-ink-900">
            {entry.quantityT} t / oy
          </span>
        </div>
      )}

      {stale && (
        <span className="text-caption text-ink-500">Ma'lumot eskirgan</span>
      )}

      <div className="relative flex gap-2" onClick={(e) => e.stopPropagation()}>
        {isFull ? (
          <button
            type="button"
            onClick={() => setContactOpen((v) => !v)}
            className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            Xabar bering
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setContactOpen((v) => !v)}
              className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              Bog'lanish
            </button>
            <button
              type="button"
              onClick={() => onOpenRequest(entry)}
              className="flex h-12 flex-1 items-center justify-center rounded-md bg-amber text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              So'rov
            </button>
          </>
        )}
        {contactOpen && (
          <ContactPopover entry={entry} onClose={() => setContactOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  const searchParams = useSearchParams();
  const role: Role = searchParams.get("role") === "recycler" ? "recycler" : "producer";
  const userGapT = 128;

  const [view, setView] = useState<ViewMode>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [material, setMaterial] = useState<MaterialFilter>("Hammasi");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxDistance, setMaxDistance] = useState<string>("Hammasi");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [tab, setTab] = useState<"catalog" | "verified">("catalog");
  const [requestEntry, setRequestEntry] = useState<DirectoryEntry | null>(null);
  const [cacheHoursAgo] = useState(2);
  const [isOffline] = useState(false);

  const allEntries = useMemo(() => getDirectoryEntries(role), [role]);

  const filtered = useMemo(() => {
    let list = allEntries;
    if (material !== "Hammasi") {
      list = list.filter((e) => e.materials.includes(material));
    }
    if (minCapacity && Number(minCapacity) > 0) {
      list = list.filter((e) => e.quantityT >= Number(minCapacity));
    }
    if (maxDistance !== "Hammasi") {
      list = list.filter((e) => e.distanceKm <= Number(maxDistance));
    }
    if (verifiedOnly) {
      list = list.filter((e) => e.verified);
    }
    return sortByQuantityDesc(list);
  }, [allEntries, material, minCapacity, maxDistance, verifiedOnly]);

  const verifiedAlphabetical = useMemo(
    () =>
      [...allEntries]
        .filter((e) => e.verified)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allEntries]
  );

  function clearFilters() {
    setMaterial("Hammasi");
    setMinCapacity("");
    setMaxDistance("Hammasi");
    setVerifiedOnly(false);
  }

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar role={role} userName="Aziz" companyName="Tashkent Plast MChJ" />

      <div className="flex flex-1 flex-col bg-paper">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 px-6 py-6">
            {isOffline && (
              <div className="flex h-10 items-center rounded-md border border-amber bg-amber/10 px-3 text-micro text-amber-text">
                Keshdan yuklanmoqda. Ma'lumot {cacheHoursAgo} soat oldingi.
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-headline text-ink-900">Katalog</h1>

              <div className="flex items-center gap-3">
                <div className="flex h-12 rounded-md border border-rule p-1">
                  {(["list", "map"] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      className={`flex h-10 items-center justify-center rounded-md px-4 text-body font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                        view === v ? "bg-amber text-ink-900" : "text-ink-600"
                      }`}
                    >
                      {v === "list" ? "Ro'yxat" : "Xarita"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-expanded={filtersOpen}
                  aria-label="Filtr"
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-rule text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  <FilterIcon />
                </button>
              </div>
            </div>

            <div className="flex gap-1 border-b border-rule-soft">
              {(["catalog", "verified"] as const).map((tId) => (
                <button
                  key={tId}
                  type="button"
                  onClick={() => setTab(tId)}
                  aria-pressed={tab === tId}
                  className={`flex h-12 items-center px-4 text-body font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                    tab === tId
                      ? "border-b-2 border-amber-text text-ink-900"
                      : "text-ink-600"
                  }`}
                >
                  {tId === "catalog" ? "Katalog" : "Tasdiqlanganlar"}
                </button>
              ))}
            </div>

            {tab === "catalog" && filtersOpen && (
              <div className="flex flex-col gap-4 rounded-md border border-rule-soft bg-card p-4">
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMaterial(m)}
                      aria-pressed={material === m}
                      className={`flex h-10 items-center justify-center rounded-md px-3 text-micro font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                        material === m
                          ? "border-2 border-amber-text text-ink-900"
                          : "border border-rule text-ink-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-micro font-medium uppercase text-ink-600">
                      Min. hajm (t)
                    </span>
                    <input
                      inputMode="numeric"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                      placeholder="0"
                      className="h-14 rounded-md border border-rule bg-card px-3 font-mono text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-micro font-medium uppercase text-ink-600">
                      Masofa
                    </span>
                    <select
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(e.target.value)}
                      className="h-14 rounded-md border border-rule bg-card px-3 text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      <option value="Hammasi">Hammasi</option>
                      <option value="50">50 km gacha</option>
                      <option value="150">150 km gacha</option>
                      <option value="400">400 km gacha</option>
                    </select>
                  </label>
                </div>

                <label className="flex h-11 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="h-5 w-5 accent-amber-text"
                  />
                  <span className="text-body text-ink-900">Faqat tasdiqlanganlar</span>
                </label>
              </div>
            )}

            {tab === "verified" ? (
              <div className="flex flex-col rounded-md border border-rule-soft bg-card">
                {verifiedAlphabetical.map((e, i) => (
                  <div
                    key={e.id}
                    onClick={() => (window.location.href = `/directory/${e.id}`)}
                    className={`flex h-12 cursor-pointer items-center justify-between px-4 text-body text-ink-900 hover:bg-paper ${
                      i === 0 ? "" : "border-t border-rule-soft"
                    }`}
                  >
                    <span>{e.name}</span>
                    <span className="flex items-center gap-1 text-micro font-medium text-verified">
                      <CheckBadge />
                      Tasdiqlangan
                    </span>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-start gap-4 rounded-md border border-rule-soft bg-card p-6">
                <p className="text-body text-ink-600">
                  Bu filtrlar bo'yicha hech narsa topilmadi
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : view === "list" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filtered.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    role={role}
                    userGapT={userGapT}
                    onOpenRequest={setRequestEntry}
                  />
                ))}
              </div>
            ) : (
              <div className="relative h-[480px] w-full overflow-hidden rounded-md border border-rule-soft bg-card">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--rule-soft)_1px,transparent_1px),linear-gradient(90deg,var(--rule-soft)_1px,transparent_1px)] [background-size:32px_32px]" />
                {filtered.map((entry, i) => {
                  const left = 12 + ((i * 137) % 76);
                  const top = 12 + ((i * 211) % 70);
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => (window.location.href = `/directory/${entry.id}`)}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      <span className="whitespace-nowrap rounded-md border border-rule-soft bg-card px-2 py-1 text-caption text-ink-900 shadow-lg">
                        {entry.name} · {entry.quantityT} t
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-3 w-3 rounded-full ${
                          entry.verified ? "bg-verified" : "bg-amber"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {requestEntry && (
        <RequestModal
          entry={requestEntry}
          gapT={userGapT}
          onClose={() => setRequestEntry(null)}
        />
      )}
    </div>
  );
}
