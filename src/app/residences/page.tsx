"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Building2, Copy, QrCode } from "lucide-react";
import { fetchAppData } from "@/lib/app-data";
import type { Residence } from "@/lib/app-data";

export default function ResidencesPage() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [message, setMessage] = useState("Chargement des résidences…");
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    fetchAppData()
      .then((data) => {
        setResidences(data.residences);
        setMessage(
          data.residences.length
            ? "Résidences importées depuis Excel."
            : "Aucune résidence importée. Veuillez importer le fichier Patrimoine GCP."
        );
      })
      .catch(() => {
        setResidences([]);
        setMessage("Aucune résidence importée. Veuillez importer le fichier Patrimoine GCP.");
      });
  }, []);

  const generateQr = async (id: string) => {
    const dataUrl = await QRCode.toDataURL(`residence:${id}`);
    setQrUrl(dataUrl);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Résidences</p>
        <h2 className="text-2xl font-semibold text-slate-900">Liste des résidences</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </div>

      {residences.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Aucune résidence importée.</p>
          <p className="mt-2 text-sm text-slate-600">Veuillez importer le fichier Patrimoine GCP.</p>
        </div>
      ) : (
      <div className="grid gap-4 lg:grid-cols-2">
        {residences.map((residence) => (
          <div key={residence.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold text-slate-900">{residence.name}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{residence.address}</p>
                <p className="mt-2 text-sm text-slate-600">GCP : {residence.gcp}</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{residence.score}%</div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Dernier contrôle</p>
                <p className="mt-1 font-medium text-slate-800">{residence.lastControl}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Statut</p>
                <p className="mt-1 font-medium text-slate-800">{residence.status}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => generateQr(residence.id)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <QrCode className="h-4 w-4" /> Générer QR
              </button>
              <Link href="/controle" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                <Copy className="h-4 w-4" /> Nouveau contrôle
              </Link>
            </div>

            {qrUrl ? (
              <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                <p className="mb-2 font-medium">QR Code généré</p>
                <img src={qrUrl} alt="QR code résidence" className="h-28 w-28 rounded-xl bg-white p-2" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
