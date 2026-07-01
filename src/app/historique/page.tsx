"use client";

import { History, MailCheck } from "lucide-react";

export default function HistoriquePage() {
  const controls: never[] = [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Historique</p>
        <h2 className="text-2xl font-semibold text-slate-900">Historique des contrôles</h2>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="flex justify-center text-blue-600">
          <History className="h-6 w-6" />
        </div>
        <p className="mt-3 text-lg font-semibold text-slate-900">Aucun historique disponible.</p>
        <p className="mt-2 text-sm text-slate-600">Les contrôles apparaîtront ici après import du fichier Excel Patrimoine GCP.</p>
      </div>
    </div>
  );
}
