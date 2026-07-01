"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { AlertTriangle, CheckCircle2, FileText, ImagePlus } from "lucide-react";
import { fetchAppData } from "@/lib/app-data";
import type { Residence } from "@/lib/app-data";
import { inspectionSections, type InspectionStatus } from "@/lib/mock-data";

const statusLabels: Record<InspectionStatus, string> = {
  conforme: "Conforme",
  "non-conforme": "Non conforme",
  "non-concerne": "Non concerné",
};

function getOverallStatus(totalScore: number) {
  if (totalScore >= 18) return { label: "Conforme", tone: "text-emerald-600" };
  if (totalScore >= 15) return { label: "Conforme avec réserves", tone: "text-amber-600" };
  if (totalScore >= 10) return { label: "Reprise demandée", tone: "text-orange-600" };
  return { label: "Non conforme", tone: "text-red-600" };
}

export default function ControlPage() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [selectedResidence, setSelectedResidence] = useState("");
  const [answers, setAnswers] = useState<Record<string, InspectionStatus>>(
    Object.fromEntries(inspectionSections.flatMap((section) => section.criteria.map((criterion) => [criterion.id, "conforme"])))
  );
  const [comments, setComments] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Record<string, string[]>>({});
  const [reprises, setReprises] = useState<string[]>(["Vérifier les joints du hall"]);
  const [repriseInput, setRepriseInput] = useState("");

  useEffect(() => {
    fetchAppData()
      .then((data) => {
        setResidences(data.residences);
        if (data.residences.length) {
          setSelectedResidence((current) => current || data.residences[0].id);
        }
      })
      .catch(() => setResidences([]));
  }, []);

  const sectionResults = useMemo(() => {
    return inspectionSections.map((section) => {
      const score = section.criteria.reduce((sum, criterion) => {
        const status = answers[criterion.id];
        return sum + (status === "non-conforme" ? 0 : 1);
      }, 0);
      return { ...section, score };
    });
  }, [answers]);

  const totalScore = sectionResults.reduce((sum, section) => sum + section.score, 0);
  const overallStatus = getOverallStatus(totalScore);
  const missingPhotos = Object.entries(answers).filter(([id, status]) => status === "non-conforme" && !(photos[id] ?? []).length);

  const handleAnswer = (criterionId: string, value: InspectionStatus) => {
    setAnswers((prev) => ({ ...prev, [criterionId]: value }));
  };

  const handlePhotoUpload = (criterionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => ({ ...prev, [criterionId]: [...(prev[criterionId] ?? []), ...previews] }));
  };

  const addReprise = () => {
    if (!repriseInput.trim()) return;
    setReprises((prev) => [...prev, repriseInput.trim()]);
    setRepriseInput("");
  };

  const sendRelanceEmail = () => {
    const residenceName = residences.find((r) => r.id === selectedResidence)?.name ?? "résidence";
    const recipient = "prestataire@exemple.fr";
    const subject = encodeURIComponent(`Relance pour ${residenceName}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nLe contrôle de ${residenceName} a été refusé avec un score de ${totalScore}/20.\nMerci de traiter les reprises suivantes : ${reprises.join(" ; ")}\n\nCordialement.`
    );
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.alert("Email de relance préparé pour le prestataire.");
  };

  const exportPdf = () => {
    if (missingPhotos.length) {
      window.alert("Une photo est obligatoire pour chaque critère non conforme.");
      return;
    }

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Rapport de contrôle NOV’HABITAT", 20, 20);
    pdf.setFontSize(11);
    pdf.text(`Résidence : ${residences.find((r) => r.id === selectedResidence)?.name ?? ""}`, 20, 35);
    pdf.text(`Score : ${totalScore}/20`, 20, 45);
    pdf.text(`Statut : ${overallStatus.label}`, 20, 55);
    pdf.text(`Commentaires : ${Object.values(comments).join(" | ")}`, 20, 70, { maxWidth: 170 });
    pdf.text(`Reprises : ${reprises.join(" | ")}`, 20, 95, { maxWidth: 170 });
    pdf.save(`controle-${selectedResidence}.pdf`);

    if (overallStatus.label === "Non conforme" || overallStatus.label === "Reprise demandée") {
      sendRelanceEmail();
    }
  };

  if (!residences.length) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Nouveau contrôle</p>
          <h2 className="text-2xl font-semibold text-slate-900">Contrôle qualité NOV’HABITAT</h2>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Aucune résidence importée.</p>
          <p className="mt-2 text-sm text-slate-600">Veuillez importer le fichier Patrimoine GCP pour accéder au contrôle.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Nouveau contrôle</p>
        <h2 className="text-2xl font-semibold text-slate-900">Contrôle qualité NOV’HABITAT</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm text-slate-500">Sélectionner une résidence</label>
            <select value={selectedResidence} onChange={(e) => setSelectedResidence(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800">
              {residences.map((residence) => (
                <option key={residence.id} value={residence.id}>{residence.name}</option>
              ))}
            </select>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Score total</p>
                  <p className="mt-1 text-4xl font-semibold text-slate-900">{totalScore}/20</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-sm font-semibold ${overallStatus.tone} bg-white`}>
                  {overallStatus.label}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sectionResults.map((section) => (
                <div key={section.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">{section.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{section.score}/10</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <FileText className="h-5 w-5" />
              <h3 className="font-semibold text-slate-900">Reprises à traiter</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {reprises.map((item, idx) => (
                <span key={idx} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{item}</span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input value={repriseInput} onChange={(e) => setRepriseInput(e.target.value)} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800" placeholder="Ajouter une reprise" />
              <button onClick={addReprise} className="rounded-2xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Ajouter</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sectionResults.map((section) => (
            <div key={section.key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-600">{section.title}</p>
                  <h3 className="text-lg font-semibold text-slate-900">Évaluation sur {section.maxPoints} points</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{section.score}/10</div>
              </div>

              <div className="space-y-3">
                {section.criteria.map((criterion) => {
                  const status = answers[criterion.id];
                  const criterionComments = comments[criterion.id] ?? "";
                  const criterionPhotos = photos[criterion.id] ?? [];
                  const requiresPhoto = status === "non-conforme";

                  return (
                    <div key={criterion.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{criterion.label}</p>
                          <p className="mt-1 text-sm text-slate-500">{requiresPhoto ? "Photo obligatoire si non conforme" : "Évaluation standard"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(["conforme", "non-conforme", "non-concerne"] as InspectionStatus[]).map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(criterion.id, value)}
                              className={`rounded-full px-3 py-2 text-sm font-medium ${status === value ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
                            >
                              {statusLabels[value]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={criterionComments}
                        onChange={(e) => setComments((prev) => ({ ...prev, [criterion.id]: e.target.value }))}
                        className="mt-3 min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        placeholder="Commentaire"
                      />

                      {requiresPhoto ? (
                        <div className="mt-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-3">
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <ImagePlus className="h-4 w-4" />
                            Joindre une photo obligatoire
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(criterion.id, e)} className="mt-2 block w-full text-sm text-slate-600" />
                          <div className="mt-3 flex flex-wrap gap-2">
                            {criterionPhotos.length > 0 ? criterionPhotos.map((photo, idx) => (
                              <img key={idx} src={photo} alt={`Photo ${criterion.label}`} className="h-16 w-16 rounded-xl object-cover" />
                            )) : <p className="text-sm text-slate-500">Aucune photo ajoutée</p>}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-semibold text-slate-900">Validation</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {missingPhotos.length
                ? "Une photo est obligatoire pour chaque critère non conforme."
                : "La fiche est prête à être exportée."}
            </p>
            <button onClick={exportPdf} className="mt-4 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white">Exporter le rapport PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
