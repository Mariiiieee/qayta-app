"use client";

import { useMemo, useRef, useState } from "react";

type Material = "PET" | "HDPE" | "PP" | "LDPE" | "PS" | "Boshqa";

const MATERIALS: Material[] = ["PET", "HDPE", "PP", "LDPE", "PS", "Boshqa"];

type Product = {
  id: string;
  name: string;
  material: Material;
  unitWeightG: number;
  releasedUnits: number;
};

type Draft = {
  name: string;
  material: Material;
  unitWeightG: string;
  releasedUnits: string;
};

type SortKey = "name" | "material" | "unitWeightG" | "releasedUnits" | "totalKg";
type SortDir = "asc" | "desc";

const SEED: Product[] = [
  { id: "p-1", name: "Coca-Cola 0.5L", material: "PET", unitWeightG: 22, releasedUnits: 184000 },
  { id: "p-2", name: "Nestle suv 1.5L", material: "PET", unitWeightG: 34, releasedUnits: 96500 },
  { id: "p-3", name: "Yog' 1L", material: "HDPE", unitWeightG: 45, releasedUnits: 41200 },
  { id: "p-4", name: "Yuvish vositasi 900ml", material: "HDPE", unitWeightG: 52, releasedUnits: 18700 },
  { id: "p-5", name: "Kefir 0.5L", material: "PP", unitWeightG: 12, releasedUnits: 63400 },
  { id: "p-6", name: "Non paketi", material: "LDPE", unitWeightG: 4, releasedUnits: 210000 },
  { id: "p-7", name: "Shokolad o'rami", material: "PS", unitWeightG: 3, releasedUnits: 52000 },
];

const PAGE_SIZE = 50;

function totalKg(p: Product) {
  return (p.unitWeightG * p.releasedUnits) / 1000;
}

function formatInt(n: number) {
  return n.toLocaleString("en-US");
}

function formatKg(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 3.5 L16.5 7.5 L7 17 H3 V13 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 6 H16 M8 6 V4 H12 V6 M6 6 L6.8 16 H13.2 L14 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon({ dir }: { dir: SortDir | null }) {
  return (
    <span className="ml-1 inline-flex flex-col leading-none text-[9px]">
      <span className={dir === "asc" ? "text-ink-900" : "text-rule-soft"}>▲</span>
      <span className={dir === "desc" ? "text-ink-900" : "text-rule-soft"}>▼</span>
    </span>
  );
}

function draftFromProduct(p?: Product): Draft {
  if (!p) return { name: "", material: "PET", unitWeightG: "", releasedUnits: "" };
  return {
    name: p.name,
    material: p.material,
    unitWeightG: String(p.unitWeightG),
    releasedUnits: String(p.releasedUnits),
  };
}

function isValidDraft(d: Draft) {
  const w = Number(d.unitWeightG);
  const r = Number(d.releasedUnits);
  return d.name.trim().length > 0 && w > 0 && r >= 0 && !Number.isNaN(w) && !Number.isNaN(r);
}

type ParsedRow = Record<string, string>;

const TARGET_FIELDS = [
  { key: "name", label: "Mahsulot nomi" },
  { key: "material", label: "Material" },
  { key: "unitWeightG", label: "Bir birlik og'irligi (g)" },
  { key: "releasedUnits", label: "Bozorga chiqarildi (dona)" },
  { key: "ignore", label: "E'tiborga olinmasin" },
] as const;

type TargetField = (typeof TARGET_FIELDS)[number]["key"];

function guessMapping(header: string): TargetField {
  const h = header.trim().toLowerCase();
  if (h.includes("nom") || h.includes("name")) return "name";
  if (h.includes("material")) return "material";
  if (h.includes("og'irl") || h.includes("ogirl") || h.includes("weight")) return "unitWeightG";
  if (h.includes("chiqar") || h.includes("dona") || h.includes("unit") || h.includes("count")) return "releasedUnits";
  return "ignore";
}

function parseCsv(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row: ParsedRow = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
  return { headers, rows };
}

function normalizeMaterial(raw: string): Material {
  const m = raw.trim().toUpperCase();
  return (MATERIALS as string[]).includes(m) ? (m as Material) : "Boshqa";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(SEED);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(draftFromProduct());
  const [isNewRow, setIsNewRow] = useState(false);

  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<{ headers: string[]; rows: ParsedRow[] } | null>(null);
  const [mapping, setMapping] = useState<Record<string, TargetField>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(products.length + 1);

  const hasProducts = products.length > 0;

  const sorted = useMemo(() => {
    const arr = [...products];
    arr.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sort.key === "totalKg") {
        av = totalKg(a);
        bv = totalKg(b);
      } else {
        av = a[sort.key];
        bv = b[sort.key];
      }
      if (typeof av === "string" || typeof bv === "string") {
        const cmp = String(av).localeCompare(String(bv));
        return sort.dir === "asc" ? cmp : -cmp;
      }
      const cmp = (av as number) - (bv as number);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [products, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setSort((s) => {
      if (s.key !== key) return { key, dir: "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft(draftFromProduct(p));
    setIsNewRow(false);
  }

  function startAdd() {
    const id = `p-new-${idCounter.current++}`;
    const blank: Product = { id, name: "", material: "PET", unitWeightG: 0, releasedUnits: 0 };
    setProducts((prev) => [blank, ...prev]);
    setEditingId(id);
    setDraft(draftFromProduct());
    setIsNewRow(true);
    setPage(1);
  }

  function cancelEdit() {
    if (isNewRow && editingId) {
      setProducts((prev) => prev.filter((p) => p.id !== editingId));
    }
    setEditingId(null);
    setIsNewRow(false);
  }

  function saveEdit() {
    if (!editingId || !isValidDraft(draft)) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: draft.name.trim(),
              material: draft.material,
              unitWeightG: Number(draft.unitWeightG),
              releasedUnits: Number(draft.releasedUnits),
            }
          : p
      )
    );
    setEditingId(null);
    setIsNewRow(false);
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setIsNewRow(false);
    }
  }

  function openUpload() {
    setUploadOpen(true);
    setFileName(null);
    setParsed(null);
    setMapping({});
    setUploadError(null);
  }

  function closeUpload() {
    setUploadOpen(false);
  }

  function handleFile(file: File) {
    setUploadError(null);
    setFileName(file.name);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setParsed(null);
      setUploadError("Xatolik: faylni o'qib bo'lmadi. Hozircha faqat CSV formatni yuklang.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const result = parseCsv(text);
      if (result.rows.length === 0) {
        setUploadError("Faylda ma'lumot topilmadi.");
        setParsed(null);
        return;
      }
      setParsed(result);
      const guessed: Record<string, TargetField> = {};
      result.headers.forEach((h) => {
        guessed[h] = guessMapping(h);
      });
      setMapping(guessed);
    };
    reader.readAsText(file);
  }

  function importParsed() {
    if (!parsed) return;
    const mappedName = Object.entries(mapping).find(([, v]) => v === "name")?.[0];
    const mappedMaterial = Object.entries(mapping).find(([, v]) => v === "material")?.[0];
    const mappedWeight = Object.entries(mapping).find(([, v]) => v === "unitWeightG")?.[0];
    const mappedUnits = Object.entries(mapping).find(([, v]) => v === "releasedUnits")?.[0];

    if (!mappedName || !mappedWeight || !mappedUnits) {
      setUploadError("Kamida nomi, og'irligi va bozorga chiqarilgan soni ustunlarini belgilang.");
      return;
    }

    let errorRows = 0;
    const imported: Product[] = [];
    parsed.rows.forEach((row, i) => {
      const name = row[mappedName]?.trim() ?? "";
      const weight = Number(row[mappedWeight]);
      const units = Number(row[mappedUnits]);
      const material = mappedMaterial ? normalizeMaterial(row[mappedMaterial] ?? "") : "Boshqa";
      if (!name || !(weight > 0) || Number.isNaN(units) || units < 0) {
        errorRows += 1;
        return;
      }
      imported.push({
        id: `p-imp-${idCounter.current++}-${i}`,
        name,
        material,
        unitWeightG: weight,
        releasedUnits: units,
      });
    });

    if (imported.length > 0) {
      setProducts((prev) => [...imported, ...prev]);
    }

    if (errorRows > 0) {
      setUploadError(`${errorRows} ta qatorda xato bor. Ko'rib chiqing.`);
      if (imported.length === 0) return;
    }

    setUploadOpen(false);
  }

  const previewRows = parsed ? parsed.rows.slice(0, 5) : [];

  return (
    <>
      <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-headline text-ink-900">Mahsulotlar</h1>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openUpload}
                  className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Excel yuklash
                </button>
                <button
                  type="button"
                  onClick={startAdd}
                  className="flex h-12 items-center justify-center rounded-md bg-amber px-4 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Qo'shish
                </button>
              </div>
            </div>

            {!hasProducts ? (
              <div className="flex flex-col items-start gap-4 rounded-md border border-rule-soft bg-card p-6">
                <p className="text-body text-ink-600">
                  Hali mahsulotlar yo'q.
                  <br />
                  Excel faylni yuklang yoki qo'lda qo'shing.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={openUpload}
                    className="flex h-14 min-w-[200px] items-center justify-center rounded-md bg-amber px-6 text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Excel yuklash
                  </button>
                  <button
                    type="button"
                    onClick={startAdd}
                    className="flex h-14 items-center justify-center rounded-md border border-rule bg-card px-6 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Qo'lda qo'shish
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-md border border-rule-soft bg-card">
                  <table className="w-full min-w-[860px] border-collapse">
                    <thead className="sticky top-0 z-10 bg-card">
                      <tr className="border-b border-rule-soft text-left text-micro uppercase tracking-wide text-ink-600">
                        <th className="px-4 py-3">
                          <button type="button" onClick={() => toggleSort("name")} className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text">
                            Mahsulot nomi
                            <SortIcon dir={sort.key === "name" ? sort.dir : null} />
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button type="button" onClick={() => toggleSort("material")} className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text">
                            Material
                            <SortIcon dir={sort.key === "material" ? sort.dir : null} />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <button type="button" onClick={() => toggleSort("unitWeightG")} className="ml-auto flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text">
                            Bir birlik og'irligi
                            <SortIcon dir={sort.key === "unitWeightG" ? sort.dir : null} />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <button type="button" onClick={() => toggleSort("releasedUnits")} className="ml-auto flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text">
                            Bozorga chiqarildi
                            <SortIcon dir={sort.key === "releasedUnits" ? sort.dir : null} />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <button type="button" onClick={() => toggleSort("totalKg")} className="ml-auto flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text">
                            Jami kg
                            <SortIcon dir={sort.key === "totalKg" ? sort.dir : null} />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((p) => {
                        const editing = editingId === p.id;
                        if (editing) {
                          return (
                            <tr key={p.id} className="h-12 border-b border-rule-soft last:border-b-0">
                              <td className="px-4 py-2">
                                <input
                                  autoFocus
                                  value={draft.name}
                                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                    if (e.key === "Escape") cancelEdit();
                                  }}
                                  className="h-9 w-full rounded-md border border-rule bg-card px-2 text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <select
                                  value={draft.material}
                                  onChange={(e) => setDraft((d) => ({ ...d, material: e.target.value as Material }))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                    if (e.key === "Escape") cancelEdit();
                                  }}
                                  className="h-9 w-full rounded-md border border-rule bg-card px-2 text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                >
                                  {MATERIALS.map((m) => (
                                    <option key={m} value={m}>
                                      {m}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  inputMode="decimal"
                                  value={draft.unitWeightG}
                                  onChange={(e) => setDraft((d) => ({ ...d, unitWeightG: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                    if (e.key === "Escape") cancelEdit();
                                  }}
                                  className="h-9 w-full rounded-md border border-rule bg-card px-2 text-right font-mono text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  inputMode="numeric"
                                  value={draft.releasedUnits}
                                  onChange={(e) => setDraft((d) => ({ ...d, releasedUnits: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                    if (e.key === "Escape") cancelEdit();
                                  }}
                                  className="h-9 w-full rounded-md border border-rule bg-card px-2 text-right font-mono text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                />
                              </td>
                              <td className="px-4 py-2 text-right font-mono text-body text-ink-500">
                                {isValidDraft(draft)
                                  ? formatKg((Number(draft.unitWeightG) * Number(draft.releasedUnits)) / 1000)
                                  : "—"}
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={saveEdit}
                                    disabled={!isValidDraft(draft)}
                                    className="flex h-10 items-center justify-center rounded-md bg-amber px-3 text-micro font-semibold text-ink-900 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                  >
                                    Saqlash
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex h-10 items-center justify-center rounded-md border border-rule bg-card px-3 text-micro font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                  >
                                    Bekor
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return (
                          <tr
                            key={p.id}
                            onClick={() => startEdit(p)}
                            className="h-12 cursor-pointer border-b border-rule-soft text-body text-ink-900 last:border-b-0 hover:bg-rule-soft/40"
                          >
                            <td className="px-4 py-2">{p.name}</td>
                            <td className="px-4 py-2 text-ink-600">{p.material}</td>
                            <td className="px-4 py-2 text-right font-mono">{formatInt(p.unitWeightG)} g</td>
                            <td className="px-4 py-2 text-right font-mono">{formatInt(p.releasedUnits)}</td>
                            <td className="px-4 py-2 text-right font-mono font-medium">{formatKg(totalKg(p))}</td>
                            <td className="px-4 py-2">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(p);
                                  }}
                                  aria-label="Tahrirlash"
                                  className="flex h-12 w-12 items-center justify-center rounded-md text-ink-600 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProduct(p.id);
                                  }}
                                  aria-label="O'chirish"
                                  className="flex h-12 w-12 items-center justify-center rounded-md text-short hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex h-11 items-center justify-center rounded-md border border-rule bg-card px-4 text-body text-ink-900 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      Oldingi
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        aria-current={page === n ? "page" : undefined}
                        className={`flex h-11 w-11 items-center justify-center rounded-md text-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text ${
                          page === n ? "bg-amber font-semibold text-ink-900" : "text-ink-600 hover:bg-card"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="flex h-11 items-center justify-center rounded-md border border-rule bg-card px-4 text-body text-ink-900 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                    >
                      Keyingi
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
      </main>

      {uploadOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
          onClick={closeUpload}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[560px] flex-col gap-4 rounded-md bg-card p-6 shadow-lg"
          >
            <h2 id="upload-modal-title" className="text-title-s text-ink-900">
              Excel yoki CSV yuklash
            </h2>

            {!parsed ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                className={`flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 text-center ${
                  dragging ? "border-amber-text bg-paper" : "border-rule-soft"
                }`}
              >
                <p className="text-body text-ink-600">Excel yoki CSV faylni shu yerga tashlang</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                >
                  Faylni tanlash
                </button>
                {fileName && !uploadError && <p className="text-micro text-ink-500">{fileName}</p>}
                {uploadError && <p className="text-body text-short">{uploadError}</p>}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-micro uppercase tracking-wide text-ink-600">Ustunlarni moslashtirish</span>
                  <div className="flex flex-col gap-2">
                    {parsed.headers.map((h) => (
                      <div key={h} className="flex items-center justify-between gap-3">
                        <span className="text-body text-ink-900">{h}</span>
                        <select
                          value={mapping[h] ?? "ignore"}
                          onChange={(e) =>
                            setMapping((m) => ({ ...m, [h]: e.target.value as TargetField }))
                          }
                          className="h-10 rounded-md border border-rule bg-card px-2 text-body text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                        >
                          {TARGET_FIELDS.map((f) => (
                            <option key={f.key} value={f.key}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-md border border-rule-soft">
                  <table className="w-full min-w-[420px] border-collapse text-body">
                    <thead>
                      <tr className="border-b border-rule-soft text-left text-micro uppercase text-ink-600">
                        {parsed.headers.map((h) => (
                          <th key={h} className="px-3 py-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i} className="border-b border-rule-soft last:border-b-0">
                          {parsed.headers.map((h) => (
                            <td key={h} className="px-3 py-2 text-ink-900">
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadError && <p className="text-body text-short">{uploadError}</p>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={importParsed}
                    className="flex h-12 flex-1 items-center justify-center rounded-md bg-amber text-body font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Import qilish
                  </button>
                  <button
                    type="button"
                    onClick={closeUpload}
                    className="flex h-12 items-center justify-center rounded-md border border-rule bg-card px-4 text-body font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
                  >
                    Bekor
                  </button>
                </div>
              </>
            )}

            {!parsed && (
              <button
                type="button"
                onClick={closeUpload}
                className="self-start text-body text-ink-600 underline decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
              >
                Yopish
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
