import { Sidebar } from "@/components/ui/Sidebar";

const user = {
  name: "Aziz",
  company: "Tashkent Plast MChJ",
};

export default function ProducerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-transition flex h-full min-h-screen">
      <Sidebar role="producer" userName={user.name} companyName={user.company} />
      <div className="flex flex-1 flex-col bg-paper">{children}</div>
    </div>
  );
}
