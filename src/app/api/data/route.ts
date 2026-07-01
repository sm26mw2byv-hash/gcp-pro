import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const excelFileName = "Patrimoine GCP.xlsx";
const storageDirectory = path.join(process.cwd(), "public", "uploads");
const excelPath = path.join(storageDirectory, excelFileName);
const importedDataPath = path.join(storageDirectory, "imported-data.json");

function readExcelFallback() {
  return {
    residences: [],
    lots: [],
    source: "Aucun fichier Excel détecté",
    importedAt: null,
    message: "Ajoutez le fichier Excel Patrimoine GCP.xlsx dans public/uploads pour charger les données réelles.",
  };
}

function readImportedData() {
  if (!fs.existsSync(importedDataPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(importedDataPath, "utf8"));
  } catch {
    return null;
  }
}

export async function GET() {
  const importedData = readImportedData();
  if (importedData) {
    return NextResponse.json({
      residences: importedData.residences ?? [],
      lots: importedData.lots ?? [],
      source: path.basename(importedDataPath),
      importedAt: importedData.importedAt ?? null,
      message: "Données métier importées et disponibles dans l’application.",
    });
  }

  if (!fs.existsSync(excelPath)) {
    return NextResponse.json(readExcelFallback());
  }

  const fileStats = fs.statSync(excelPath);
  const fileName = path.basename(excelPath);

  return NextResponse.json({
    residences: [],
    lots: [],
    source: fileName,
    importedAt: new Date(fileStats.mtime).toISOString(),
    message: "Fichier Excel détecté. Importez-le à nouveau pour charger les données métier.",
  });
}
