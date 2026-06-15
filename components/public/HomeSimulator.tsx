"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { formatMXN } from "@/lib/finance";
import { BRAND } from "@/lib/config";
import { ASSETS } from "@/lib/config";
import { sha256CanonicalBrowser } from "@/lib/hash-browser";

const MIN = 10_000;
const MAX = 250_000;
const STEP_AMOUNT = 1000;

const TERMS_YEARS = [1, 2, 3, 4, 6, 8] as const;
type TermYears = (typeof TERMS_YEARS)[number];

const ANNUAL_RATE = 0.07;
const MONTHLY_RATE = ANNUAL_RATE / 12;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function toMonedaMXN(n: number) {
  // formatMXN ya existe en lib/finance y ya usa el formato correcto del repo.
  return formatMXN(n);
}

function computeFrenchSchedule(params: { principal: number; years: number }) {
  const { principal: P, years } = params;
  const n = years * 12; // months
  const r = MONTHLY_RATE;

  if (!Number.isFinite(P) || P <= 0) throw new Error("Monto inválido");
  if (!Number.isFinite(years) || years <= 0) throw new Error("Plazo inválido");
  if (!Number.isFinite(n) || n <= 0) throw new Error("Plazo inválido (meses)");

  const pow = Math.pow(1 + r, n);
  const cuota = P * ((r * pow) / (pow - 1));
  const totalPagar = cuota * n;
  const totalIntereses = totalPagar - P;

  const schedule: {
    mes: number;
    saldoInicial: number;
    intereses: number;
    capital: number;
    cuota: number;
    saldoFinal: number;
  }[] = [];

  let saldoInicial = P;

  for (let mes = 1; mes <= n; mes++) {
    const intereses = saldoInicial * r;
    const capital = cuota - intereses;
    let saldoFinal = saldoInicial - capital;

    // Evitar errores acumulados: en el último mes ajustamos para cerrar ~0.
    if (mes === n) {
      saldoFinal = 0;
    }

    schedule.push({
      mes,
      saldoInicial,
      intereses,
      capital,
      cuota,
      saldoFinal,
    });

    saldoInicial = saldoFinal;
  }

  return {
    cuota,
    totalPagar,
    totalIntereses,
    schedule,
  };
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

function drawPdfTableAmortization(params: {
  doc: jsPDF;
  startY: number;
  rows: {
    mes: number;
    saldoInicial: number;
    intereses: number;
    capital: number;
    cuota: number;
    saldoFinal: number;
  }[];
}) {
  const { doc, startY, rows } = params;

  const left = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - 14;
  const tableWidth = right - left;

  // 6 columnas
  const colW = [
    12, // Mes
    30, // Saldo inicial
    30, // Intereses
    26, // Capital
    28, // Cuota
    30, // Saldo final
  ];

  const sum = colW.reduce((a, b) => a + b, 0);
  const scale = tableWidth / sum;
  const colWScaled = colW.map((w) => w * scale);

  const headerY = startY;
  const headerH = 8;
  const rowH = 7;

  const headerFill = [6, 36, 92] as unknown as number[];
  const grid = [217, 231, 247] as unknown as number[];
  const text = [0, 0, 0] as unknown as number[];

  doc.setFillColor(headerFill[0], headerFill[1], headerFill[2]);
  doc.setDrawColor(grid[0], grid[1], grid[2]);
  doc.setTextColor(text[0], text[1], text[2]);

  let x = left;
  const headers = ["Mes", "Saldo Inicial", "Intereses", "Capital", "Cuota", "Saldo Final"];

  // Header background + text
  doc.rect(left, headerY, tableWidth, headerH, "FD");

  for (let i = 0; i < headers.length; i++) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(headers[i], x + 2, headerY + 5);
    doc.rect(x, headerY, colWScaled[i], headerH);
    x += colWScaled[i];
  }

  // Body
  let y = headerY + headerH;

  for (let i = 0; i < rows.length; i++) {
    if (y + rowH > doc.internal.pageSize.getHeight() - 18) {
      doc.addPage();
      y = 14;
    }

    const r = rows[i];
    const cells = [
      String(r.mes),
      toMonedaMXN(r.saldoInicial),
      toMonedaMXN(r.intereses),
      toMonedaMXN(r.capital),
      toMonedaMXN(r.cuota),
      toMonedaMXN(r.saldoFinal),
    ];

    x = left;
    for (let c = 0; c < cells.length; c++) {
      doc.rect(x, y, colWScaled[c], rowH);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      // Alineación simple
      const tx = x + 2;
      const ty = y + 5;
      doc.text(cells[c], tx, ty);

      x += colWScaled[c];
    }

    y += rowH;
  }
}

export function HomeSimulator() {
  const [amount, setAmount] = useState(50_000);
  const [termYears, setTermYears] = useState<TermYears>(4);

  // Debounce 300ms para evitar recalculo/remezcla en UI
  const debAmount = useDebouncedValue(amount, 300);
  const debYears = useDebouncedValue(termYears, 300);

  const simulation = useMemo(() => {
    return computeFrenchSchedule({ principal: debAmount, years: debYears });
  }, [debAmount, debYears]);

  const percent = ((amount - MIN) / (MAX - MIN)) * 100;

  const [showModal, setShowModal] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const tooltipText =
    "Costo Anual Total (CAT): información referencial. El CAT exacto depende del análisis individual.";

  const whatsappText = encodeURIComponent(
    `Hola, realicé una simulación:\n\nMonto: ${formatMXN(amount)}\nPlazo: ${termYears} años\nCuota estimada: ${formatMXN(
      simulation.cuota,
    )}\n\nQuiero recibir información sobre el proceso.`,
  );

  async function downloadCotizacionPdf() {
    setPdfBusy(true);
    setPdfError(null);

    try {
      const folio = `IG-COT-2026-${String(Math.floor(10000 + Math.random() * 89999))}`;
      const generatedAt = new Date();

      // Huella SHA-256 canónica (usa lib/hash-browser)
      const payload = {
        folio,
        generatedAt: generatedAt.toISOString(),
        monto: amount,
        plazoAnios: termYears,
        tasaAnual: 0.07,
        cuotaMensual: simulation.cuota,
        totalPagar: simulation.totalPagar,
        totalIntereses: simulation.totalIntereses,
      };

      const sha256 = await sha256CanonicalBrowser(payload);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Header
      // Logo placeholder (texto robusto; si luego quieres imagen base64 lo extendemos)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Impulso Go", 14, 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Folio: ${folio}`, 14, 22);
      doc.text(`Fecha: ${generatedAt.toLocaleDateString("es-MX")}`, 14, 28);
      doc.text(`SHA-256: ${sha256}`, 14, 34);

      // Datos ingresados
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Datos de la cotización", 14, 44);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Monto: ${toMonedaMXN(amount)} MXN`, 14, 52);
      doc.text(`Plazo: ${termYears} años (${termYears * 12} meses)`, 14, 58);
      doc.text(`Tasa anual fija: 7.00%`, 14, 64);

      // Resultados
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Resultados", 105, 44);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(toMonedaMXN(Math.round(simulation.cuota * 100) / 100), 105, 58);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Cuota mensual`, 105, 64);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total a pagar: ${toMonedaMXN(simulation.totalPagar)}`, 14, 74);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total intereses: ${toMonedaMXN(simulation.totalIntereses)}`, 14, 80);

      // QR en esquina derecha usando qrcode (ya existe dep)
      const qrPayload = `folio=${folio}|sha256=${sha256}|monto=${amount}|plazo=${termYears}`;
      const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 0, width: 160 });
      doc.addImage(qrDataUrl, "PNG", 170, 46, 24, 24, undefined, "FAST");

      // Tabla amortización (6 columnas)
      const firstTableY = 92;
      drawPdfTableAmortization({
        doc,
        startY: firstTableY,
        rows: simulation.schedule,
      });

      // Footer legal (texto)
      const legalFooter =
        "Valores referenciales sujetos a evaluación crediticia, validación documental y términos contractuales. " +
        "La tasa anual ordinaria fija del 7% es fija durante toda la vigencia del contrato.";

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      // Insertamos en la última página: aproximación simple usando current page count
      const totalPages = doc.getNumberOfPages();
      doc.setPage(totalPages);

      const pageH = doc.internal.pageSize.getHeight();
      doc.text(legalFooter, 14, pageH - 16, { maxWidth: 180 });

      const disclaimer =
        "Impulso Go, S.A. de C.V., SOFOM, E.N.R. | Documento generado electrónicamente";
      doc.text(disclaimer, 14, pageH - 8, { maxWidth: 180 });

      doc.save(`cotizacion-impulso-go-${amount}-${termYears}a.pdf`);
    } catch (e) {
      console.error(e);
      setPdfError("No se pudo generar el PDF. Intenta nuevamente.");
    } finally {
      setPdfBusy(false);
    }
  }

  const errors = useMemo(() => {
    const amtOk = amount >= MIN && amount <= MAX;
    const plazoOk = termYears >= 1 && termYears <= 8;
    return {
      amtOk,
      plazoOk,
    };
  }, [amount, termYears]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-blue-950/8">
      <div className="border-b border-slate-100 bg-gradient-to-r from-[#06245C] to-[#1266D6] p-5 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100">
              Simulador financiero
            </p>
            <h3 className="mt-2 text-2xl font-black">Cotiza con claridad.</h3>
          </div>

          <span className="group relative w-max rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">
            <span>7.00% anual fija</span>
            <span className="pointer-events-none absolute left-1/2 top-full z-10 hidden w-64 -translate-x-1/2 rounded-lg bg-black/90 p-2 text-[11px] leading-4 text-white group-hover:block">
              {tooltipText}
            </span>
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 p-5">
          <div>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <label className="text-sm font-bold text-[var(--color-text)]" htmlFor="home-amount">
                Monto del crédito
              </label>

              <input
                id="home-amount"
                type="number"
                min={MIN}
                max={MAX}
                step={STEP_AMOUNT}
                value={amount}
                onChange={(event) => {
                  const raw = Number(event.target.value);
                  const clamped = clamp(Number.isFinite(raw) ? raw : MIN, MIN, MAX);
                  const stepped = Math.round(clamped / STEP_AMOUNT) * STEP_AMOUNT;
                  setAmount(clamp(stepped, MIN, MAX));
                }}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-right text-sm font-black text-[var(--color-institutional)] outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20 sm:w-auto"
              />
            </div>

            <p className="mt-3 text-center text-5xl font-black tracking-tight text-[var(--color-institutional)]">
              {toMonedaMXN(amount)}
            </p>

            <div className="relative mt-5 h-3 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0A8F3C] to-[#1266D6]"
                style={{ width: `${percent}%` }}
              />
              <input
                aria-label="Monto del crédito"
                type="range"
                min={MIN}
                max={MAX}
                step={STEP_AMOUNT}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="absolute inset-0 h-3 w-full cursor-pointer opacity-0"
              />
            </div>

            <div className="mt-2 flex justify-between text-xs font-bold text-[var(--color-muted)]">
              <span>$10,000</span>
              <span>$250,000</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[10_000, 50_000, 100_000, 150_000, 200_000, 250_000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`h-10 rounded-lg border px-3 text-xs font-black transition ${
                    amount === v
                      ? "border-[var(--color-action)] bg-[var(--color-surface)] text-[var(--color-action)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[var(--color-action)]/40"
                  }`}
                >
                  {toMonedaMXN(v)}
                </button>
              ))}
            </div>

            {!errors.amtOk ? (
              <p className="mt-3 text-sm font-semibold text-[var(--color-danger)]">
                Monto fuera de rango ({toMonedaMXN(MIN)} - {toMonedaMXN(MAX)}).
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-bold text-[var(--color-text)]">Plazo</label>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TERMS_YEARS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setTermYears(term)}
                  className={`h-12 rounded-lg text-sm font-black transition ${
                    termYears === term
                      ? "bg-[var(--color-institutional)] text-white shadow-lg shadow-blue-950/20"
                      : "bg-slate-100 text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  {term} {term === 1 ? "año" : "años"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-[#f8fbff] p-5 lg:border-l lg:border-t-0">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[var(--color-muted)]">
                  Cuota mensual
                </span>
                <strong className="text-4xl font-black text-[#1E3A8A]">
                  {toMonedaMXN(Math.round(simulation.cuota * 100) / 100)}
                </strong>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-[var(--color-muted)]">
                  Total a pagar
                </span>
                <strong className="text-lg font-black text-[var(--color-success)]">
                  {toMonedaMXN(simulation.totalPagar)}
                </strong>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[var(--color-muted)]">
                  Total intereses
                </span>
                <strong className="text-lg font-black text-[var(--color-action)]">
                  {toMonedaMXN(simulation.totalIntereses)}
                </strong>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-[var(--color-muted)]">Tasa anual</div>
              <div className="mt-2 text-3xl font-black text-[var(--color-institutional)]">7.00%</div>
              <div className="mt-2 text-xs text-[var(--color-muted)] leading-5">
                Fija durante toda la vigencia del contrato.
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              onClick={() => setShowModal(true)}
              className="sm:w-auto"
            >
              Ver tabla de amortización
            </Button>

            <Button
              onClick={downloadCotizacionPdf}
              disabled={pdfBusy || !errors.amtOk || !errors.plazoOk}
              className="sm:w-auto"
            >
              {pdfBusy ? "Generando PDF..." : "Descargar cotización PDF"}
            </Button>
          </div>

          {pdfError ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--color-danger)]">
              {pdfError}
            </div>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-semibold text-[var(--color-muted)]">
                ¿Quieres el proceso por WhatsApp?
              </div>
              <Button
                href={`${BRAND.whatsappUrl}&text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a]"
              >
                Recibir información
              </Button>
            </div>

            <div className="mt-3 space-y-1 text-center text-xs leading-5 text-[var(--color-muted)]">
              <p>Valores referenciales sujetos a evaluación crediticia.</p>
              <p>El resultado puede variar según cada solicitud.</p>
            </div>
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                  Amortización francesa
                </div>
                <div className="mt-1 text-lg font-black text-[var(--color-institutional)]">
                  Tabla mensual ({termYears} años)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                aria-label="Cerrar"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-3 py-3">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[70px_140px_150px_120px_120px_160px] gap-1 bg-[#06245C] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white">
                  <div>Mes</div>
                  <div>Saldo Inicial</div>
                  <div>Intereses</div>
                  <div>Capital</div>
                  <div>Cuota</div>
                  <div>Saldo Final</div>
                </div>

                {simulation.schedule.map((r) => (
                  <div
                    key={r.mes}
                    className={`grid grid-cols-[70px_140px_150px_120px_120px_160px] gap-1 px-3 py-2 ${
                      r.mes % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } border-t border-slate-100`}
                  >
                    <div className="text-center text-sm font-bold text-[var(--color-institutional)]">
                      {r.mes}
                    </div>
                    <div className="text-right text-sm font-bold text-[var(--color-text)]">
                      {toMonedaMXN(r.saldoInicial)}
                    </div>
                    <div className="text-right text-sm font-bold text-[var(--color-action)]">
                      {toMonedaMXN(r.intereses)}
                    </div>
                    <div className="text-right text-sm font-bold text-[var(--color-success)]">
                      {toMonedaMXN(r.capital)}
                    </div>
                    <div className="text-right text-sm font-bold text-[var(--color-institutional)]">
                      {toMonedaMXN(r.cuota)}
                    </div>
                    <div className="text-right text-sm font-bold text-[var(--color-text)]">
                      {toMonedaMXN(r.saldoFinal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <div className="text-xs leading-5 text-[var(--color-muted)]">
                Valores referenciales sujetos a evaluación crediticia, validación documental y términos contractuales.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
