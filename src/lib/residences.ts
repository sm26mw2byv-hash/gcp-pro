export interface ResidenceRecord {
  id: string;
  name: string;
  address: string;
  gcp: string;
  lotName: string;
  lotId: string;
  prestataire: string;
  score: number;
  status: string;
  lastControl: string;
}

export interface LotRecord {
  id: string;
  name: string;
  residences: string[];
}

export const residenceLots: LotRecord[] = [
  { id: "LOT-A", name: "Lot A", residences: ["R-001", "R-002"] },
  { id: "LOT-B", name: "Lot B", residences: ["R-003", "R-004"] },
  { id: "LOT-C", name: "Lot C", residences: ["R-005"] },
];

export const residencesData: ResidenceRecord[] = [
  {
    id: "R-001",
    name: "Résidence Les Jardins d’Or",
    address: "12 rue des Lilas, Lyon",
    gcp: "GCP-001",
    lotName: "Lot A",
    lotId: "LOT-A",
    prestataire: "Nov’Habitat Maintenance",
    score: 92,
    status: "Conforme",
    lastControl: "01/07/2026",
  },
  {
    id: "R-002",
    name: "Résidence Le Clos des Peupliers",
    address: "8 avenue de la Paix, Grenoble",
    gcp: "GCP-002",
    lotName: "Lot A",
    lotId: "LOT-A",
    prestataire: "Nov’Habitat Maintenance",
    score: 84,
    status: "À reprendre",
    lastControl: "24/06/2026",
  },
  {
    id: "R-003",
    name: "Résidence Les Cèdres",
    address: "44 chemin des Vignes, Annecy",
    gcp: "GCP-003",
    lotName: "Lot B",
    lotId: "LOT-B",
    prestataire: "Propreté & Services",
    score: 89,
    status: "Conforme",
    lastControl: "28/06/2026",
  },
  {
    id: "R-004",
    name: "Résidence La Prairie",
    address: "2 place du Marché, Chambéry",
    gcp: "GCP-004",
    lotName: "Lot B",
    lotId: "LOT-B",
    prestataire: "Propreté & Services",
    score: 76,
    status: "À contrôler",
    lastControl: "30/06/2026",
  },
  {
    id: "R-005",
    name: "Résidence Saint-Exupéry",
    address: "19 boulevard de l’Europe, Valence",
    gcp: "GCP-005",
    lotName: "Lot C",
    lotId: "LOT-C",
    prestataire: "Qualiservice",
    score: 95,
    status: "Conforme",
    lastControl: "29/06/2026",
  },
];

export const residencesByLot = new Map(residenceLots.map((lot) => [lot.id, lot]));
