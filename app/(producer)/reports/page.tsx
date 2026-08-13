"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

type Period = "Q1" | "Q2" | "Q3" | "Q4" | "year";
type Format = "pdf" | "excel";
type GenState = "idle" | "generating" | "done";

const user = {
  name: "Aziz",
  company: "Tashkent Plast MChJ",
};

const PERIOD_DATA: Record<
  Period,
  { loads: number; tons: number; companies: number; unverified: number }
> = {
  Q1: { loads: 14, tons: 62.4, companies: 3, unverified: 0 },
  Q2: { loads: 22, tons: 118.9, companies: 4, unverified: 2 },
  Q3: { loads: 9, tons: 41.2, companies: 2, unverified: 1 },
  Q4: { loads: 0, tons: 0, companies: 0, unverified: 0 },
  year: { loads: 45, tons: 222.5, companies: 5, unverified: 3 },
};

type ReportRow = {
  id: string;
  period: string;
  format: Format;
  date: string;
  loads: number;
  tons: number;
  createdBy: string;
  dataVersion: string;
};

const HISTORY: ReportRow[] = [
  {
    id: "rep-0091",
    period: "Q2 2026",
    format: "pdf",
    date: "2026-07-31",
    loads: 22,
    tons: 118.9,
    createdBy: "Aziz",
    dataVersion: "2026-07-31 14:02",
  },
  {
    id: "rep-0084",
    period: "Q1 2026",
    format: "excel",
    date: "2026-04-02",
    loads: 14,
    tons: 62.4,
    createdBy: "Aziz",
    dataVersion: "2026-04-02 09:11",
  },
  {
    id: "rep-0071",
    period: "To'liq yil 2025",
    format: "pdf",
    date: "2026-01-15",
    loads: 51,
    tons: 240.1,
    createdBy: "Dilnoza",
    dataVersion: "2026-01-15 10:47",
  },
];

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3 V13 M6 9.5 L10 13.5 L14 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16 H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="15" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="15" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 8.8 L13 5.9 M7 11.2 L13 14.1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function ReportsPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [panelOpen, setPanelOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("year");
  const [format, setFormat] = useState<Format>("pdf");
  const [genState, setGenState] = useState<GenState>("idle");
  const [linkCopied, setLinkCopied] = useState(false);

  const preview = PERIOD_DATA[period];
  const allVerified = preview.unverified === 0;
  const verifiedLoads = preview.loads - preview.unverified;

  const periods: { id: Period; label: string }[] = useMemo(
    () => [
      { id: "Q1", label: "Q1 2026" },
      { id: "Q2", label: "Q2 2026" },
      { id: "Q3", label: "Q3 2026" },
      { id: "Q4", label: "Q4 2026" },
      { id: "year", label: t.reportsFullYear },
    ],
    [t]
  );

  function openPanel() {
    setPanelOpen(true);
    setGenState("idle");
  }

  function generate() {
    setGenState("generating");
    window.setTimeout(() => setGenState("done"), 1400);
  }

  function copyLink() {
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1600);
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24">
          <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-6 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-headline text-ink-900">{t.reportsTitle}</h1>
              {!panelOpen && (
                <button
                  type="button"
                  onClick={openPanel}
                  className="flex h-12 items-center justify-center rounded-md bg-amber px-6 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  {t.reportsNew}
                </button>
              )}
            </div>

            {panelOpen && (
              <section className="flex flex-col gap-4 rounded-md border border-rule-soft bg-card p-6">
                <h2 className="text-title-s text-ink-900">{t.reportsNew}</h2>

                <div className="flex flex-wrap gap-2">
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPeriod(p.id);
                        setGenState("idle");
                      }}
                      aria-pressed={period === p.id}
                      className={`flex h-10 items-center justify-center rounded-md px-3 text-micro font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                        period === p.id
                          ? "border-2 border-amber-text text-ink-900"
                          : "border border-rule text-ink-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {([
                    { id: "pdf" as const, label: t.reportsFormatPdf },
                    { id: "excel" as const, label: t.reportsFormatExcel },
                  ]).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFormat(f.id);
                        setGenState("idle");
                      }}
                      aria-pressed={format === f.id}
                      className={`flex h-10 items-center justify-center rounded-md px-3 text-micro font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                        format === f.id
                          ? "border-2 border-amber-text text-ink-900"
                          : "border border-rule text-ink-600"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <p className="font-mono text-micro text-ink-600">
                  {allVerified
                    ? t.reportsPreviewAll(preview.loads, preview.tons, preview.companies)
                    : t.reportsPreviewPartial(
                        preview.loads,
                        preview.tons,
                        preview.companies,
                        verifiedLoads
                      )}
                </p>

                {!allVerified && (
                  <div className="flex flex-wrap items-center gap-2 rounded-md border border-short/40 bg-paper px-4 py-3">
                    <span className="text-body text-short">
                      {t.reportsUnverifiedWarning(preview.unverified)}
                    </span>
                    <button
                      type="button"
                      onClick={() => router.push("/evidence?filter=pending")}
                      className="text-body text-short underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      {t.reportsUnverifiedLink}
                    </button>
                  </div>
                )}

                {genState === "generating" ? (
                  <div className="h-14 w-full overflow-hidden rounded-md border border-rule bg-paper">
                    <div className="h-full w-1/2 animate-pulse bg-rule-soft" />
                  </div>
                ) : genState === "done" ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="flex h-14 min-w-[140px] flex-1 items-center justify-center rounded-md bg-amber px-4 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      {t.reportsOpen}
                    </button>
                    <button
                      type="button"
                      className="flex h-14 min-w-[140px] flex-1 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      {t.reportsSend}
                    </button>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex h-14 min-w-[140px] flex-1 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      {linkCopied ? t.reportsLinkCopied : t.reportsCopyLink}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={generate}
                    disabled={preview.loads === 0}
                    className="flex h-14 w-full items-center justify-center rounded-md bg-amber px-6 text-body font-semibold text-ink-900 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    {t.reportsCreate}
                  </button>
                )}
              </section>
            )}

            <section className="flex flex-col gap-2">
              <span className="block px-1 text-micro font-medium uppercase tracking-wide text-ink-600">
                {t.reportsHistoryTitle}
              </span>

              {HISTORY.length === 0 ? (
                <div className="flex flex-col items-start gap-4 rounded-md border border-rule-soft bg-card p-6">
                  <p className="max-w-[420px] text-body text-ink-600">
                    {t.reportsEmptyTitle}
                  </p>
                  <button
                    type="button"
                    onClick={openPanel}
                    className="flex h-14 min-w-[200px] items-center justify-center rounded-md bg-amber px-6 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    {t.reportsNew}
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border border-rule-soft bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                      <thead>
                        <tr className="h-10 border-b border-rule-soft text-left text-micro uppercase tracking-wide text-ink-500">
                          <th className="pl-4 font-medium">{t.reportsColPeriod}</th>
                          <th className="pr-4 font-medium">{t.reportsColFormat}</th>
                          <th className="pr-4 font-medium">{t.reportsColDate}</th>
                          <th className="pr-4 text-right font-medium">{t.reportsColLoads}</th>
                          <th className="pr-4 text-right font-medium">{t.reportsColTons}</th>
                          <th className="pr-4 text-right font-medium">{t.reportsColActions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HISTORY.map((row) => (
                          <tr
                            key={row.id}
                            className="h-12 border-b border-rule-soft text-body text-ink-900 last:border-b-0"
                          >
                            <td className="whitespace-nowrap pl-4">{row.period}</td>
                            <td className="pr-4 uppercase text-ink-600">{row.format}</td>
                            <td className="whitespace-nowrap pr-4 font-mono text-ink-600">
                              {row.date}
                            </td>
                            <td className="pr-4 text-right font-mono">{row.loads}</td>
                            <td className="pr-4 text-right font-mono">{row.tons.toFixed(1)}</td>
                            <td className="pr-4">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  aria-label={t.reportsDownloadPdf}
                                  title={t.reportsDownloadPdf}
                                  className="flex h-12 w-12 items-center justify-center rounded-md text-ink-600 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                >
                                  <DownloadIcon />
                                </button>
                                <button
                                  type="button"
                                  aria-label={t.reportsShareLink}
                                  title={t.reportsShareLink}
                                  className="flex h-12 w-12 items-center justify-center rounded-md text-ink-600 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                >
                                  <ShareIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-rule-soft px-4 py-3">
                    {HISTORY.map((row) => (
                      <p key={row.id} className="text-caption text-ink-500">
                        {row.id} — {t.reportsCreatedBy(row.createdBy, row.date)} ·{" "}
                        {t.reportsDataVersion(row.dataVersion)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <p className="px-1 text-caption text-ink-500">{t.reportsRestoreCaption}</p>
            </section>
          </div>
      </main>
    </>
  );
}
