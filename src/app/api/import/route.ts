import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseExcelFile } from "@/lib/excel-import";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(uploadDir, filename);
  const canonicalPath = path.join(uploadDir, "Patrimoine GCP.xlsx");

  const bytes = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(bytes));
  fs.writeFileSync(canonicalPath, Buffer.from(bytes));

  const parsed = parseExcelFile(bytes);
  const importedDataPath = path.join(uploadDir, "imported-data.json");
  fs.writeFileSync(
    importedDataPath,
    JSON.stringify(
      {
        residences: parsed.residences,
        lots: parsed.lots,
        importedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  return NextResponse.json({
    success: true,
    file: filename,
    residences: parsed.residences,
    lots: parsed.lots,
    message: `Import terminé. ${parsed.residences.length} résidence(s) chargée(s).`,
  });
}
