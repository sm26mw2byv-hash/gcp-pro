"use client";

import { useMemo } from "react";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { residencesData } from "@/lib/residences";

export default function StatistiquesPage() {
  const residences = residencesData;

  const averageScore = useMemo(() => {
    if (!residences.length) return 0;
    const avg = residences.reduce((sum, item) => sum + item.score, 0) / residences.length;
    return Math.round(avg);
  }, [residences]);

  const reprises = 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Statistiques</p>
        <h2 className="text-2xl font-semibold text-slate-900">Analyse des performances</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700"><BarChart3 className="h-5 w-5" /> Score moyen</div>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{averageScore}/20</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700"><TrendingUp className="h-5 w-5" /> Contrôles avec reprises</div>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{reprises}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700"><TrendingDown className="h-5 w-5" /> Résidences actives</div>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{residences.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Évolution</h3>
        <div className="space-y-3">
          {[10, 12, 14, 16, 18].map((value, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Semaine {index + 1}</span>
                <span>{value}/20</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${(value / 20) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
