"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getDirectoryEntries,
  isStale,
  sortByQuantityDesc,
  type DirectoryEntry,
} from "@/lib/directoryData";

type Role = "producer" | "recycler";

function CheckBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6.5" fill="currentColor" />
      <path
        d="M4 7 L6 9.2 L10 4.8"
        stroke="var(--card)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role: Role = searchParams.get("role") === "recycler" ? "recycler" : "producer";
  const search = searchParams.get("search")?.toLowerCase() ?? "";

  const entries = sortByQuantityDesc(getDirectoryEntries(role));
  const filtered: DirectoryEntry[] = entries.filter(
    (item) =>
      item.name.toLowerCase().includes(search) ||
      item.city.toLowerCase().includes(search) ||
      item.materials.some((m) => m.toLowerCase().includes(search))
  );

  const quantityLabel = role === "recycler" ? "Kerakli miqdor" : "Bo'sh quvvat";

  return (
    <>
        <header className="sticky top-0 z-10 flex flex-col gap-1 border-b border-rule-soft bg-paper px-6 py-4">
          <h1 className="text-headline text-ink-900">Katalog</h1>
          <p className="text-[13px] text-ink-600">
            {role === "recycler"
              ? "Materialga muhtoj ishlab chiqaruvchilar."
              : "Materialingizni qabul qiladigan qayta ishlovchilar."}
          </p>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="mx-auto flex w-full max-w-[720px] flex-col px-6 py-4">
            {filtered.length === 0 ? (
              <p className="px-1 py-6 text-body text-ink-600">Hech narsa topilmadi.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((entry) => {
                  const stale = isStale(entry);
                  return (
                    <div
                      key={entry.id}
                      onClick={() => router.push(`/directory/${entry.id}?role=${role}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") router.push(`/directory/${entry.id}?role=${role}`);
                      }}
                      className="flex cursor-pointer flex-col gap-3 rounded-md border border-rule-soft bg-card p-4 hover:bg-paper"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-title-s text-ink-900">{entry.name}</span>
                            {entry.verified && (
                              <span
                                aria-hidden="true"
                                className="flex h-5 w-5 items-center justify-center text-verified"
                              >
                                <CheckBadge />
                              </span>
                            )}
                          </div>
                          <span className="text-caption text-ink-500">
                            {entry.city} · {entry.distanceKm} km
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-body text-ink-900">
                            {entry.quantityT} t
                          </span>
                          <span className="text-caption text-ink-500">{quantityLabel}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          {entry.materials.map((m) => (
                            <span
                              key={m}
                              className="flex h-7 items-center rounded-md border border-rule bg-paper px-2.5 text-micro font-medium text-ink-600"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                        {stale && (
                          <span className="text-caption text-ink-500">Ma&apos;lumot eskirgan</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
    </>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={null}>
      <DirectoryContent />
    </Suspense>
  );
}
