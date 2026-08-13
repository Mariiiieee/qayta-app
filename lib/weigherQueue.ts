"use client";

import { useSyncExternalStore } from "react";

export type TruckStatus = "pending" | "verified" | "rejected";
export type MaterialCode = "PET" | "HDPE" | "PP" | "PVC" | "LDPE" | "PS" | "OTHER";

export type Truck = {
  id: string;
  plate: string;
  driver: string;
  material: MaterialCode;
  status: TruckStatus;
  weightKg?: number;
};

export const MATERIALS: { code: MaterialCode; name: string }[] = [
  { code: "PET", name: "suv shishalari" },
  { code: "HDPE", name: "polietilen" },
  { code: "PP", name: "polipropilen" },
  { code: "PVC", name: "PVX" },
  { code: "LDPE", name: "yumshoq plyonka" },
  { code: "PS", name: "penopolistirol" },
];

let trucks: Truck[] = [
  { id: "1", plate: "01 A 234 BC", driver: "Bobur Toshmatov", material: "PET", status: "pending" },
  { id: "2", plate: "78 B 901 KL", driver: "Sardor Rahimov", material: "HDPE", status: "pending" },
  { id: "3", plate: "45 C 567 DE", driver: "Jasur Karimov", material: "PP", status: "verified", weightKg: 3800 },
  { id: "4", plate: "23 D 890 FG", driver: "Mirzo Yusupov", material: "PET", status: "pending" },
  { id: "5", plate: "67 E 123 HI", driver: "Otabek Nazarov", material: "HDPE", status: "rejected" },
];

let pendingSync = 3;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTrucks() {
  return trucks;
}

export function getPendingSync() {
  return pendingSync;
}

export function retrySync() {
  pendingSync = 0;
  emit();
}

export function completeWeighIn(truck: {
  id?: string;
  plate: string;
  driver: string;
  material: MaterialCode;
  weightKg: number;
}) {
  if (truck.id) {
    trucks = trucks.map((t) =>
      t.id === truck.id ? { ...t, material: truck.material, weightKg: truck.weightKg, status: "verified" } : t
    );
  } else {
    trucks = [
      { id: String(Date.now()), plate: truck.plate, driver: truck.driver, material: truck.material, status: "verified", weightKg: truck.weightKg },
      ...trucks,
    ];
  }
  emit();
}

export function useTrucks() {
  return useSyncExternalStore(subscribe, getTrucks, getTrucks);
}

export function usePendingSync() {
  return useSyncExternalStore(subscribe, getPendingSync, getPendingSync);
}
