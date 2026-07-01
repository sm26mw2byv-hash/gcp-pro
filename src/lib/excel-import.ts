import * as XLSX from "xlsx";

export interface ExcelRow {
  Nom?: string;
  Adresse?: string;
  GCP?: string;
  Lot?: string;
  [key: string]: unknown;
}

export function parseExcelFile(buffer: ArrayBuffer): { residences: Array<{ id: string; name: string; address: string; gcp: string; lotId: string; lotName: string; score: number; status: string; lastControl: string }>; lots: Array<{ id: string; name: string; residences: string[] }> } {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "" });

  const residences = rows
    .filter((row) => row.Nom || row.GCP || row.Adresse)
    .map((row, index) => ({
      id: `R-${String(index + 1).padStart(3, "0")}`,
      name: String(row.Nom ?? `Résidence ${index + 1}`),
      address: String(row.Adresse ?? "Adresse à compléter"),
      gcp: String(row.GCP ?? "À compléter"),
      lotId: `LOT-${String(row.Lot ?? "Lot principal").replace(/[^a-zA-Z0-9]/g, "")}`,
      lotName: String(row.Lot ?? "Lot principal"),
      score: 0,
      status: "À contrôler",
      lastControl: "Aucun contrôle",
    }));

  const lots = Array.from(new Map(residences.map((residence) => [residence.lotName, { id: `LOT-${residence.lotName}`.replace(/[^a-zA-Z0-9]/g, ""), name: residence.lotName, residences: [] as string[] }])).values())
    .map((lot) => ({ ...lot, residences: residences.filter((residence) => residence.lotName === lot.name).map((residence) => residence.id) }));

  return { residences, lots };
}
