"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

type Status = "pending" | "verified" | "rejected";

type ActivityRow = {
  id: string;
  status: Status;
  weight: number;
  material: string;
  recycler: string;
  date: string;
};

type Period = "Q1" | "Q2" | "Q3" | "Q4" | "year";

const user = {
  name: "Aziz",
  company: "Tashkent Plast MChJ",
};

const compliance = {
  required: 340,
  verified: 96,
};

const forecastShortfall = 128;

const activity: ActivityRow[] = [
  { id: "ev-1042", status: "verified", weight: 12.4, material: "PET", recycler: "EcoPlast", date: "03.08" },
  { id: "ev-1041", status: "pending", weight: 8.0, material: "HDPE", recycler: "Recycle Uz", date: "02.08" },
  { id: "ev-1039", status: "verified", weight: 15.6, material: "PET", recycler: "EcoPlast", date: "30.07" },
  { id: "ev-1035", status: "rejected", weight: 5.2, material: "PP", recycler: "GreenLoop", date: "28.07" },
  { id: "ev-1030", status: "verified", weight: 20.1, material: "PET", recycler: "Recycle Uz", date: "25.07" },
];

const reportPreview = { loads: 12, tons: 96.4, companies: 3 };

function StatusDot({ status }: { status: Status }) {
  const color =
    status === "pending" ? "bg-amber" : status === "verified" ? "bg-verified" : "bg-short";
  return <span aria-hidden="true" className={`inline-block h-[10px] w-[10px] rounded-full ${color}`} />;
}

function statusLabel(t: ReturnType<typeof useLanguage>["t"], status: Status) {
  if (status === "pending") return t.statusPending;
  if (status === "verified") return t.statusVerified;
  return t.statusRejected;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1280px) and (hover: hover)").matches);
  }, []);
  return isDesktop;
}

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let raf = 0;
    const duration = 1000;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  return value;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("year");
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [reportState, setReportState] = useState<"idle" | "generating" | "done">("idle");
  const [forecastOpen, setForecastOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const tableRef = useRef<HTMLDivElement>(null);
  const [rowsRevealed, setRowsRevealed] = useState(false);

  const hasData = activity.length > 0;
  const remaining = Math.max(compliance.required - compliance.verified, 0);
  const progressPct = hasData
    ? Math.min((compliance.verified / compliance.required) * 100, 100)
    : 0;

  const monthVerified = activity
    .filter((r) => r.status === "verified")
    .reduce((sum, r) => sum + r.weight, 0);
  const monthPending = activity
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.weight, 0);
  const monthRejected = activity
    .filter((r) => r.status === "rejected")
    .reduce((sum, r) => sum + r.weight, 0);

  const monthVerifiedAnimated = useCountUp(monthVerified, isDesktop);
  const monthPendingAnimated = useCountUp(monthPending, isDesktop);
  const monthRejectedAnimated = useCountUp(monthRejected, isDesktop);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRowsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function generateReport() {
    setReportState("generating");
    window.setTimeout(() => setReportState("done"), 1400);
  }

  const periods: { id: Period; label: string }[] = [
    { id: "Q1", label: "Q1" },
    { id: "Q2", label: "Q2" },
    { id: "Q3", label: "Q3" },
    { id: "Q4", label: "Q4" },
    { id: "year", label: "Yil" },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto">
          <div className="flex w-full flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-[19px] font-medium leading-[1.35] text-ink-600">
                  {t.greeting(user.name)}
                </h1>
                <span className="text-[13px] text-ink-500">{user.company}</span>
              </div>
            </div>

            {!hasData ? (
              <div className="flex flex-col items-center gap-2 rounded-md border border-rule-soft bg-card p-12 text-center">
                <span className="font-mono text-[33px] font-semibold leading-[1.15] text-ink-500">
                  {t.emptyGap}
                </span>
                <span className="text-[19px] text-ink-600">{t.emptyState}</span>
                <button
                  type="button"
                  onClick={() => router.push("/products")}
                  className="mt-6 flex h-14 min-w-[200px] items-center justify-center rounded-md bg-amber px-6 text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  {t.emptyCta}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <div className="flex flex-col gap-6">
                  <section className="compliance-card card-hover rounded-md border border-rule-soft bg-card p-6">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium uppercase tracking-wide text-ink-600">
                        {t.complianceLabel}
                      </span>

                      <span
                        key={compliance.required}
                        className="value-fade-in mt-2 font-mono text-[33px] font-semibold leading-[1] text-ink-900"
                      >
                        {compliance.required} t kerak
                      </span>

                      <div
                        role="progressbar"
                        aria-valuenow={Math.round(progressPct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-6 h-[12px] w-full overflow-hidden rounded-md bg-rule-soft"
                      >
                        <div
                          className="progress-fill h-full rounded-md bg-verified"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between font-mono text-[16px]">
                        <span className="text-verified">{t.verifiedRow(compliance.verified)}</span>
                        <span className="font-semibold text-ink-900">{t.remainingRow(remaining)}</span>
                      </div>

                      {forecastShortfall > 0 && (
                        <button
                          type="button"
                          onClick={() => setForecastOpen(true)}
                          className="mt-2 w-fit text-left text-[13px] text-short underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                        >
                          {t.forecastWarning(forecastShortfall)}
                        </button>
                      )}
                    </div>
                  </section>

                  <button
                    type="button"
                    onClick={() => router.push("/directory")}
                    className="btn-shimmer flex h-14 w-full items-center justify-center rounded-md bg-amber text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    {t.buyTons}
                  </button>

                  <section>
                    <div className="flex items-center justify-between px-1 pb-2">
                      <span className="text-[13px] font-medium uppercase tracking-wide text-ink-600">
                        {t.recentActivity}
                      </span>
                      <button
                        type="button"
                        onClick={() => router.push("/evidence")}
                        className="text-[13px] text-ink-600 underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                      >
                        {t.viewAll}
                      </button>
                    </div>
                    <div ref={tableRef} className="card-hover rounded-md border border-rule-soft bg-card">
                      <table className="w-full border-collapse">
                        <colgroup>
                          <col style={{ width: 140 }} />
                          <col style={{ width: 100 }} />
                          <col style={{ width: 80 }} />
                          <col />
                          <col style={{ width: 80 }} />
                        </colgroup>
                        <tbody>
                          {activity.slice(0, 5).map((row, idx) => (
                            <tr
                              key={row.id}
                              tabIndex={0}
                              onClick={() => router.push(`/evidence/${row.id}`)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") router.push(`/evidence/${row.id}`);
                              }}
                              style={{ transitionDelay: `${idx * 25}ms` }}
                              className={`table-row-reveal h-12 cursor-pointer border-b border-rule-soft text-[16px] text-ink-900 last:border-b-0 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-text ${
                                rowsRevealed ? "is-visible" : ""
                              }`}
                            >
                              <td className="pl-4">
                                <span className="flex items-center gap-2">
                                  <StatusDot status={row.status} />
                                  {statusLabel(t, row.status)}
                                </span>
                              </td>
                              <td className="whitespace-nowrap pr-4 text-right font-mono">
                                {row.weight.toFixed(1)} t
                              </td>
                              <td className="pr-4 text-ink-600">{row.material}</td>
                              <td className="pr-4 text-ink-600">{row.recycler}</td>
                              <td className="pr-4 text-right text-[11px] text-ink-500">
                                {row.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                <div className="flex flex-col gap-4">
                  <section className="card-hover rounded-md border border-rule-soft bg-card p-4">
                    <div className="flex h-12 items-center justify-between border-b border-rule-soft">
                      <span className="text-[13px] text-ink-500">Bu oy tasdiqlangan</span>
                      <span className="font-mono text-[23px] text-verified">{monthVerifiedAnimated.toFixed(1)} t</span>
                    </div>
                    <div className="flex h-12 items-center justify-between border-b border-rule-soft">
                      <span className="text-[13px] text-ink-500">Kutilmoqda</span>
                      <span className="font-mono text-[23px] text-amber-text">{monthPendingAnimated.toFixed(1)} t</span>
                    </div>
                    <div className="flex h-12 items-center justify-between">
                      <span className="text-[13px] text-ink-500">Rad etilgan</span>
                      <span className="font-mono text-[23px] text-short">{monthRejectedAnimated.toFixed(1)} t</span>
                    </div>
                  </section>

                  <section className="card-hover mt-4 rounded-md border border-rule-soft bg-card p-4">
                    <h2 className="mb-4 text-[19px] font-medium leading-[1.35] text-ink-900">
                      {t.reportTitle}
                    </h2>

                    <div className="flex flex-nowrap gap-2">
                      {periods.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPeriod(p.id)}
                          aria-pressed={period === p.id}
                          className={`flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                            period === p.id
                              ? "bg-amber text-ink-900"
                              : "border border-rule bg-card text-ink-600"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-nowrap gap-2 pt-2">
                      {(["pdf", "excel"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormat(f)}
                          aria-pressed={format === f}
                          className={`flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 text-[13px] font-medium uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                            format === f
                              ? "bg-amber text-ink-900"
                              : "border border-rule bg-card text-ink-600"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {period && (
                      <p className="mt-3 text-[13px] text-ink-600">
                        {t.reportPreview(
                          reportPreview.loads,
                          reportPreview.tons,
                          reportPreview.companies
                        )}
                      </p>
                    )}

                    {reportState === "generating" ? (
                      <div className="mt-4 h-12 w-full overflow-hidden rounded-md border border-rule bg-paper">
                        <div className="h-full w-1/2 animate-pulse bg-rule-soft" />
                      </div>
                    ) : reportState === "done" ? (
                      <div className="mt-4 flex items-center gap-3">
                        <svg
                          className="success-check text-verified"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" />
                          <path
                            d="M6 10.5 L8.5 13 L14 7.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <button
                          type="button"
                          className="text-[16px] text-ink-900 underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                        >
                          {t.reportDownload}
                        </button>
                        <button
                          type="button"
                          className="text-[16px] text-ink-900 underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                        >
                          {t.reportShare}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={generateReport}
                        className="mt-4 flex h-12 w-full items-center justify-center rounded-md border border-rule bg-card text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                      >
                        {t.reportGenerate}
                      </button>
                    )}
                  </section>
                </div>
              </div>
            )}
          </div>
      </main>

      {forecastOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forecast-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
          onClick={() => setForecastOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[420px] flex-col gap-4 rounded-md bg-card p-6 shadow-lg"
          >
            <h2 id="forecast-modal-title" className="text-[19px] font-medium leading-[1.35] text-ink-900">
              {t.forecastModalTitle}
            </h2>
            <p className="text-[16px] leading-[1.5] text-ink-600">
              {t.forecastModalBody(forecastShortfall)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setForecastOpen(false);
                  router.push("/directory");
                }}
                className="flex h-14 flex-1 items-center justify-center rounded-md bg-amber px-4 text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.forecastModalCta}
              </button>
              <button
                type="button"
                onClick={() => setForecastOpen(false)}
                className="flex h-14 items-center justify-center rounded-md border border-rule bg-card px-4 text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
