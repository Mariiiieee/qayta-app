"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { useLanguage } from "@/lib/i18n";

export type Role = "producer" | "recycler" | "admin" | "weigher" | "carrier";
export type OrgRole = "owner" | "manager" | "gate_operator";

type NavItem = { href: string; label: string; icon: "home" | "file" | "check" | "book" | "user" | "truck" | "scale" | "box" | "chart" | "wallet" };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  producer: [
    { href: "/dashboard", label: "Bosh sahifa", icon: "home" },
    { href: "/evidence", label: "Dalillar", icon: "file" },
    { href: "/approve", label: "Tasdiqlash", icon: "check" },
    { href: "/directory", label: "Katalog", icon: "book" },
    { href: "/products", label: "Mahsulotlar", icon: "box" },
    { href: "/reports", label: "Hisobotlar", icon: "chart" },
    { href: "/profile", label: "Profil", icon: "user" },
  ],
  recycler: [
    { href: "/recycler", label: "Bosh sahifa", icon: "home" },
    { href: "/recycler/loads", label: "Yuklar", icon: "file" },
    { href: "/directory?role=recycler", label: "Katalog", icon: "book" },
    { href: "/recycler/profile", label: "Profil", icon: "user" },
  ],
  admin: [
    { href: "/dashboard", label: "Bosh sahifa", icon: "home" },
    { href: "/evidence", label: "Dalillar", icon: "file" },
    { href: "/approve", label: "Tasdiqlash", icon: "check" },
    { href: "/directory", label: "Katalog", icon: "book" },
    { href: "/profile", label: "Profil", icon: "user" },
  ],
  weigher: [
    { href: "/weigher", label: "Navbat", icon: "check" },
    { href: "/weigher/weigh", label: "Tortish", icon: "scale" },
    { href: "/weigher/profile", label: "Profil", icon: "user" },
  ],
  carrier: [
    { href: "/carrier", label: "Yuklarim", icon: "truck" },
    { href: "/carrier/confirm", label: "Pul olish", icon: "check" },
    { href: "/carrier/money", label: "Pulim", icon: "wallet" },
    { href: "/carrier/profile", label: "Profil", icon: "user" },
  ],
};

const GATE_OPERATOR_NAV: NavItem[] = [
  { href: "/recycler/queue", label: "Navbat", icon: "check" },
  { href: "/recycler/weigh-in", label: "Tarozi", icon: "scale" },
  { href: "/profile", label: "Profil", icon: "user" },
];

function NavIcon({ name }: { name: NavItem["icon"] }) {
  const common = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", "aria-hidden": true } as const;
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 9 L10 3 L17 9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M5 8 V16 H15 V8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 8 H13 M7 11 H13 M7 14 H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 10 L9 12.5 L13.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 4 H10 V16 H4 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 4 H16 V16 H10 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 17 C4 13 7 11.5 10 11.5 C13 11.5 16 13 16 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="9" height="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 9 H15 L18 12 V14 H11 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="6" cy="15.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="14.5" cy="15.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common}>
          <path d="M10 3 V17 M5 6 H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M2 6 L5 12 H8.5 L5.5 6 Z M11.5 6 L14.5 12 H18 L15 6 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3 6.5 L10 3 L17 6.5 L10 10 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M3 6.5 V14 L10 17.5 L17 14 V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 10 V17.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 16 V4 M4 16 H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 13 V9 M10.5 13 V6 M14 13 V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9 H17" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="13.5" cy="12.5" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar({
  role,
  orgRole = "owner",
  userName,
  companyName,
  approveCount = 0,
  showToggle = true,
}: {
  role: Role;
  orgRole?: OrgRole;
  userName: string;
  companyName: string;
  approveCount?: number;
  showToggle?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const items =
    role === "recycler" && orgRole === "gate_operator" ? GATE_OPERATOR_NAV : NAV_BY_ROLE[role];
  const matches = items
    .map((item, idx) => ({ idx, len: pathname.startsWith(item.href) ? item.href.length : -1 }))
    .filter((m) => m.len >= 0)
    .sort((a, b) => b.len - a.len);
  const activeIndex = matches.length > 0 ? matches[0].idx : -1;
  const ITEM_STEP = 48;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-rule-soft bg-card">
      <div className="mb-8 flex items-center justify-between px-6 pt-6">
        <span className="text-[19px] font-semibold tracking-wide text-ink-900">QAYTA</span>
        {showToggle && <DarkModeToggle />}
      </div>

      <nav className="relative flex flex-1 flex-col overflow-y-auto px-2">
        <div
          aria-hidden="true"
          className="nav-pill pointer-events-none absolute left-0 right-0 top-0 z-0 h-12 rounded-r-md"
          style={{
            transform: `translateY(${Math.max(activeIndex, 0) * ITEM_STEP}px)`,
            transition: mounted ? "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            opacity: activeIndex < 0 ? 0 : 1,
          }}
        />
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive}
              className={`group relative z-10 flex h-12 items-center gap-3 rounded px-4 text-body transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                isActive ? "" : "hover:bg-[rgba(143,132,104,0.08)]"
              }`}
            >
              <span
                className={`flex items-center transition-colors duration-150 ease-out ${
                  isActive ? "text-amber" : "text-ink-500 group-hover:text-ink-900"
                }`}
              >
                <NavIcon name={item.icon} />
              </span>
              <span
                className={`flex-1 transition-colors duration-150 ease-out ${
                  isActive ? "font-medium text-amber-text" : "text-ink-600"
                }`}
              >
                {item.label}
              </span>
              {item.href === "/approve" && approveCount > 0 && (
                <span
                  aria-hidden="true"
                  className="flex h-5 min-w-[20px] items-center justify-center rounded-pill bg-short px-1.5 font-mono text-[11px] font-semibold text-card"
                >
                  {approveCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-rule-soft px-6 py-4">
        <span className="truncate text-micro text-ink-500">{companyName}</span>
        <span className="truncate text-body text-ink-900">{userName}</span>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-2 w-fit text-left text-micro text-ink-500 underline decoration-1 underline-offset-2 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          {t.profileLogout}
        </button>
      </div>
    </aside>
  );
}
