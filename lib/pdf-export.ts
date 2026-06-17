"use client";

import jsPDF from "jspdf";
import QRCode from "qrcode";
import { BRAND } from "./config";
import { sha256CanonicalBrowser } from "./hash-browser";


export type PdfHeaderData = {
  folio: string;
  generatedAt: string; // ISO string
  sha256: string;
};

export type ExportPdfOptions = {
  filename: string;
  pageFormat?: "a4" | "letter";
};

type SimRow = { years: number; cuota: number; total: number };

function addHeaderToPdf(doc: jsPDF, header: PdfHeaderData) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const headerTop = 10;

  // Encabezado (usamos fuentes estándar)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Impulso Go", marginX, headerTop + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Folio: ${header.folio}`, pageWidth - marginX - 70, headerTop + 6);
  doc.text(`Generado: ${header.generatedAt}`, pageWidth - marginX - 70, headerTop + 13);
  doc.text(`SHA-256: ${header.sha256}`, pageWidth - marginX - 120, headerTop + 20);
}

async function addQrToPdf(
  doc: jsPDF,
  qrPayload: string,
  x: number,
  y: number,
  sizeMm: number,
) {
  const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 0, width: 220 });
  doc.addImage(qrDataUrl, "PNG", x, y, sizeMm, sizeMm, undefined, "FAST");
}

function drawTableSimple(
  doc: jsPDF,
  startY: number,
  head: [string, string, string],
  body: string[][],
) {
  const left = 14;
  const colWidths = [25, 55, 55]; // mm
  const rowHeight = 8;
  const headerFill = [6, 36, 92] as unknown as number[];
  const gridColor = [217, 231, 247] as unknown as number[];

  // Head
  doc.setFillColor(headerFill[0], headerFill[1], headerFill[2]);
  doc.setDrawColor(gridColor[0], gridColor[1], gridColor[2]);
  doc.rect(left, startY, colWidths[0] + colWidths[1] + colWidths[2], rowHeight, "FD");

  let x = left;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(head[0], x + 2, startY + 6);
  x += colWidths[0];
  doc.text(head[1], x + 2, startY + 6);
  x += colWidths[1];
  doc.text(head[2], x + 2, startY + 6);

  // Body
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  let y = startY + rowHeight;

  for (const row of body) {
    doc.rect(left, y, colWidths[0], rowHeight, "S");
    doc.rect(left + colWidths[0], y, colWidths[1], rowHeight, "S");
    doc.rect(left + colWidths[0] + colWidths[1], y, colWidths[2], rowHeight, "S");

    doc.text(row[0], left + 2, y + 6);
    doc.text(row[1], left + colWidths[0] + 2, y + 6);
    doc.text(row[2], left + colWidths[0] + colWidths[1] + 2, y + 6);

    y += rowHeight;
  }
}

function addPage1_ClientData(doc: jsPDF, rows: SimRow[], amount: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Datos del cliente y simulación", 14, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Monto solicitado (referencial): $${amount}`, 14, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "Nota: valores referenciales sujetos a evaluación crediticia y documentación.",
    14,
    71,
  );

  const body = rows.map((r) => [String(r.years), `$${r.cuota}`, `$${r.total}`]);
  drawTableSimple(
    doc,
    86,
    ["Años", "Cuota (aprox.)", "Monto final (estimado)"],
    body,
  );
}

function addPage2_LegalClauses(doc: jsPDF) {
  doc.addPage();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Cláusulas legales", 14, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const clauses = [
    "Los valores y cálculos contenidos en este documento son referenciales.",
    "La formalización del financiamiento depende de evaluación crediticia y validación documental.",
    "La información incluida en el expediente puede utilizarse como medio de prueba.",
    "La firma y aceptación se realizan mediante el flujo de firma digital correspondiente.",
  ];

  let y = 64;
  for (const c of clauses) {
    const lines = doc.splitTextToSize(c, 180);
    for (const line of lines) {
      doc.text(line, 14, y);
      y += 6;
    }
    y += 4;
  }
}

function addPage3_SignaturesEvidence(doc: jsPDF) {
  doc.addPage();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Firmas y evidencia", 14, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const content = [
    "Espacio para datos del cliente y aceptación.",
    "Evidencia técnica asociada a la generación del expediente.",
    "QR de verificación contenido en el encabezado.",
  ];

  let y = 64;
  for (const c of content) {
    doc.text(doc.splitTextToSize(c, 180), 14, y);
    y += 16;
  }

  // Firmas (casilleros)
  doc.setDrawColor(6, 36, 92);
  doc.rect(14, y + 6, 84, 22);
  doc.text("Firma", 22, y + 21);
  doc.rect(120, y + 6, 84, 22);
  doc.text("Fecha", 132, y + 21);
}

export async function exportElementToPdfForTables(params: {
  amount: number;
  rows: SimRow[];
  filename: string;
}) {
  const { amount, rows, filename } = params;

  const folio = `IG-TAB-${Date.now()}`;
  const generatedAt = new Date().toISOString();

  const payload = {
    amount,
    rows,
    folio,
    generatedAt,
    brand: BRAND.tagline,
  };

  // SHA-256 canónico (orden determinista)
  const sha256 = await sha256CanonicalBrowser(payload);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  addHeaderToPdf(doc, { folio, generatedAt, sha256 });

  const qrPayload = `${BRAND.tagline}|folio=${folio}|sha256=${sha256}`;
  await addQrToPdf(doc, qrPayload, 155, 8, 18);

  addPage1_ClientData(doc, rows, amount);
  addPage2_LegalClauses(doc);
  addPage3_SignaturesEvidence(doc);

  doc.save(filename);
}
