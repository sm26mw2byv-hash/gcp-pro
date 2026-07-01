"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ClipboardCheck, FileText, Sparkles, TrendingUp } from "lucide-react";
import { fetchAppData } from "@/lib/app-data";
import type { Residence } from "@/lib/app-data";
import { ExcelImporter } from "@/components/excel-importer";

export default function DashboardPage() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [sourceMessage, setSourceMessage] = useState("Chargement des données métier…");

  const handleImportedData = (data: { residences: Residence[]; message?: string }) => {
    setResidences(data.residences);
    setSourceMessage(data.message ?? "Données métier importées avec succès.");
  };

  useEffect(() => {
    fetchAppData()
      .then((data) => {
        setResidences(data.residences);
        setSourceMessage(data.message);
      })
      .catch(() => setSourceMessage("Les données ne sont pas encore disponibles."));
  }, []);

  const scoreAverage = useMemo(() => {
    if (!residences.length) return 0;
    const avg = residences.reduce((sum, item) => sum + item.score, 0) / residences.length;
    return Math.round(avg);
  }, [residences]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-700 via-blue-600 to-slate-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
              <Sparkles className="h-4 w-4" /> Tableau de bord qualité
            </p>
            <h2 className="text-3xl font-semibold text-white">Pilotage simple et fiable des prestations de ménage.</h2>
            <p className="mt-3 text-blue-50/90">
              Le tableau de bord se nourrit maintenant des données métier issues du fichier Excel dès qu’il est présent. Les résidences, lots et GCP sont chargés automatiquement.
            </p>
          </div>
          <Link href="/controle" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-slate-100">
            Nouveau contrôle <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <ExcelImporter onImported={handleImportedData} />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Score moyen</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-semibold text-white">{scoreAverage}%</span>
            <span className="mb-1 text-emerald-400">+4%</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Résidences suivies</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-semibold text-white">{residences.length}</span>
            <span className="mb-1 text-sky-400">actives</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Contrôles réalisés</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-semibold text-white">7</span>
            <span className="mb-1 text-amber-400">cette semaine</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Dernières résidences</h3>
              <Link href="/residences" className="text-sm font-medium text-blue-600">Voir tout</Link>
            </div>
            <div className="space-y-3">
              {residences.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  Aucune résidence importée. Veuillez importer le fichier Patrimoine GCP.
                </div>
              ) : (
                residences.map((residence) => (
                  <div key={residence.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="font-medium text-slate-900">{residence.name}</p>
                      <p className="text-sm text-slate-500">{residence.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">{residence.score}%</p>
                      <p className="text-sm text-slate-500">{residence.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Tendance</p>
                <h3 className="font-semibold text-slate-900">Amélioration continue</h3>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">Le taux de conformité progresse de 6 points depuis le dernier mois.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Points clés</p>
                <h3 className="font-semibold text-slate-900">Répartition des actions</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span><Building2 className="mr-2 inline h-4 w-4" />Résidences</span><span>12</span></div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span><ClipboardCheck className="mr-2 inline h-4 w-4" />Contrôles</span><span>7</span></div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span><FileText className="mr-2 inline h-4 w-4" />Rapports</span><span>4</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
