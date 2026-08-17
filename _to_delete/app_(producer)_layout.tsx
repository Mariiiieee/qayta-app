"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { ApproveCountProvider, useApproveCount } from "@/components/ui/ApproveCountContext";

const user = {
  name: "Aziz",
  company: "Tashkent Plast MChJ",
};

function ProducerLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [approveCount] = useApproveCount();

  // /directory is shared with the recycler role (linked as /directory?role=recycler
  // from the recycler sidebar); everything else under this layout is producer-only.
  const role = pathname.startsWith("/directory") && searchParams.get("role") === "recycler"
    ? "recycler"
    : "producer";

  return (
    <div className="theme-transition flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        userName={user.name}
        companyName={user.company}
        approveCount={role === "producer" ? approveCount : 0}
      />
      <div className="flex flex-1 flex-col bg-paper">{children}</div>
    </div>
  );
}

export default function ProducerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ApproveCountProvider>
        <ProducerLayoutInner>{children}</ProducerLayoutInner>
      </ApproveCountProvider>
    </Suspense>
  );
}
