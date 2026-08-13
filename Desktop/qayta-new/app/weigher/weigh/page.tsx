"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MATERIALS,
  completeWeighIn,
  useTrucks,
  type MaterialCode,
  type Truck,
} from "@/lib/weigherQueue";

type Step = 1 | 2 | 3 | 4 | "code";

const STEP_LABELS = ["Kim bu?", "Nima bu?", "Qancha?", "Foto"];

function Stepper({ step }: { step: Step }) {
  const active = step === "code" ? 4 : step;
  return (
    <div className="flex items-center gap-2 px-6 pt-6">
      {STEP_LABELS.map((_, idx) => {
        const n = idx + 1;
        const state = n < active ? "done" : n === active ? "active" : "future";
        return (
          <span
            key={n}
            className={`h-2 w-2 rounded-pill ${
              state === "active" ? "bg-amber" : state === "done" ? "bg-verified" : "bg-rule-soft"
            }`}
          />
        );
      })}
      <span className="ml-2 text-[13px] text-ink-500">Qadam {active} / 4</span>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Orqaga"
      className="flex h-12 w-12 items-center justify-center rounded-md text-[19px] text-ink-600 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
    >
      ←
    </button>
  );
}

export default function WeighInPage() {
  const router = useRouter();
  const trucks = useTrucks();
  const [step, setStep] = useState<Step>(1);

  const [truck, setTruck] = useState<Truck | null>(null);
  const [newPlate, setNewPlate] = useState("");
  const [newDriver, setNewDriver] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  const [material, setMaterial] = useState<MaterialCode | null>(null);
  const [materialPickerOpen, setMaterialPickerOpen] = useState(false);

  const [weight, setWeight] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const code = useMemo(() => String(Math.floor(1000 + Math.random() * 9000)), [step === "code"]);

  const weightNum = Number(weight || "0");
  const weightWarning = weight.length > 0 && (weightNum > 40000 || weightNum < 50);

  function pickTruck(t: Truck) {
    setTruck(t);
    setMaterial(t.material);
    setStep(2);
  }

  function confirmNewTruck() {
    if (!newPlate.trim()) return;
    setTruck(null);
    setStep(2);
  }

  function pressDigit(d: string) {
    setWeight((w) => (w.length >= 5 ? w : w + d));
  }

  function backspace() {
    setWeight((w) => w.slice(0, -1));
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
  }

  function submit() {
    completeWeighIn({
      id: truck?.id,
      plate: truck?.plate ?? newPlate,
      driver: truck?.driver ?? newDriver,
      material: material ?? "OTHER",
      weightKg: weightNum,
    });
    setStep("code");
  }

  function reset() {
    setTruck(null);
    setNewPlate("");
    setNewDriver("");
    setAddingNew(false);
    setMaterial(null);
    setWeight("");
    setPhoto(null);
    router.push("/weigher");
  }

  if (step === "code") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-paper px-6">
        <div className="flex flex-col items-center gap-2 rounded-md border-2 border-amber p-8">
          <span className="font-mono text-[64px] font-semibold tracking-[16px] text-ink-900">
            {code.split("").join(" ")}
          </span>
        </div>
        <p className="mt-6 text-[19px] text-ink-600">Haydovchiga ko'rsating</p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 flex h-14 w-full max-w-[360px] items-center justify-center rounded-md bg-verified text-[19px] font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
        >
          Tasdiqlandi
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-paper">
      <Stepper step={step} />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-6 py-6">
        <div className="flex items-center gap-3">
          {step !== 1 && (
            <BackButton onClick={() => setStep((s) => (Math.max(1, (s as number) - 1) as Step))} />
          )}
          <h1 className="text-[28px] font-semibold leading-[1.2] text-ink-900">
            {STEP_LABELS[(step as number) - 1]}
          </h1>
        </div>

        {step === 1 && !addingNew && (
          <div className="mt-6 flex flex-1 flex-col">
            <div className="flex flex-col rounded-md bg-card">
              {trucks.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => pickTruck(t)}
                  className={`flex h-16 items-center gap-4 px-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-text ${
                    idx !== trucks.length - 1 ? "border-b border-rule-soft" : ""
                  }`}
                >
                  <span className="font-mono text-[23px] font-semibold text-ink-900">{t.plate}</span>
                  <span className="text-[13px] text-ink-500">{t.driver}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAddingNew(true)}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-md border border-rule bg-card text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              + Yangi
            </button>
          </div>
        )}

        {step === 1 && addingNew && (
          <div className="mt-6 flex flex-1 flex-col gap-4">
            <input
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value)}
              placeholder="01 A 234 BC"
              className="h-14 rounded-md border border-rule bg-card px-4 font-mono text-[19px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            />
            <input
              value={newDriver}
              onChange={(e) => setNewDriver(e.target.value)}
              placeholder="Haydovchi ismi"
              className="h-14 rounded-md border border-rule bg-card px-4 text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            />
            <button
              type="button"
              disabled={!newPlate.trim()}
              onClick={confirmNewTruck}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-md bg-amber text-[16px] font-semibold text-ink-900 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              Davom etish
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 flex flex-1 flex-col">
            <div className="grid grid-cols-3 gap-3">
              {MATERIALS.slice(0, 3).map((m) => (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => {
                    setMaterial(m.code);
                    setStep(3);
                  }}
                  className={`flex h-[120px] flex-col items-center justify-center gap-1 rounded-md border-2 bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                    material === m.code ? "border-amber-text" : "border-rule"
                  }`}
                >
                  <span className="text-[23px] font-semibold text-ink-900">{m.code}</span>
                  <span className="text-[13px] text-ink-500">{m.name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMaterialPickerOpen(true)}
              className="mt-3 flex h-14 w-full items-center justify-center rounded-md border border-rule bg-card text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              Boshqa +
            </button>

            {materialPickerOpen && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
                onClick={() => setMaterialPickerOpen(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex w-full max-w-[360px] flex-col gap-1 rounded-md bg-card p-4"
                >
                  {MATERIALS.map((m) => (
                    <button
                      key={m.code}
                      type="button"
                      onClick={() => {
                        setMaterial(m.code);
                        setMaterialPickerOpen(false);
                        setStep(3);
                      }}
                      className="flex h-12 items-center justify-between rounded-md px-3 text-left hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-text"
                    >
                      <span className="font-mono text-[16px] font-semibold text-ink-900">{m.code}</span>
                      <span className="text-[13px] text-ink-500">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 flex flex-1 flex-col">
            <div className="flex items-baseline justify-center gap-2 py-4">
              <span className="font-mono text-[48px] font-semibold text-ink-900">
                {weight || "0"}
              </span>
              <span className="text-[19px] text-ink-500">kg</span>
            </div>

            {weightWarning && (
              <div className="rounded-md bg-amber px-4 py-2 text-center text-[13px] font-medium text-ink-900">
                Bu og'irlik odatiy emas. Tekshiring.
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <NumKey key={d} label={d} onClick={() => pressDigit(d)} />
              ))}
              <NumKey label="00" onClick={() => pressDigit("00")} />
              <NumKey label="0" onClick={() => pressDigit("0")} />
              <NumKey label="⌫" onClick={backspace} />
            </div>

            <button
              type="button"
              disabled={weight.length === 0}
              onClick={() => setStep(4)}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-md bg-amber text-[19px] font-semibold text-ink-900 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
            >
              Davom etish
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 flex flex-1 flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onPhotoChange}
              className="hidden"
            />
            {!photo ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[320px] w-full flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-rule-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                <span className="text-[48px] text-ink-500" aria-hidden="true">
                  📷
                </span>
                <span className="text-[16px] text-ink-500">Foto yuklash</span>
              </button>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt="Yuk fotosi"
                  className="h-[320px] w-full rounded-md object-cover"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      fileInputRef.current?.click();
                    }}
                    className="flex h-12 flex-1 items-center justify-center rounded-md border border-rule bg-card text-[16px] font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Qayta
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    className="flex h-14 flex-1 items-center justify-center rounded-md bg-amber text-[16px] font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Yuborish
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function NumKey({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-20 items-center justify-center rounded-md border border-rule bg-card font-mono text-[23px] text-ink-900 transition-[background-color,transform] duration-150 hover:bg-rule-soft active:scale-[0.97] active:duration-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
    >
      {label}
    </button>
  );
}
