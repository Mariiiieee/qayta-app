import { Sidebar } from "@/components/ui/Sidebar";

const user = {
  name: "Davron Yigitaliyev",
  company: "EcoPlast Recycling",
};

export default function WeigherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-transition flex h-full min-h-screen">
      <Sidebar role="weigher" userName={user.name} companyName={user.company} />
      <div className="flex flex-1 flex-col bg-paper">{children}</div>
    </div>
  );
}
