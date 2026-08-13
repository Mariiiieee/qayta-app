import { Sidebar } from "@/components/ui/Sidebar";

const currentUser = { name: "Bekzod", company: "Yakka haydovchi" };

export default function CarrierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-screen">
      <Sidebar role="carrier" userName={currentUser.name} companyName={currentUser.company} />
      <div className="flex flex-1 flex-col bg-paper">{children}</div>
    </div>
  );
}
