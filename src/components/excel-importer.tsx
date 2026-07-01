"use client";

import { useState, type ChangeEvent } from "react";

export interface ImportedData {
  residences: Array<{ id: string; name: string; address: string; gcp: string; lotId: string; lotName: string; score: number; status: string; lastControl: string }>;
  lots: Array<{ id: string; name: string; residences: string[] }>;
  message?: string;
}

interface ExcelImporterProps {
  onImported?: (data: ImportedData) => void;
}

export function ExcelImporter({ onImported }: ExcelImporterProps) {
  const [status, setStatus] = useState("Aucun fichier importé");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(`Import de ${file.name}…`);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setStatus(result.message ?? "Import terminé");
    if (result.success && onImported) {
      onImported({ residences: result.residences ?? [], lots: result.lots ?? [], message: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Importer un fichier Excel</h3>
      <p className="mt-2 text-sm text-slate-600">Sélectionnez un fichier Excel depuis l’application Fichiers de votre iPad pour charger automatiquement les résidences, lots et GCP.</p>
      <label className="mt-4 flex min-h-[52px] cursor-pointer items-center justify-center rounded-2xl border border-blue-300 bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]">
        <input type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
        {loading ? "Import en cours…" : "Importer un fichier Excel"}
      </label>
      <p className="mt-3 text-sm text-slate-500">{status}</p>
    </div>
  );
}
