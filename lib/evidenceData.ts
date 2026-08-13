export type EvidenceStatus = "pending" | "verified" | "rejected" | "disputed";
export type EvidenceMaterial = "PET" | "HDPE" | "PP";

export type TimelineEvent = {
  time: string;
  title: string;
  actor: string;
  location: string;
  detail: string;
  final?: EvidenceStatus;
};

export type Evidence = {
  id: string;
  weightT: number;
  material: EvidenceMaterial;
  recycler: string;
  status: EvidenceStatus;
  date: string;
  time: string;
  timeline: TimelineEvent[];
};

export const EVIDENCE: Evidence[] = [
  {
    id: "ev-1042",
    weightT: 12.4,
    material: "PET",
    recycler: "EcoPlast",
    status: "verified",
    date: "2026-08-08",
    time: "09:14",
    timeline: [
      {
        time: "09:14",
        title: "Yuk tortildi",
        actor: "Botir Karimov · tarozichi",
        location: "EcoPlast, Toshkent",
        detail: "12.4 t",
      },
      {
        time: "10:02",
        title: "Qayta ishlovchi tomonidan qabul qilindi",
        actor: "EcoPlast",
        location: "41.2995, 69.2401",
        detail: "12.4 t",
      },
      {
        time: "11:30",
        title: "TASDIQLANDI",
        actor: "EcoPlast",
        location: "Toshkent",
        detail: "12.4 t",
        final: "verified",
      },
    ],
  },
  {
    id: "ev-1041",
    weightT: 8.0,
    material: "HDPE",
    recycler: "Recycle Uz",
    status: "pending",
    date: "2026-08-07",
    time: "16:40",
    timeline: [
      {
        time: "16:40",
        title: "Yuk tortildi",
        actor: "Shahnoza Yusupova · tarozichi",
        location: "Recycle Uz, Toshkent",
        detail: "8.0 t",
      },
      {
        time: "17:05",
        title: "Qayta ishlovchi tomonidan qabul qilindi",
        actor: "Recycle Uz",
        location: "41.3111, 69.2797",
        detail: "8.0 t",
      },
    ],
  },
  {
    id: "ev-1039",
    weightT: 15.6,
    material: "PET",
    recycler: "EcoPlast",
    status: "verified",
    date: "2026-07-30",
    time: "08:22",
    timeline: [
      {
        time: "08:22",
        title: "Yuk tortildi",
        actor: "Botir Karimov · tarozichi",
        location: "EcoPlast, Toshkent",
        detail: "15.6 t",
      },
      {
        time: "09:47",
        title: "TASDIQLANDI",
        actor: "EcoPlast",
        location: "Toshkent",
        detail: "15.6 t",
        final: "verified",
      },
    ],
  },
  {
    id: "ev-1035",
    weightT: 5.2,
    material: "PP",
    recycler: "GreenLoop",
    status: "rejected",
    date: "2026-07-28",
    time: "13:05",
    timeline: [
      {
        time: "13:05",
        title: "Yuk tortildi",
        actor: "Diyor Nazarov · tarozichi",
        location: "GreenLoop, Samarqand",
        detail: "5.2 t",
      },
      {
        time: "14:20",
        title: "RAD ETILDI",
        actor: "GreenLoop",
        location: "Samarqand",
        detail: "Material mos kelmadi",
        final: "rejected",
      },
    ],
  },
  {
    id: "ev-1030",
    weightT: 20.1,
    material: "PET",
    recycler: "Recycle Uz",
    status: "verified",
    date: "2026-07-25",
    time: "10:11",
    timeline: [
      {
        time: "10:11",
        title: "Yuk tortildi",
        actor: "Shahnoza Yusupova · tarozichi",
        location: "Recycle Uz, Toshkent",
        detail: "20.1 t",
      },
      {
        time: "11:48",
        title: "TASDIQLANDI",
        actor: "Recycle Uz",
        location: "Toshkent",
        detail: "20.1 t",
        final: "verified",
      },
    ],
  },
  {
    id: "ev-1028",
    weightT: 9.7,
    material: "HDPE",
    recycler: "GreenLoop",
    status: "disputed",
    date: "2026-07-24",
    time: "15:33",
    timeline: [
      {
        time: "15:33",
        title: "Yuk tortildi",
        actor: "Diyor Nazarov · tarozichi",
        location: "GreenLoop, Samarqand",
        detail: "9.7 t",
      },
      {
        time: "16:10",
        title: "Og'irlik nomuvofiqligi qayd etildi",
        actor: "GreenLoop",
        location: "Samarqand",
        detail: "9.1 t (qayta ishlovchida)",
      },
      {
        time: "16:40",
        title: "BAHSLI",
        actor: "Tizim",
        location: "Samarqand",
        detail: "Ko'rib chiqilmoqda",
        final: "disputed",
      },
    ],
  },
];

export function getEvidenceById(id: string): Evidence | undefined {
  return EVIDENCE.find((e) => e.id === id);
}

export function statusLabel(status: EvidenceStatus): string {
  switch (status) {
    case "pending":
      return "Kutilmoqda";
    case "verified":
      return "Tasdiqlandi";
    case "rejected":
      return "Rad etildi";
    case "disputed":
      return "Bahsli";
  }
}
