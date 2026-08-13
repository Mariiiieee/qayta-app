export type Material = "PET" | "HDPE" | "PP";

export type DirectoryEntry = {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  verified: boolean;
  materials: Material[];
  quantityT: number;
  updatedDaysAgo: number;
  phone: string;
  telegram: string;
  licenses: string[];
  photoCaption: string;
  historicalVerified: { month: string; tons: number }[];
  avgResponseHours: number;
};

export const STALE_DAYS = 30;

const RECYCLERS: DirectoryEntry[] = [
  {
    id: "ecoplast",
    name: "EcoPlast",
    city: "Toshkent",
    distanceKm: 4,
    verified: true,
    materials: ["PET", "HDPE"],
    quantityT: 180,
    updatedDaysAgo: 2,
    phone: "+998 90 123 45 67",
    telegram: "@ecoplast_uz",
    licenses: ["Qayta ishlash litsenziyasi №0412", "Ekologik nazorat sertifikati"],
    photoCaption: "EcoPlast zavodi, Toshkent",
    historicalVerified: [
      { month: "Mart", tons: 142 },
      { month: "Aprel", tons: 156 },
      { month: "May", tons: 138 },
      { month: "Iyun", tons: 164 },
      { month: "Iyul", tons: 171 },
    ],
    avgResponseHours: 3,
  },
  {
    id: "recycle-uz",
    name: "Recycle Uz",
    city: "Toshkent",
    distanceKm: 9,
    verified: true,
    materials: ["PET", "PP"],
    quantityT: 96,
    updatedDaysAgo: 1,
    phone: "+998 90 234 56 78",
    telegram: "@recycleuz",
    licenses: ["Qayta ishlash litsenziyasi №0298"],
    photoCaption: "Recycle Uz zavodi, Toshkent",
    historicalVerified: [
      { month: "Mart", tons: 74 },
      { month: "Aprel", tons: 81 },
      { month: "May", tons: 88 },
      { month: "Iyun", tons: 92 },
      { month: "Iyul", tons: 90 },
    ],
    avgResponseHours: 6,
  },
  {
    id: "greenloop",
    name: "GreenLoop",
    city: "Samarqand",
    distanceKm: 260,
    verified: false,
    materials: ["PP", "HDPE"],
    quantityT: 42,
    updatedDaysAgo: 12,
    phone: "+998 90 345 67 89",
    telegram: "@greenloop_smd",
    licenses: ["Qayta ishlash litsenziyasi №0517"],
    photoCaption: "GreenLoop zavodi, Samarqand",
    historicalVerified: [
      { month: "Mart", tons: 31 },
      { month: "Aprel", tons: 28 },
      { month: "May", tons: 35 },
      { month: "Iyun", tons: 39 },
      { month: "Iyul", tons: 40 },
    ],
    avgResponseHours: 14,
  },
  {
    id: "plastfera",
    name: "Plastfera",
    city: "Farg'ona",
    distanceKm: 320,
    verified: true,
    materials: ["PET"],
    quantityT: 0,
    updatedDaysAgo: 3,
    phone: "+998 90 456 78 90",
    telegram: "@plastfera",
    licenses: ["Qayta ishlash litsenziyasi №0603"],
    photoCaption: "Plastfera zavodi, Farg'ona",
    historicalVerified: [
      { month: "Mart", tons: 58 },
      { month: "Aprel", tons: 61 },
      { month: "May", tons: 55 },
      { month: "Iyun", tons: 63 },
      { month: "Iyul", tons: 60 },
    ],
    avgResponseHours: 5,
  },
  {
    id: "namangan-plast",
    name: "Namangan Plast",
    city: "Namangan",
    distanceKm: 380,
    verified: false,
    materials: ["HDPE", "PP"],
    quantityT: 65,
    updatedDaysAgo: 45,
    phone: "+998 90 567 89 01",
    telegram: "@namanganplast",
    licenses: ["Qayta ishlash litsenziyasi №0721"],
    photoCaption: "Namangan Plast zavodi, Namangan",
    historicalVerified: [
      { month: "Mart", tons: 22 },
      { month: "Aprel", tons: 19 },
      { month: "May", tons: 24 },
      { month: "Iyun", tons: 21 },
      { month: "Iyul", tons: 20 },
    ],
    avgResponseHours: 20,
  },
  {
    id: "bukhara-recycling",
    name: "Bukhara Recycling",
    city: "Buxoro",
    distanceKm: 430,
    verified: true,
    materials: ["PET", "HDPE", "PP"],
    quantityT: 210,
    updatedDaysAgo: 0,
    phone: "+998 90 678 90 12",
    telegram: "@bukharacycling",
    licenses: ["Qayta ishlash litsenziyasi №0455", "ISO 14001"],
    photoCaption: "Bukhara Recycling zavodi, Buxoro",
    historicalVerified: [
      { month: "Mart", tons: 168 },
      { month: "Aprel", tons: 174 },
      { month: "May", tons: 189 },
      { month: "Iyun", tons: 195 },
      { month: "Iyul", tons: 203 },
    ],
    avgResponseHours: 2,
  },
];

const PRODUCER_SEEKERS: DirectoryEntry[] = [
  {
    id: "tashkent-plast",
    name: "Tashkent Plast MChJ",
    city: "Toshkent",
    distanceKm: 3,
    verified: true,
    materials: ["PET"],
    quantityT: 128,
    updatedDaysAgo: 1,
    phone: "+998 90 111 22 33",
    telegram: "@tashkentplast",
    licenses: ["Ishlab chiqarish litsenziyasi №1102"],
    photoCaption: "Tashkent Plast MChJ, Toshkent",
    historicalVerified: [
      { month: "Mart", tons: 90 },
      { month: "Aprel", tons: 102 },
      { month: "May", tons: 96 },
      { month: "Iyun", tons: 110 },
      { month: "Iyul", tons: 118 },
    ],
    avgResponseHours: 4,
  },
  {
    id: "aral-suv",
    name: "Aral Suv Kompaniyasi",
    city: "Nukus",
    distanceKm: 690,
    verified: false,
    materials: ["PET", "HDPE"],
    quantityT: 74,
    updatedDaysAgo: 6,
    phone: "+998 90 222 33 44",
    telegram: "@aralsuv",
    licenses: ["Ishlab chiqarish litsenziyasi №1187"],
    photoCaption: "Aral Suv Kompaniyasi, Nukus",
    historicalVerified: [
      { month: "Mart", tons: 40 },
      { month: "Aprel", tons: 45 },
      { month: "May", tons: 48 },
      { month: "Iyun", tons: 52 },
      { month: "Iyul", tons: 55 },
    ],
    avgResponseHours: 9,
  },
  {
    id: "andijon-oziq",
    name: "Andijon Oziq-ovqat",
    city: "Andijon",
    distanceKm: 440,
    verified: true,
    materials: ["PP", "HDPE"],
    quantityT: 51,
    updatedDaysAgo: 40,
    phone: "+998 90 333 44 55",
    telegram: "@andijonoziq",
    licenses: ["Ishlab chiqarish litsenziyasi №1244"],
    photoCaption: "Andijon Oziq-ovqat, Andijon",
    historicalVerified: [
      { month: "Mart", tons: 30 },
      { month: "Aprel", tons: 33 },
      { month: "May", tons: 29 },
      { month: "Iyun", tons: 31 },
      { month: "Iyul", tons: 28 },
    ],
    avgResponseHours: 11,
  },
  {
    id: "samarqand-ichimlik",
    name: "Samarqand Ichimliklari",
    city: "Samarqand",
    distanceKm: 260,
    verified: false,
    materials: ["PET"],
    quantityT: 33,
    updatedDaysAgo: 5,
    phone: "+998 90 444 55 66",
    telegram: "@samarqandichimlik",
    licenses: ["Ishlab chiqarish litsenziyasi №1305"],
    photoCaption: "Samarqand Ichimliklari, Samarqand",
    historicalVerified: [
      { month: "Mart", tons: 18 },
      { month: "Aprel", tons: 21 },
      { month: "May", tons: 24 },
      { month: "Iyun", tons: 19 },
      { month: "Iyul", tons: 22 },
    ],
    avgResponseHours: 7,
  },
];

export function getDirectoryEntries(role: "producer" | "recycler"): DirectoryEntry[] {
  return role === "recycler" ? PRODUCER_SEEKERS : RECYCLERS;
}

export function getDirectoryEntryById(
  role: "producer" | "recycler",
  id: string
): DirectoryEntry | undefined {
  return getDirectoryEntries(role).find((e) => e.id === id);
}

export function isStale(entry: DirectoryEntry): boolean {
  return entry.updatedDaysAgo > STALE_DAYS;
}

export function sortByQuantityDesc(entries: DirectoryEntry[]): DirectoryEntry[] {
  return [...entries].sort((a, b) => {
    const aStale = isStale(a);
    const bStale = isStale(b);
    if (aStale !== bStale) return aStale ? 1 : -1;
    return b.quantityT - a.quantityT;
  });
}
