"use client";

import { jsPDF } from "jspdf";
import { ASSETS, INSTITUTION } from "./config";
import { CLAUSE_SECTIONS } from "./contract";
import { formatMXN, type TermYears } from "./finance";

type RGB = [number, number, number];

const PAGE = { w: 210, h: 297, margin: 22 };
const CONTENT_W = PAGE.w - PAGE.margin * 2;
const TOP_Y = 36;
const BOTTOM_LIMIT = PAGE.h - 22;
const LINE_H = 5.4;

const COLORS = {
  azul: [11, 42, 91] as RGB,
  azulClaro: [30, 90, 168] as RGB,
  texto: [26, 26, 26] as RGB,
  gris: [120, 120, 130] as RGB,
  grisClaro: [218, 224, 235] as RGB,
  verde: [46, 125, 50] as RGB,
};

export type ContractPdfInput = {
  folio: string;
  fechaCDMX: string;
  cliente: {
    nombre: string;
    curp: string;
    telefono: string;
    domicilio: string;
    sexo?: string;
    ingresosMensuales?: string;
    banco?: string;
    cuenta?: string;
  };
  finance: {
    monto: number;
    plazoYears: TermYears;
    tasaAnual: number;
    cuotaMensual: number;
    totalPagar: number;
  };
  identidad: {
    ineFrente?: string;
    ineReverso?: string;
    selfie?: string;
  };
  firma: {
    nombre: string;
    imagen?: string | null;
    checkboxes: string[];
  };
  evidencia: {
    hash: string;
    qrDataUrl?: string;
    createdAtUtc?: string;
    actor?: string;
    action?: string;
    browser: string;
    device: string;
    userAgent?: string;
  };
};

function dataUrlMime(dataUrl: string) {
  return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
}

async function urlToDataUrl(src: string) {
  const response = await fetch(src);
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function safeFileName(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 40) || "Cliente"
  );
}

function drawClaudiaSignature(doc: jsPDF, x: number, y: number, color: RGB) {
  doc.saveGraphicsState();
  doc.setDrawColor(...color);
  doc.setTextColor(...color);
  doc.setLineCap("round");
  doc.setLineJoin("round");
  const scale = 0.34;
  const ang = (-12 * Math.PI) / 180;
  const cs = Math.cos(ang);
  const sn = Math.sin(ang);
  const t = (lx: number, ly: number): [number, number] => [
    x + (lx * cs - ly * sn) * scale,
    y + (lx * sn + ly * cs) * scale,
  ];
  const curve = (
    p1: [number, number],
    c1: [number, number],
    c2: [number, number],
    p2: [number, number],
  ) => {
    const a = t(...p1);
    const b = t(...c1);
    const c = t(...c2);
    const d = t(...p2);
    doc.lines(
      [[b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1], d[0] - a[0], d[1] - a[1]]],
      a[0],
      a[1],
      [1, 1],
      "S",
    );
  };

  doc.setLineWidth(0.42);
  curve([0, -2], [3, -24], [18, -29], [22, -13]);
  curve([22, -13], [24, -5], [9, -5], [8, -12]);
  curve([29, -6], [31, -17], [43, -17], [44, -7]);
  curve([44, -7], [46, 0], [37, 1], [37, -6]);
  curve([45, -8], [52, -14], [55, 1], [62, -7]);
  curve([62, -7], [68, -13], [70, 1], [77, -6]);
  curve([77, -6], [84, -12], [85, 1], [92, -5]);
  curve([92, -5], [98, -10], [105, -4], [111, -6]);
  doc.setLineWidth(0.28);
  curve([3, 5], [33, 10], [82, 9], [116, 3]);
  doc.setFont("times", "italic");
  doc.setFontSize(18);
  doc.text("Claudia", x + 20, y - 2, { align: "center" });
  doc.restoreGraphicsState();
}

export async function downloadInstitutionalContractPdf(data: ContractPdfInput) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = TOP_Y;
  const logo = await urlToDataUrl(ASSETS.logo).catch(() => "");
  const condusef = await urlToDataUrl(ASSETS.condusef).catch(() => "");
  const sipres = await urlToDataUrl(ASSETS.sipres).catch(() => "");

  const setColor = (rgb: RGB) => doc.setTextColor(...rgb);
  const setFill = (rgb: RGB) => doc.setFillColor(...rgb);
  const setDraw = (rgb: RGB) => doc.setDrawColor(...rgb);

  const drawHeader = () => {
    setFill(COLORS.azul);
    doc.rect(0, 0, PAGE.w, 22, "F");
    if (logo) {
      try {
        doc.addImage(logo, dataUrlMime(logo), PAGE.margin - 4, 4, 14, 14);
      } catch {
        // PDF generation should not fail because a logo cannot be embedded.
      }
    }
    setColor([255, 255, 255]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(INSTITUTION.legalName.toUpperCase(), PAGE.w / 2, 9, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(
      "Sociedad Financiera de Objeto Multiple, Entidad No Regulada - Registro verificable en SIPRES / CONDUSEF",
      PAGE.w / 2,
      14,
      { align: "center" },
    );
    doc.setFontSize(6.8);
    doc.text(`Folio ${data.folio} - ${data.fechaCDMX}`, PAGE.w / 2, 18.5, { align: "center" });
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    const fy = PAGE.h - 14;
    setDraw([200, 205, 215]);
    doc.setLineWidth(0.3);
    doc.line(PAGE.margin, fy, PAGE.w - PAGE.margin, fy);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setColor(COLORS.gris);
    doc.text("Contrato electronico - Impulso Go, SOFOM E.N.R.", PAGE.margin, fy + 4);
    doc.text(`Folio ${data.folio}`, PAGE.w / 2, fy + 4, { align: "center" });
    doc.text(`Pagina ${pageNum} / ${totalPages}`, PAGE.w - PAGE.margin, fy + 4, { align: "right" });
    doc.setFontSize(6.5);
    doc.text(
      "La consulta del registro en SIPRES verifica la entidad y no implica aprobacion, autorizacion o respaldo de operaciones por parte de CONDUSEF.",
      PAGE.w / 2,
      fy + 8,
      { align: "center" },
    );
  };

  const newPage = () => {
    doc.addPage();
    drawHeader();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(COLORS.texto);
    y = TOP_Y;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > BOTTOM_LIMIT) newPage();
  };

  const writeWrapped = (
    text: string,
    opts: { font?: "normal" | "bold" | "italic"; size?: number; color?: RGB; gap?: number; x?: number; w?: number } = {},
  ) => {
    const { font = "normal", size = 10, color = COLORS.texto, gap = 0, x = PAGE.margin, w = CONTENT_W } = opts;
    doc.setFont("helvetica", font);
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(text, w);
    lines.forEach((line: string) => {
      ensureSpace(LINE_H);
      doc.setFont("helvetica", font);
      doc.setFontSize(size);
      setColor(color);
      doc.text(line, x, y);
      y += LINE_H;
    });
    if (gap) y += gap;
  };

  const sectionTitle = (title: string) => {
    ensureSpace(14);
    setColor(COLORS.azul);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, PAGE.margin, y);
    setDraw(COLORS.azulClaro);
    doc.setLineWidth(0.6);
    doc.line(PAGE.margin, y + 2, PAGE.margin + 30, y + 2);
    y += 9;
  };

  drawHeader();
  y = 50;
  setColor(COLORS.azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("CONTRATO ELECTRONICO DE CREDITO", PAGE.w / 2, y, { align: "center" });
  y += 6;
  setColor(COLORS.gris);
  doc.setFontSize(8.5);
  doc.text(INSTITUTION.legalName, PAGE.w / 2, y, { align: "center" });
  y += 14;

  setFill([245, 248, 252]);
  setDraw(COLORS.grisClaro);
  doc.setLineWidth(0.4);
  doc.roundedRect(PAGE.margin, y, CONTENT_W, 26, 3, 3, "FD");
  setColor(COLORS.gris);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("FOLIO DE EXPEDIENTE", PAGE.margin + 6, y + 7);
  doc.text("FECHA Y HORA (CDMX)", PAGE.margin + CONTENT_W / 2 + 6, y + 7);
  setColor(COLORS.azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(data.folio, PAGE.margin + 6, y + 15);
  doc.setFontSize(10);
  doc.text(data.fechaCDMX, PAGE.margin + CONTENT_W / 2 + 6, y + 15);
  y += 34;

  sectionTitle("DATOS DEL CLIENTE");
  const field = (label: string, value?: string) => {
    ensureSpace(LINE_H + 1);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    setColor(COLORS.texto);
    doc.text(`${label}:`, PAGE.margin, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", CONTENT_W - 46);
    doc.text(lines, PAGE.margin + 46, y);
    y += Math.max(LINE_H, lines.length * (LINE_H - 0.4)) + 1;
  };
  field("Nombre completo", data.cliente.nombre);
  field("CURP", data.cliente.curp);
  field("Telefono", data.cliente.telefono);
  field("Domicilio", data.cliente.domicilio);
  field("Sexo", data.cliente.sexo);
  field("Ingresos mensuales", data.cliente.ingresosMensuales);
  field("Banco / cuenta", [data.cliente.banco, data.cliente.cuenta].filter(Boolean).join(" - "));
  y += 4;

  sectionTitle("CONDICIONES DEL FINANCIAMIENTO");
  setFill([248, 250, 252]);
  setDraw(COLORS.grisClaro);
  const boxStart = y;
  doc.roundedRect(PAGE.margin, y, CONTENT_W, 56, 3, 3, "FD");
  y += 6;
  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setColor(COLORS.texto);
    doc.text(label, PAGE.margin + 5, y);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    setColor(bold ? COLORS.azul : COLORS.texto);
    doc.text(value, PAGE.w - PAGE.margin - 5, y, { align: "right" });
    y += 6;
    setDraw([235, 238, 245]);
    doc.setLineWidth(0.2);
    doc.line(PAGE.margin + 5, y - 2.5, PAGE.w - PAGE.margin - 5, y - 2.5);
  };
  row("Monto solicitado", formatMXN(data.finance.monto), true);
  row("Plazo", `${data.finance.plazoYears} anos (${data.finance.plazoYears * 12} pagos)`);
  row("Tasa anual fija", `${(data.finance.tasaAnual * 100).toFixed(2)}%`);
  row("Pago mensual estimado", formatMXN(data.finance.cuotaMensual), true);
  row("Total estimado a pagar", formatMXN(data.finance.totalPagar), true);
  y = boxStart + 60;
  writeWrapped(
    "Las comisiones, gastos administrativos, polizas, penalizaciones y cargos por incumplimiento son conceptos independientes del monto aprobado y seran informados al CLIENTE de forma previa, clara y separada.",
    { size: 8.5, color: COLORS.gris, gap: 4 },
  );

  ensureSpace(40);
  if (data.evidencia.qrDataUrl) {
    try {
      doc.addImage(data.evidencia.qrDataUrl, "PNG", PAGE.margin, y, 30, 30);
    } catch {
      // Ignore QR embed failures.
    }
  }
  setColor(COLORS.texto);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Verificacion en SIPRES / CONDUSEF", PAGE.margin + 34, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setColor(COLORS.gris);
  doc.text(
    doc.splitTextToSize(
      "Escanea el codigo QR para consultar el registro publico de Impulso Go en el SIPRES. La consulta verifica el registro de la entidad y no implica aprobacion, autorizacion o respaldo de operaciones por parte de CONDUSEF.",
      CONTENT_W - 36,
    ),
    PAGE.margin + 34,
    y + 11,
  );

  newPage();
  sectionTitle("DECLARACIONES Y CLAUSULAS");
  CLAUSE_SECTIONS.forEach((section) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(COLORS.azul);
    const titleLines = doc.splitTextToSize(section.title, CONTENT_W);
    ensureSpace(titleLines.length * LINE_H + LINE_H);
    titleLines.forEach((line: string) => {
      doc.text(line, PAGE.margin, y);
      y += LINE_H;
    });
    y += 1;
    writeWrapped(section.body, { size: 9.5, gap: 5 });
  });

  newPage();
  sectionTitle("ANEXO A - RESUMEN DE CONDICIONES FINANCIERAS");
  writeWrapped(
    `Valores referenciales calculados con tasa anual fija de ${(data.finance.tasaAnual * 100).toFixed(2)}% bajo el metodo de amortizacion francesa. Sujetos a evaluacion final.`,
    { size: 9, color: COLORS.gris, gap: 5 },
  );
  row("Monto solicitado", formatMXN(data.finance.monto), true);
  row("Plazo", `${data.finance.plazoYears} anos`);
  row("Numero de pagos mensuales", String(data.finance.plazoYears * 12));
  row("Pago mensual estimado", formatMXN(data.finance.cuotaMensual), true);
  row("Total estimado a pagar", formatMXN(data.finance.totalPagar), true);

  newPage();
  sectionTitle("ANEXO B - EVIDENCIA DE IDENTIDAD");
  writeWrapped(
    "El presente anexo conserva las imagenes capturadas durante el proceso de validacion de identidad. Forman parte integral del expediente electronico vinculado al folio.",
    { size: 9, color: COLORS.gris, gap: 5 },
  );
  const drawIdCard = (label: string, imgData: string | undefined, slot: number) => {
    const cardW = (CONTENT_W - 6) / 2;
    const cardH = 70;
    const col = slot % 2;
    const cx = PAGE.margin + col * (cardW + 6);
    if (col === 0) ensureSpace(cardH + 8);
    setFill([252, 253, 255]);
    setDraw(COLORS.grisClaro);
    doc.roundedRect(cx, y, cardW, cardH, 3, 3, "FD");
    setFill(COLORS.azul);
    doc.rect(cx, y, cardW, 8, "F");
    setColor([255, 255, 255]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(label, cx + 4, y + 5.5);
    if (imgData) {
      try {
        doc.addImage(imgData, dataUrlMime(imgData), cx + 4, y + 11, cardW - 8, cardH - 15);
      } catch {
        setColor(COLORS.gris);
        doc.text("Imagen no disponible", cx + cardW / 2, y + cardH / 2, { align: "center" });
      }
    } else {
      setColor(COLORS.gris);
      doc.text("No proporcionada", cx + cardW / 2, y + cardH / 2, { align: "center" });
    }
    if (col === 1) y += cardH + 6;
  };
  drawIdCard("INE - FRENTE", data.identidad.ineFrente, 0);
  drawIdCard("INE - REVERSO", data.identidad.ineReverso, 1);
  drawIdCard("SELFIE SOSTENIENDO INE", data.identidad.selfie, 0);
  const cx2 = PAGE.margin + ((CONTENT_W - 6) / 2 + 6);
  setFill([248, 250, 253]);
  setDraw(COLORS.grisClaro);
  doc.roundedRect(cx2, y, (CONTENT_W - 6) / 2, 70, 3, 3, "FD");
  setColor(COLORS.azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("CONSENTIMIENTO BIOMETRICO", cx2 + 4, y + 6);
  writeWrapped(
    "EL CLIENTE consintio expresamente el tratamiento de su identificacion oficial, imagen facial, datos biometricos y evidencia tecnica para validacion de identidad, prevencion de suplantacion, formalizacion contractual y conservacion del expediente electronico.",
    { x: cx2 + 4, w: (CONTENT_W - 6) / 2 - 8, size: 7.5, color: COLORS.gris },
  );

  newPage();
  sectionTitle("ANEXO C - CONSTANCIA DE FIRMA ELECTRONICA");
  writeWrapped(
    "Esta constancia documenta los elementos tecnicos asociados a la firma electronica del presente contrato y forma parte integral del expediente.",
    { size: 9, color: COLORS.gris, gap: 4 },
  );
  setFill([252, 253, 255]);
  setDraw(COLORS.grisClaro);
  const firmaBoxY = y;
  doc.roundedRect(PAGE.margin, y, CONTENT_W, 50, 3, 3, "FD");
  y += 6;
  setColor(COLORS.gris);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("FIRMA DEL CLIENTE", PAGE.margin + 5, y);
  doc.text("REPRESENTANTE LEGAL - Impulso Go", PAGE.margin + CONTENT_W / 2 + 5, y);
  y += 3;
  if (data.firma.imagen) {
    try {
      doc.addImage(data.firma.imagen, "PNG", PAGE.margin + 5, y, 70, 28);
    } catch {
      // Ignore signature embed failures.
    }
  }
  drawClaudiaSignature(doc, PAGE.margin + CONTENT_W / 2 + 28, y + 24, COLORS.azul);
  setDraw([80, 80, 90]);
  doc.line(PAGE.margin + 5, y + 28, PAGE.margin + CONTENT_W / 2 - 5, y + 28);
  doc.line(PAGE.margin + CONTENT_W / 2 + 5, y + 28, PAGE.margin + CONTENT_W - 5, y + 28);
  setColor(COLORS.texto);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(data.firma.nombre || data.cliente.nombre, PAGE.margin + 5, y + 33);
  doc.text(INSTITUTION.representative, PAGE.margin + CONTENT_W / 2 + 5, y + 33);
  doc.setFontSize(7.5);
  setColor(COLORS.gris);
  doc.text("Firmante", PAGE.margin + 5, y + 37);
  doc.text(INSTITUTION.representativeTitle, PAGE.margin + CONTENT_W / 2 + 5, y + 37);
  y = firmaBoxY + 58;

  sectionTitle("EVIDENCIA TECNICA DEL PROCESO");
  field("Usuario que realizo la accion", data.evidencia.actor || data.firma.nombre || data.cliente.nombre);
  field("Accion realizada", data.evidencia.action || "Firma y aceptacion de contrato digital");
  field("Folio", data.folio);
  field("Fecha y hora (CDMX)", data.fechaCDMX);
  field("Timestamp UTC", data.evidencia.createdAtUtc);
  field("Hash del expediente (SHA-256)", data.evidencia.hash);
  field("Navegador", data.evidencia.browser);
  field("Dispositivo", data.evidencia.device);
  field("User agent", data.evidencia.userAgent);
  y += 5;
  setColor(COLORS.azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ACEPTACIONES REGISTRADAS", PAGE.margin, y);
  y += 5;
  data.firma.checkboxes.forEach((label) => {
    ensureSpace(LINE_H);
    setColor(COLORS.verde);
    doc.setFont("helvetica", "bold");
    doc.text("✓", PAGE.margin, y);
    writeWrapped(label, { x: PAGE.margin + 5, w: CONTENT_W - 8, size: 8.5, gap: 0 });
  });

  newPage();
  sectionTitle("ANEXO D - EXTRACTO DEL AVISO DE PRIVACIDAD INTEGRAL");
  writeWrapped(
    `Responsable: ${INSTITUTION.legalName}, con domicilio en ${INSTITUTION.address}`,
    { size: 9, gap: 3 },
  );
  writeWrapped(
    "Datos tratados: identificacion, contacto, identificacion oficial INE por ambos lados, imagen facial, datos financieros del credito y datos tecnicos del proceso de firma.",
    { size: 9, gap: 3 },
  );
  writeWrapped(
    "Finalidades primarias: validar la identidad del solicitante, prevenir suplantacion, formalizar el contrato electronico de credito, conservar evidencia y cumplir obligaciones legales y contractuales.",
    { size: 9, gap: 3 },
  );
  writeWrapped(
    "El expediente electronico se conserva por el plazo necesario para cumplir obligaciones legales y contractuales, y para servir como medio de prueba.",
    { size: 9, gap: 4 },
  );
  if (logo || condusef || sipres) {
    try {
      if (logo) doc.addImage(logo, dataUrlMime(logo), PAGE.w / 2 - 32, PAGE.h - 36, 14, 14);
      if (condusef) doc.addImage(condusef, dataUrlMime(condusef), PAGE.w / 2 - 14, PAGE.h - 34, 24, 10);
      if (sipres) doc.addImage(sipres, dataUrlMime(sipres), PAGE.w / 2 + 12, PAGE.h - 34, 24, 10);
    } catch {
      // Logos are decorative in this annex.
    }
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  doc.save(`Contrato_ImpulsoGo_${safeFileName(data.cliente.nombre)}_${data.folio}.pdf`);
}
