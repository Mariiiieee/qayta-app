"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Sidebar, type Role, type OrgRole } from "@/components/ui/Sidebar";
import { ApproveCountProvider, useApproveCount } from "@/components/ui/ApproveCountContext";

// Routes that render their own chrome (auth / onboarding flow) and never show the sidebar.
const NO_SIDEBAR_PREFIXES = ["/login", "/role"];

const IDENTITIES = {
  producer: { name: "Aziz", company: "Tashkent Plast MChJ" },
  recyclerOwner: { name: "Nodira", company: "EcoPlast" },
  recyclerGateOperator: { name: "Sherzod", company: "EcoPlast" },
  weigher: { name: "Davron Yigitaliyev", company: "EcoPlast Recycling" },
  carrier: { name: "Bekzod", company: "Yakka haydovchi" },
} as const;

function resolveShell(pathname: string, searchParams: URLSearchParams) {
  if (pathname.startsWith("/recycler")) {
    const isGateOperator =
      pathname.startsWith("/recycler/queue") || pathname.startsWith("/recycler/weigh-in");
    return {
      role: "recycler" as Role,
      orgRole: (isGateOperator ? "gate_operator" : "owner") as OrgRole,
      identity: isGateOperator ? IDENTITIES.recyclerGateOperator : IDENTITIES.recyclerOwner,
    };
  }

  if (pathname.startsWith("/weigher")) {
    return { role: "weigher" as Role, orgRole: "owner" as OrgRole, identity: IDENTITIES.weigher };
  }

  if (pathname.startsWith("/carrier")) {
    return { role: "carrier" as Role, orgRole: "owner" as OrgRole, identity: IDENTITIES.carrier };
  }

  if (pathname.startsWith("/directory") && searchParams.get("role") === "recycler") {
    // Reached via the recycler sidebar's own Katalog link.
    return { role: "recycler" as Role, orgRole: "owner" as OrgRole, identity: IDENTITIES.recyclerOwner };
  }

  // /dashboard, /evidence(/[id]), /approve, /directory (producer view), /products, /reports, /profile
  return { role: "producer" as Role, orgRole: "owner" as OrgRole, identity: IDENTITIES.producer };
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [approveCount] = useApproveCount();

  const hideSidebar = pathname === "/" || NO_SIDEBAR_PREFIXES.some((p) => pathname.startsWith(p));
  if (hideSidebar) {
    return <>{children}</>;
  }

  const { role, orgRole, identity } = resolveShell(pathname, searchParams);

  return (
    <div className="theme-transition flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        orgRole={orgRole}
        userName={identity.name}
        companyName={identity.company}
        approveCount={role === "producer" ? approveCount : 0}
      />
      <div className="flex flex-1 flex-col bg-paper">{children}</div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ApproveCountProvider>
        <AppShellInner>{children}</AppShellInner>
      </ApproveCountProvider>
    </Suspense>
  );
}
