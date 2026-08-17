"use client";

import { usePathname } from "next/navigation";
import { Sidebar, type OrgRole } from "@/components/ui/Sidebar";

const OWNER: { orgRole: OrgRole; name: string; company: string } = {
  orgRole: "owner",
  name: "Nodira",
  company: "EcoPlast",
};

const GATE_OPERATOR: { orgRole: OrgRole; name: string; company: string } = {
  orgRole: "gate_operator",
  name: "Sherzod",
  company: "EcoPlast",
};

export default function RecyclerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGateOperator = pathname.startsWith("/recycler/queue") || pathname.startsWith("/recycler/weigh-in");
  const currentUser = isGateOperator ? GATE_OPERATOR : OWNER;

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar
        role="recycler"
        orgRole={currentUser.orgRole}
        userName={currentUser.name}
        companyName={currentUser.company}
      />
      <div className="flex flex-1 flex-col bg-paper">{children}</div>
    </div>
  );
}
