"use client";

import { useRouter } from "next/navigation";
import { EVIDENCE, statusLabel, type EvidenceStatus } from "@/lib/evidenceData";

const currentUser = {
  name: "Nodira",
  company: "EcoPlast",
};

function StatusDot({ status }: { status: EvidenceStatus }) {
  if (status === "disputed") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-[10px] w-[10px] rounded-full border-2 border-short bg-transparent"
      />
    );
  }
  const color =
    status === "pending" ? "bg-amber" : status === "verified" ? "bg-verified" : "bg-short";
  return <span aria-hidden="true" className={`inline-block h-[10px] w-[10px] rounded-full ${color}`} />;
}

export default function RecyclerLoadsPage() {
  const router = useRouter();
  const rows = EVIDENCE.filter((e) => e.recycler === currentUser.company);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4 px-6 py-6">
        <h1 className="text-headline text-ink-900">Yuklar</h1>

            {rows.length === 0 ? (
              <p className="px-1 py-6 text-body text-ink-600">Hali yuklar yo&apos;q.</p>
            ) : (
              <div className="overflow-hidden rounded-md border border-rule-soft bg-card">
                <table className="w-full border-collapse">
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        tabIndex={0}
                        onClick={() => router.push(`/evidence/${row.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") router.push(`/evidence/${row.id}`);
                        }}
                        className="h-12 cursor-pointer border-b border-rule-soft text-body text-ink-900 last:border-b-0 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-text"
                      >
                        <td className="w-10 pl-4">
                          <StatusDot status={row.status} />
                        </td>
                        <td className="whitespace-nowrap pr-4 font-mono">
                          {row.weightT.toFixed(1)} t
                        </td>
                        <td className="pr-4 text-ink-600">{row.material}</td>
                        <td className="pr-4 text-ink-600">{statusLabel(row.status)}</td>
                        <td className="pr-4 text-right font-mono text-[13px] text-ink-500">
                          {row.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </main>
  );
}
