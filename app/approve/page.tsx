"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";

type ItemType = "weight" | "offer" | "contract" | "member" | "flagged";

type BaseItem = {
  id: string;
  type: ItemType;
  company: string;
  time: string;
};

type WeightItem = BaseItem & {
  type: "weight";
  driverKg: number;
  scaleKg: number;
  hasPhoto: boolean;
};

type OfferItem = BaseItem & {
  type: "offer";
  material: string;
  tons: number;
  pricePerTon: number;
};

type ContractItem = BaseItem & {
  type: "contract";
  daysLeft: number;
};

type MemberItem = BaseItem & {
  type: "member";
  name: string;
  role: string;
  date: string;
};

type FlaggedItem = BaseItem & {
  type: "flagged";
  reason: string;
};

type ApprovalItem = WeightItem | OfferItem | ContractItem | MemberItem | FlaggedItem;

const INITIAL_ITEMS: ApprovalItem[] = [
  {
    id: "ap-1",
    type: "weight",
    company: "Tozalik MChJ",
    time: "Bugun 11:58",
    driverKg: 4200,
    scaleKg: 3900,
    hasPhoto: true,
  },
  {
    id: "ap-2",
    type: "offer",
    company: "EcoPlast MChJ",
    time: "Bugun 10:20",
    material: "PET",
    tons: 12,
    pricePerTon: 1450000,
  },
  {
    id: "ap-3",
    type: "flagged",
    company: "Recycle Uz",
    time: "Bugun 09:47",
    reason: "Ikkita yuk shu darvozadan 4 daqiqa ichida qayd etildi",
  },
  {
    id: "ap-4",
    type: "contract",
    company: "GreenLoop MChJ",
    time: "Kecha 17:10",
    daysLeft: 14,
  },
  {
    id: "ap-5",
    type: "member",
    company: "Tashkent Plast MChJ",
    time: "Kecha 15:02",
    name: "Diyorbek Qosimov",
    role: "Tarozichi",
    date: "07.08",
  },
];

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function TypeLabel({ children, tone }: { children: React.ReactNode; tone: "short" | "amber" | "ink" }) {
  const color =
    tone === "short" ? "text-short" : tone === "amber" ? "text-amber-text" : "text-ink-600";
  return (
    <span className={`text-micro font-medium uppercase tracking-wide ${color}`}>{children}</span>
  );
}

function Meta({ company, time }: { company: string; time: string }) {
  return (
    <span className="text-[13px] text-ink-500">
      {company} · {time}
    </span>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 flex-1 items-center justify-center rounded-md bg-amber px-4 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-rule-soft bg-card p-4">
      {children}
    </div>
  );
}

function WeightCard({ item, onAction }: { item: WeightItem; onAction: (label: string) => void }) {
  const diff = item.driverKg - item.scaleKg;
  const pct = ((diff / item.driverKg) * 100).toFixed(1);
  return (
    <Card>
      <TypeLabel tone="short">Og&apos;irlik mos kelmadi</TypeLabel>

      <div className="flex flex-col gap-1 font-mono text-body text-ink-900">
        <div className="flex justify-between">
          <span className="text-ink-600">Haydovchi:</span>
          <span>{formatNum(item.driverKg)} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-600">Tarozi:</span>
          <span>{formatNum(item.scaleKg)} kg</span>
        </div>
        <div className="flex justify-between text-short">
          <span>Farq:</span>
          <span>
            {formatNum(diff)} kg ({pct}%)
          </span>
        </div>
      </div>

      {item.hasPhoto && (
        <div
          aria-label="Tarozi fotosurati"
          className="flex h-[88px] w-[88px] items-center justify-center rounded-md border border-rule-soft bg-paper text-caption text-ink-500"
        >
          FOTO
        </div>
      )}

      <Meta company={item.company} time={item.time} />

      <div className="flex gap-2">
        <SecondaryButton onClick={() => onAction("Bahslashuvga yuborildi")}>
          Bahslash
        </SecondaryButton>
        <PrimaryButton onClick={() => onAction(`${formatNum(item.scaleKg)} kg qabul qilindi`)}>
          {formatNum(item.scaleKg)} kg ni qabul qilish
        </PrimaryButton>
      </div>
    </Card>
  );
}

function OfferCard({ item, onAction }: { item: OfferItem; onAction: (label: string) => void }) {
  return (
    <Card>
      <TypeLabel tone="ink">Yangi taklif</TypeLabel>

      <div className="flex flex-col gap-1 text-body text-ink-900">
        <span className="font-medium">{item.company}</span>
        <div className="flex justify-between font-mono text-ink-600">
          <span>{item.material}</span>
          <span>{item.tons} t</span>
        </div>
        <div className="flex justify-between font-mono">
          <span className="text-ink-600">Narx:</span>
          <span>{formatNum(item.pricePerTon)} so&apos;m/t</span>
        </div>
      </div>

      <Meta company={item.company} time={item.time} />

      <div className="flex gap-2">
        <SecondaryButton onClick={() => onAction("Taklif rad etildi")}>
          Rad etish
        </SecondaryButton>
        <PrimaryButton onClick={() => onAction("Taklif qabul qilindi")}>
          Qabul qilish
        </PrimaryButton>
      </div>
    </Card>
  );
}

function ContractCard({ item, onAction }: { item: ContractItem; onAction: (label: string) => void }) {
  return (
    <Card>
      <TypeLabel tone="amber">Shartnoma tugayapti</TypeLabel>

      <div className="flex flex-col gap-1 text-body text-ink-900">
        <span className="font-mono">{item.daysLeft} kunda tugaydi</span>
        <span className="text-ink-600">{item.company}</span>
      </div>

      <Meta company={item.company} time={item.time} />

      <div className="flex gap-2">
        <SecondaryButton onClick={() => onAction("O'tkazib yuborildi")}>
          O&apos;tkazib yuborish
        </SecondaryButton>
        <PrimaryButton onClick={() => onAction("Shartnoma yangilandi")}>
          Yangilash
        </PrimaryButton>
      </div>
    </Card>
  );
}

function MemberCard({ item, onAction }: { item: MemberItem; onAction: (label: string) => void }) {
  return (
    <Card>
      <TypeLabel tone="ink">Yangi a&apos;zo</TypeLabel>

      <div className="flex flex-col gap-1 text-body text-ink-900">
        <span className="font-medium">{item.name}</span>
        <span className="text-ink-600">
          {item.role} · {item.date}
        </span>
      </div>

      <Meta company={item.company} time={item.time} />

      <div className="flex gap-2">
        <SecondaryButton onClick={() => onAction("A'zolik rad etildi")}>
          Rad etish
        </SecondaryButton>
        <PrimaryButton onClick={() => onAction("A'zo qabul qilindi")}>
          Qabul qilish
        </PrimaryButton>
      </div>
    </Card>
  );
}

function FlaggedCard({ item, onAction }: { item: FlaggedItem; onAction: (label: string) => void }) {
  return (
    <Card>
      <TypeLabel tone="amber">Belgilangan yuk</TypeLabel>

      <p className="text-body text-ink-900">{item.reason}</p>

      <Meta company={item.company} time={item.time} />

      <div className="flex gap-2">
        <SecondaryButton onClick={() => onAction("Ko'rib chiqishga yuborildi")}>
          Ko&apos;rib chiqishga yuborish
        </SecondaryButton>
        <PrimaryButton onClick={() => onAction("Tasdiqlandi")}>
          Tasdiqlash
        </PrimaryButton>
      </div>
    </Card>
  );
}

type Toast = { id: string; message: string; item: ApprovalItem; index: number };

const UNDO_MS = 8000;

function UndoToast({ toast, onUndo }: { toast: Toast; onUndo: (id: string) => void }) {
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShrink(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex w-full max-w-[720px] flex-col overflow-hidden rounded-md border border-rule-soft bg-card shadow-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-body text-ink-900">{toast.message}</span>
        <button
          type="button"
          onClick={() => onUndo(toast.id)}
          className="shrink-0 text-body font-medium text-amber-text underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          Bekor qilish
        </button>
      </div>
      <div className="h-[3px] w-full bg-rule-soft">
        <div
          className="h-full bg-amber-text"
          style={{
            width: shrink ? "0%" : "100%",
            transition: shrink ? `width ${UNDO_MS}ms linear` : "none",
          }}
        />
      </div>
    </div>
  );
}

export default function ApprovePage() {
  const [items, setItems] = useState<ApprovalItem[]>(INITIAL_ITEMS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  function handleAction(item: ApprovalItem, message: string) {
    const index = items.findIndex((i) => i.id === item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    const toastId = `${item.id}-${Date.now()}`;
    setToasts((prev) => [...prev, { id: toastId, message, item, index }]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
      timers.current.delete(toastId);
    }, UNDO_MS);
    timers.current.set(toastId, timeout);
  }

  function handleUndo(toastId: string) {
    const toast = toasts.find((t) => t.id === toastId);
    if (!toast) return;

    const timeout = timers.current.get(toastId);
    if (timeout) {
      clearTimeout(timeout);
      timers.current.delete(toastId);
    }

    setToasts((prev) => prev.filter((t) => t.id !== toastId));
    setItems((prev) => {
      const next = [...prev];
      const insertAt = Math.min(toast.index, next.length);
      next.splice(insertAt, 0, toast.item);
      return next;
    });
  }

  const count = items.length;

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar
        role="producer"
        userName="Aziz"
        companyName="Tashkent Plast MChJ"
        approveCount={count}
      />

      <div className="flex flex-1 flex-col bg-paper">
        <main className="flex-1 overflow-y-auto pb-24">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-6 py-6">
            <div className="flex items-center gap-3">
              <h1 className="text-headline text-ink-900">Tasdiqlash</h1>
              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="flex h-6 min-w-[24px] items-center justify-center rounded-pill bg-amber px-2 font-mono text-[13px] font-semibold text-ink-900"
                >
                  {count}
                </span>
              )}
            </div>

            {count === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-md border border-rule-soft bg-card p-6">
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" stroke="var(--verified)" strokeWidth="1.6" />
                  <path
                    d="M6 10.2 L8.8 13 L14.5 7"
                    stroke="var(--verified)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-body text-ink-900">
                  Hammasi tartibda. Tasdiqlash uchun hech narsa yo&apos;q.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map((item) => {
                  switch (item.type) {
                    case "weight":
                      return (
                        <WeightCard
                          key={item.id}
                          item={item}
                          onAction={(msg) => handleAction(item, msg)}
                        />
                      );
                    case "offer":
                      return (
                        <OfferCard
                          key={item.id}
                          item={item}
                          onAction={(msg) => handleAction(item, msg)}
                        />
                      );
                    case "contract":
                      return (
                        <ContractCard
                          key={item.id}
                          item={item}
                          onAction={(msg) => handleAction(item, msg)}
                        />
                      );
                    case "member":
                      return (
                        <MemberCard
                          key={item.id}
                          item={item}
                          onAction={(msg) => handleAction(item, msg)}
                        />
                      );
                    case "flagged":
                      return (
                        <FlaggedCard
                          key={item.id}
                          item={item}
                          onAction={(msg) => handleAction(item, msg)}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            )}
          </div>
        </main>

        {toasts.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-6 py-4">
            {toasts.map((toast) => (
              <UndoToast key={toast.id} toast={toast} onUndo={handleUndo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
