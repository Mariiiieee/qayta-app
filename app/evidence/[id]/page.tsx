"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvidenceById, statusLabel, type EvidenceStatus } from "@/lib/evidenceData";

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4 L6.5 10 L12.5 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function statusColorClass(status: EvidenceStatus) {
  if (status === "verified") return "text-verified";
  if (status === "pending") return "text-amber-text";
  return "text-short";
}

export default function EvidenceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const evidence = getEvidenceById(params.id);

  if (!evidence) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-paper px-6">
        <p className="text-body text-ink-600">Yuk topilmadi.</p>
        <button
          type="button"
          onClick={() => router.push("/evidence")}
          className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          Dalillarga qaytish
        </button>
      </div>
    );
  }

  const isFinal = evidence.status === "verified" || evidence.status === "rejected";
  const canReport = evidence.status === "pending" || evidence.status === "rejected";

  return (
    <>
        <header className="flex items-center gap-3 border-b border-rule-soft bg-paper px-6 py-4">
          <button
            type="button"
            onClick={() => router.push("/evidence")}
            aria-label="Orqaga"
            className="flex h-12 w-12 items-center justify-center rounded-md text-ink-600 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
          >
            <BackIcon />
          </button>
          <h1 className="text-title-s text-ink-900">{evidence.id}</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-6 py-6">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block max-h-[320px] w-full overflow-hidden rounded-md border border-rule-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              <div className="flex h-[320px] w-full items-center justify-center bg-ink-900/80 text-card">
                <span className="text-micro uppercase tracking-wide">
                  Yuk fotosurati · {evidence.id}
                </span>
              </div>
            </button>

            <div className="flex flex-col gap-1">
              <span className="text-display font-mono text-ink-900">
                {evidence.weightT.toFixed(1)} t
              </span>
              <span className="text-body text-ink-600">
                {evidence.material} · {evidence.recycler}
              </span>
            </div>

            <div className="flex flex-col">
              {evidence.timeline.map((event, i) => {
                const isLast = i === evidence.timeline.length - 1;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className={`mt-1 h-[10px] w-[10px] shrink-0 rounded-full ${
                          event.final
                            ? event.final === "verified"
                              ? "bg-verified"
                              : event.final === "rejected"
                              ? "bg-short"
                              : "border-2 border-short bg-transparent"
                            : "bg-rule"
                        }`}
                      />
                      {!isLast && <span aria-hidden="true" className="w-px flex-1 bg-rule-soft" />}
                    </div>
                    <div className={`flex flex-col gap-0.5 ${isLast ? "pb-0" : "pb-5"}`}>
                      <span className="text-body text-ink-900">
                        <span className="font-mono text-[13px] text-ink-500">{event.time}</span>{" "}
                        {event.final ? (
                          <span className={`font-semibold ${statusColorClass(event.final)}`}>
                            {statusLabel(event.final).toUpperCase()}
                          </span>
                        ) : (
                          event.title
                        )}
                      </span>
                      <span className="text-[13px] text-ink-500">
                        {event.actor} · {event.location}
                      </span>
                      <span className="font-mono text-[13px] text-ink-500">{event.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              Yuklab olish
            </button>

            {isFinal && (
              <p className="text-[13px] text-ink-500">
                Tasdiqlangan yozuvlarni tahrirlab bo&apos;lmaydi.
              </p>
            )}

            {canReport && (
              <button
                type="button"
                className="w-fit text-left text-body text-short underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                Muammo haqida xabar berish
              </button>
            )}
          </div>
        </main>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 px-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="flex max-h-[80vh] w-full max-w-[720px] items-center justify-center overflow-hidden rounded-md bg-card">
            <div className="flex h-[400px] w-full items-center justify-center bg-ink-900/80 text-card">
              <span className="text-micro uppercase tracking-wide">
                Yuk fotosurati · {evidence.id}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
