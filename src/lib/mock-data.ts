export type InspectionStatus = "conforme" | "non-conforme" | "non-concerne";

export interface InspectionCriterion {
  id: string;
  label: string;
  section: "preau" | "etages";
}

export interface InspectionSection {
  key: "preau" | "etages";
  title: string;
  maxPoints: number;
  criteria: InspectionCriterion[];
}

export interface Residence {
  id: string;
  name: string;
  address: string;
  manager: string;
  score: number;
  status: "Correct" | "À reprendre" | "À contrôler";
  lastControl: string;
}

export interface ControlEntry {
  id: string;
  residenceId: string;
  residenceName: string;
  date: string;
  score: number;
  status: "Conforme" | "Conforme avec réserves" | "Reprise demandée" | "Non conforme";
  reviewer: string;
  summary: string;
  reprises: string[];
  comments: string;
  photos: string[];
  answers: Record<string, InspectionStatus>;
}

export const inspectionSections: InspectionSection[] = [
  {
    key: "preau",
    title: "Préau / Hall",
    maxPoints: 10,
    criteria: [
      { id: "preau-sol", label: "Sol", section: "preau" },
      { id: "preau-murs", label: "Murs", section: "preau" },
      { id: "preau-vitres", label: "Vitres", section: "preau" },
      { id: "preau-menuiseries", label: "Menuiseries", section: "preau" },
      { id: "preau-equipements", label: "Équipements", section: "preau" },
      { id: "preau-boites", label: "Boîtes aux lettres", section: "preau" },
      { id: "preau-affichage", label: "Affichage", section: "preau" },
      { id: "preau-plinthes", label: "Plinthes", section: "preau" },
      { id: "preau-araignees", label: "Toiles d’araignées", section: "preau" },
      { id: "preau-proprete", label: "Propreté générale", section: "preau" },
    ],
  },
  {
    key: "etages",
    title: "Étages",
    maxPoints: 10,
    criteria: [
      { id: "etages-sols", label: "Sols", section: "etages" },
      { id: "etages-escaliers", label: "Escaliers", section: "etages" },
      { id: "etages-rampes", label: "Rampes", section: "etages" },
      { id: "etages-murs", label: "Murs", section: "etages" },
      { id: "etages-vitres", label: "Vitres", section: "etages" },
      { id: "etages-menuiseries", label: "Menuiseries", section: "etages" },
      { id: "etages-equipements", label: "Équipements", section: "etages" },
      { id: "etages-plinthes", label: "Plinthes", section: "etages" },
      { id: "etages-araignees", label: "Toiles d’araignées", section: "etages" },
      { id: "etages-proprete", label: "Propreté générale", section: "etages" },
    ],
  },
];

export const initialResidences: Residence[] = [
  {
    id: "R-101",
    name: "Résidence Les Marronniers",
    address: "12 rue des Lilas, Lyon",
    manager: "M. Durand",
    score: 88,
    status: "Correct",
    lastControl: "18/06/2026",
  },
  {
    id: "R-102",
    name: "Résidence Le Panorama",
    address: "8 avenue de Savoie, Grenoble",
    manager: "Mme Martin",
    score: 64,
    status: "À reprendre",
    lastControl: "10/06/2026",
  },
  {
    id: "R-103",
    name: "Résidence Val d'Or",
    address: "44 chemin des Vignes, Annecy",
    manager: "M. Leroux",
    score: 91,
    status: "Correct",
    lastControl: "25/06/2026",
  },
];

export const initialControls: ControlEntry[] = [
  {
    id: "CTRL-001",
    residenceId: "R-101",
    residenceName: "Résidence Les Marronniers",
    date: "18/06/2026",
    score: 18,
    status: "Conforme",
    reviewer: "A. Petit",
    summary: "Contrôle satisfaisant avec quelques réserves mineures.",
    reprises: ["Vérifier les angles du hall"],
    comments: "Le prestataire a répondu rapidement à la demande de correction.",
    photos: ["/placeholder.png"],
    answers: {
      "preau-sol": "conforme",
      "preau-murs": "conforme",
      "preau-vitres": "conforme",
      "preau-menuiseries": "conforme",
      "preau-equipements": "conforme",
      "preau-boites": "conforme",
      "preau-affichage": "conforme",
      "preau-plinthes": "conforme",
      "preau-araignees": "non-concerne",
      "preau-proprete": "conforme",
      "etages-sols": "conforme",
      "etages-escaliers": "conforme",
      "etages-rampes": "non-concerne",
      "etages-murs": "conforme",
      "etages-vitres": "conforme",
      "etages-menuiseries": "conforme",
      "etages-equipements": "conforme",
      "etages-plinthes": "conforme",
      "etages-araignees": "conforme",
      "etages-proprete": "conforme",
    },
  },
];
