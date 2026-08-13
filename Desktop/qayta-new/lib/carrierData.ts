export type LoadStatus = "paid" | "pending";

export type CarrierLoad = {
  id: string;
  recycler: string;
  material: string;
  weightKg: number;
  status: LoadStatus;
  date: string;
};

export const CARRIER_LOADS: CarrierLoad[] = [
  { id: "ld-3301", recycler: "EcoPlast", material: "PET", weightKg: 4200, status: "pending", date: "Bugun 09:12" },
  { id: "ld-3298", recycler: "Recycle Uz", material: "HDPE", weightKg: 2800, status: "paid", date: "Bugun 08:04" },
  { id: "ld-3290", recycler: "GreenLoop", material: "PP", weightKg: 3150, status: "paid", date: "Kecha 17:40" },
  { id: "ld-3284", recycler: "EcoPlast", material: "PET", weightKg: 1900, status: "paid", date: "Kecha 11:22" },
];

export type PendingPayout = {
  id: string;
  recycler: string;
  weightKg: number;
  material: string;
  amountSum: number;
  photoUrl: string | null;
};

export const PENDING_PAYOUT: PendingPayout = {
  id: "ld-3301",
  recycler: "EcoPlast",
  weightKg: 4200,
  material: "PET",
  amountSum: 1260000,
  photoUrl: null,
};

export const DISPUTE_REASONS = [
  { id: "weight", label: "Noto'g'ri og'irlik" },
  { id: "material", label: "Noto'g'ri material" },
  { id: "not_mine", label: "Mening yukum emas" },
] as const;

export type PayoutRow = {
  id: string;
  recycler: string;
  weightKg: number;
  amountSum: number;
  status: LoadStatus;
};

export const MONTH_PAYOUTS: PayoutRow[] = [
  { id: "ld-3301", recycler: "EcoPlast", weightKg: 4200, amountSum: 1260000, status: "pending" },
  { id: "ld-3298", recycler: "Recycle Uz", weightKg: 2800, amountSum: 840000, status: "paid" },
  { id: "ld-3290", recycler: "GreenLoop", weightKg: 3150, amountSum: 945000, status: "paid" },
  { id: "ld-3284", recycler: "EcoPlast", weightKg: 1900, amountSum: 570000, status: "paid" },
  { id: "ld-3271", recycler: "Recycle Uz", weightKg: 2400, amountSum: 720000, status: "paid" },
  { id: "ld-3260", recycler: "GreenLoop", weightKg: 3600, amountSum: 1080000, status: "paid" },
];

export function formatSum(n: number): string {
  return n.toLocaleString("uz-UZ").replace(/,/g, " ") + " so'm";
}

export function formatKg(n: number): string {
  return n.toLocaleString("uz-UZ").replace(/,/g, " ") + " kg";
}
