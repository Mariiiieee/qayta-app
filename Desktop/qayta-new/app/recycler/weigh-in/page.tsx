"use client";

import { useState } from "react";

const MATERIALS = ["PET", "HDPE", "PP"] as const;

export default function WeighInPage() {
  const [material, setMaterial] = useState<(typeof MATERIALS)[number]>("PET");
  const [plate, setPlate] = useState("");
  const [weight, setWeight] = useState("");
  const [saved, setSaved] = useState(false);

  function submit() {
    if (!plate.trim() || !weight.trim()) return;
    setSaved(true);
    setPlate("");
    setWeight("");
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-6">
        <h1 className="text-headline text-ink-900">Tarozi</h1>

            <div className="flex flex-col gap-4 rounded-md border border-rule-soft bg-card p-4">
              <div className="flex flex-col gap-2">
                <span className="text-micro font-medium uppercase tracking-wide text-ink-600">
                  Material
                </span>
                <div className="flex gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={material === m}
                      onClick={() => setMaterial(m)}
                      className={`flex h-10 flex-1 items-center justify-center rounded-md text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                        material === m
                          ? "border-2 border-amber-text text-ink-900"
                          : "border border-rule text-ink-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="plate" className="text-micro font-medium uppercase tracking-wide text-ink-600">
                  Mashina raqami
                </label>
                <input
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="h-12 rounded-md border border-rule bg-paper px-3 font-mono text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="weight" className="text-micro font-medium uppercase tracking-wide text-ink-600">
                  Og&apos;irlik (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  min={0}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 rounded-md border border-rule bg-paper px-3 font-mono text-[16px] text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                />
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!plate.trim() || !weight.trim()}
                className="flex h-14 w-full items-center justify-center rounded-md bg-amber text-[16px] font-semibold text-ink-900 disabled:cursor-not-allowed disabled:bg-rule-soft disabled:text-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                Saqlash
              </button>

              {saved && <p className="text-[13px] text-verified">Yuk qayd etildi.</p>}
            </div>
      </div>
    </main>
  );
}
