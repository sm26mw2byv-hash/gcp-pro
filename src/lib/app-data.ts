export interface Lot {
  id: string;
  name: string;
  residences: string[];
}

export interface Residence {
  id: string;
  name: string;
  address: string;
  gcp: string;
  lotId: string;
  lotName: string;
  score: number;
  status: string;
  lastControl: string;
}

export interface AppDataResponse {
  residences: Residence[];
  lots: Lot[];
  source: string;
  importedAt: string | null;
  message: string;
}

export async function fetchAppData(): Promise<AppDataResponse> {
  const response = await fetch("/api/data", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Impossible de charger les données applicatives");
  }
  return response.json();
}
