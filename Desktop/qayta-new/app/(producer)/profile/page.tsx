"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, type Lang } from "@/lib/i18n";
import { type Role } from "@/components/ui/Sidebar";

const user = {
  role: "producer" as Role,
  name: "Aziz Karimov",
  phone: "90 123 45 67",
  companyName: "Tashkent Plast MChJ",
  taxId: "302847561",
  verified: true,
};

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-ink-500">
      <rect x="5" y="9" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9 V6.5 A3 3 0 0 1 13 6.5 V9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-ink-500 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M5 8 L10 13 L15 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-8 text-[13px] font-medium uppercase tracking-wide text-ink-600 first:mt-0">
      {children}
    </h2>
  );
}

function Row({
  label,
  children,
  onClick,
  href,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const router = useRouter();
  const clickable = Boolean(onClick || href);
  const handle = () => {
    if (href) router.push(href);
    else onClick?.();
  };

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? handle : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter") handle();
            }
          : undefined
      }
      className={`flex min-h-[48px] items-center justify-between gap-4 border-b border-rule-soft py-2 text-[16px] text-ink-900 last:border-b-0 ${
        clickable ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text" : ""
      }`}
    >
      <span className="text-ink-600">{label}</span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-md p-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
        checked ? "bg-amber-text" : "bg-rule-soft"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-sm bg-card transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function ProfilePage() {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [nameSaved, setNameSaved] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [notifEvidence, setNotifEvidence] = useState(true);
  const [notifApproval, setNotifApproval] = useState(true);
  const [notifReports, setNotifReports] = useState(false);

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function saveName() {
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 1500);
    nameInputRef.current?.blur();
  }

  function exportData() {
    const payload = {
      company: user.companyName,
      taxId: user.taxId,
      name,
      phone: user.phone,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qayta-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[640px] flex-col px-6 py-6">
            <h1 className="text-[28px] font-semibold leading-[1.2] text-ink-900">{t.profileTitle}</h1>

            <SectionHeader>{t.profileSectionCompany}</SectionHeader>
            <div className="flex flex-col rounded-md bg-card px-4">
              <Row label={t.profileCompanyName}>
                <LockIcon />
                <span className="text-ink-900">{user.companyName}</span>
              </Row>
              <Row label={t.profileTaxId}>
                <LockIcon />
                <span className="font-mono text-ink-900">{user.taxId}</span>
              </Row>
              <Row label={t.profileProducts} href="/products">
                <span className="text-ink-500">→</span>
              </Row>
              <Row label={t.profileTeam} href="/team">
                <span className="text-ink-500">→</span>
              </Row>
              {user.verified && (
                <Row label={t.profileVerifiedBadge}>
                  <span className="flex h-6 items-center rounded-pill bg-verified/15 px-2 text-[13px] font-medium text-verified">
                    ✓
                  </span>
                </Row>
              )}
            </div>
            <p className="mt-2 text-[13px] text-ink-500">{t.profileLockedHint}</p>

            <SectionHeader>{t.profileSectionAccount}</SectionHeader>
            <div className="flex flex-col rounded-md bg-card px-4">
              <Row label={t.profileName}>
                <input
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                  }}
                  className="w-40 rounded-md bg-transparent px-1 text-right text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                />
                {nameSaved && <span className="text-[13px] text-verified">{t.profileNameSaved}</span>}
              </Row>
              <Row label={t.profilePhone}>
                <span className="font-mono text-ink-900">+998 {user.phone}</span>
                <button
                  type="button"
                  onClick={() => setPhoneModalOpen(true)}
                  className="text-[16px] text-amber-text underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  {t.profilePhoneChange}
                </button>
              </Row>
              <Row label={t.profileLanguage}>
                <div className="flex overflow-hidden rounded-md border border-rule">
                  {(["uz", "ru", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={lang === l}
                      onClick={() => setLang(l)}
                      className={`flex h-10 w-11 items-center justify-center text-[13px] font-medium uppercase focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-text ${
                        lang === l ? "bg-amber text-ink-900" : "text-ink-600 hover:bg-paper"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </Row>
              <Row label={t.profileNotifications}>
                <span />
              </Row>
              <div className="flex flex-col gap-1 pb-2 pl-2">
                <Row label={t.profileNotifEvidence}>
                  <Toggle checked={notifEvidence} onChange={() => setNotifEvidence((v) => !v)} label={t.profileNotifEvidence} />
                </Row>
                <Row label={t.profileNotifApproval}>
                  <Toggle checked={notifApproval} onChange={() => setNotifApproval((v) => !v)} label={t.profileNotifApproval} />
                </Row>
                <Row label={t.profileNotifReports}>
                  <Toggle checked={notifReports} onChange={() => setNotifReports((v) => !v)} label={t.profileNotifReports} />
                </Row>
              </div>
            </div>

            {user.role === "producer" && (
              <>
                <SectionHeader>{t.profileSectionPayment}</SectionHeader>
                <div className="flex flex-col rounded-md bg-card px-4">
                  <Row label={t.profilePlan}>
                    <span className="text-ink-900">{t.profilePlanValue}</span>
                  </Row>
                  <Row label={t.profileInvoices} href="/invoices">
                    <span className="text-ink-500">→</span>
                  </Row>
                  <Row label={t.profilePaymentMethod}>
                    <span className="font-mono text-ink-900">•••• 4821</span>
                  </Row>
                </div>
              </>
            )}

            <SectionHeader>{t.profileSectionInfo}</SectionHeader>
            <div className="flex flex-col rounded-md bg-card px-4">
              <div className="border-b border-rule-soft py-2">
                <button
                  type="button"
                  onClick={() => setComplianceOpen((v) => !v)}
                  aria-expanded={complianceOpen}
                  className="flex min-h-[44px] w-full items-center justify-between gap-4 text-left text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  {t.profileComplianceHow}
                  <ChevronIcon open={complianceOpen} />
                </button>
                {complianceOpen && (
                  <p className="max-w-[70ch] pb-2 pt-2 text-[16px] leading-[1.5] text-ink-600">
                    {t.profileComplianceHowBody}
                  </p>
                )}
              </div>
              <Row label={t.profileTerms} href="/terms">
                <span className="text-ink-500">→</span>
              </Row>
              <Row label={t.profilePrivacy} href="/privacy">
                <span className="text-ink-500">→</span>
              </Row>
              <Row label={t.profileExportAll} onClick={exportData}>
                <span className="text-ink-500">↓</span>
              </Row>
              <Row label={t.profileContactSupport} href="/support">
                <span className="text-ink-500">→</span>
              </Row>
            </div>

            <div className="mt-8 flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="text-[16px] text-short underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.profileDeleteAccount}
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-[16px] text-short underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.profileLogout}
              </button>
            </div>
          </div>
      </main>

      {phoneModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="phone-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
          onClick={() => setPhoneModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[420px] flex-col gap-4 rounded-md bg-card p-6 shadow-lg"
          >
            <h2 id="phone-modal-title" className="text-[19px] font-medium leading-[1.35] text-ink-900">
              {t.profilePhoneModalTitle}
            </h2>
            <p className="text-[16px] leading-[1.5] text-ink-600">{t.profilePhoneModalBody}</p>
            <input
              type="tel"
              defaultValue={user.phone}
              className="h-12 rounded-md border border-rule bg-paper px-3 font-mono text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhoneModalOpen(false)}
                className="flex h-14 flex-1 items-center justify-center rounded-md bg-amber px-4 text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.profilePhoneModalSend}
              </button>
              <button
                type="button"
                onClick={() => setPhoneModalOpen(false)}
                className="flex h-14 items-center justify-center rounded-md border border-rule bg-card px-4 text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[420px] flex-col gap-4 rounded-md bg-card p-6 shadow-lg"
          >
            <h2 id="delete-modal-title" className="text-[19px] font-medium leading-[1.35] text-short">
              {t.profileDeleteAccount}
            </h2>
            <p className="text-[16px] leading-[1.5] text-ink-600">{t.profileDeleteWarning}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex h-14 flex-1 items-center justify-center rounded-md border border-rule bg-card px-4 text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.profileCancel}
              </button>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex h-14 flex-1 items-center justify-center rounded-md bg-short px-4 text-[16px] font-semibold text-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                {t.profileDeleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
