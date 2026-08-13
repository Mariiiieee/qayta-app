"use client";

import Link from "next/link";
import { retrySync, useTrucks, usePendingSync, type TruckStatus } from "@/lib/weigherQueue";

const STATUS_LABEL: Record<TruckStatus, string> = {
  pending: "Kutilmoqda",
  verified: "Tortildi",
  rejected: "Rad etildi",
};

const STATUS_CLASS: Record<TruckStatus, string> = {
  pending: "text-ink-500",
  verified: "text-verified",
  rejected: "text-short",
};

export default function WeigherQueuePage() {
  const trucks = useTrucks();
  const pending = usePendingSync();

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-paper">
      {pending > 0 && (
        <div className="flex items-center justify-between gap-4 bg-amber px-6 py-3">
          <span className="text-[16px] font-medium text-ink-900">
            {pending} ta yuk yuborilmadi
          </span>
          <button
            type="button"
            onClick={retrySync}
            className="flex h-10 shrink-0 items-center rounded-md bg-ink-900 px-4 text-[13px] font-semibold text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            Qayta urinish
          </button>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-6 py-6">
        <h1 className="text-[28px] font-semibold leading-[1.2] text-ink-900">Navbat</h1>

        <div className="mt-6 flex flex-col rounded-md bg-card">
          {trucks.map((truck, idx) => (
            <div
              key={truck.id}
              className={`flex h-16 items-center gap-4 px-4 ${
                idx !== trucks.length - 1 ? "border-b border-rule-soft" : ""
              }`}
            >
              <span className="font-mono text-[19px] font-semibold text-ink-900">{truck.plate}</span>
              <span className="text-[13px] text-ink-500">{truck.driver}</span>
              <span className="flex h-6 items-center rounded-pill bg-paper px-2 text-[13px] font-medium text-ink-600">
                {truck.material}
              </span>
              <span className={`ml-auto text-[16px] font-medium ${STATUS_CLASS[truck.status]}`}>
                {STATUS_LABEL[truck.status]}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/weigher/weigh"
          className="mt-6 flex h-14 w-full items-center justify-center rounded-md bg-amber text-[19px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          + Yangi yuk
        </Link>
      </div>
    </main>
  );
}
