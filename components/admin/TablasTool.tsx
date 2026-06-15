"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { VerificationLogos } from "@/components/ui/VerificationLogos";
import { ASSETS, INSTITUTION } from "@/lib/config";
import {
  buildSimulationTable,
  formatMXN,
  QUICK_AMOUNTS,
  validateAmount,
} from "@/lib/finance";
import { exportElementToPng } from "@/lib/png-export";
import { exportElementToPdfForTables } from "@/lib/pdf-export";
import { recordActivity } from "@/lib/activity";

type Format = "square" | "vertical";
type SimulationRow = ReturnType<typeof buildSimulationTable>[number];

const PREVIEW_SCALE = 0.42;
const MAX_AMOUNT = 250000;
const quickAmounts = Array.from(new Set([...QUICK_AMOUNTS, 150000, 200000, 250000]));

function waitForPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );
}

function amountValidation(amount: number) {
  if (amount > MAX_AMOUNT) return `El monto máximo es ${formatMXN(MAX_AMOUNT)}.`;
  return validateAmount(amount);
}

function TableCanvas({
  amount,
  rows,
  format,
}: {
  amount: number;
  rows: SimulationRow[];
  format: Format;
}) {
  const isSquare = format === "square";
  const size = isSquare ? { w: 1080, h: 1080 } : { w: 1080, h: 1350 };
  const tableTop = isSquare ? 360 : 430;
  const rowHeight = isSquare ? 122 : 142;

  return (
    <div
      data-export-dark="true"
      className="relative overflow-hidden bg-[#F5FAFF] text-[#172033]"
      style={{ width: size.w, height: size.h, fontFamily: "Inter, Segoe UI, sans-serif" }}
    >
      <div className="absolute inset-x-0 top-0 h-[390px] overflow-hidden">
        <Image
          src={ASSETS.hero2}
          alt=""
          fill
          sizes="1080px"
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/92 to-[#F5FAFF]" />
      </div>
      <div className="relative flex h-full flex-col px-14 py-12">
        <header className="grid grid-cols-[260px_1fr_230px] items-center gap-6">
          <div className="flex items-center gap-4">
            <Image src={ASSETS.logo} alt="Impulso Go" width={92} height={92} />
            <div>
              <p className="text-[36px] font-black leading-none text-[#06245C]">Impulso</p>
              <p className="text-[36px] font-black leading-none text-[#1266D6]">GO</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[17px] font-black uppercase tracking-[0.28em] text-[#1266D6]">
              Financiamiento formal
            </p>
            <h1 className="mt-2 text-[54px] font-black uppercase leading-[0.98] tracking-tight text-[#23395D]">
              Tabla de montos referenciales
            </h1>
          </div>
          <div className="flex justify-end">
            <div className="rounded-lg bg-white/90 p-3 shadow-sm">
              <VerificationLogos variant="table" />
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-[28px] bg-gradient-to-r from-[#06245C] to-[#1266D6] px-10 py-7 text-center text-white shadow-[0_18px_42px_rgba(6,36,92,0.22)]">
          <p className="text-[18px] font-black uppercase tracking-[0.28em] text-blue-100">
            Monto solicitado
          </p>
          <div className="mt-2 flex items-baseline justify-center gap-8">
            <p className="text-[72px] font-black leading-none">{formatMXN(amount)}</p>
            <p className="text-[46px] font-black leading-none">
              <span className="text-[#FFCF21]">{INSTITUTION.annualRatePercent}%</span> anual
            </p>
          </div>
        </section>

        <section
          className="absolute left-14 right-14 overflow-hidden rounded-[24px] border border-[#BFD5F2] bg-white shadow-[0_28px_70px_rgba(6,36,92,0.16)]"
          style={{ top: tableTop }}
        >
          <div className="grid grid-cols-[0.78fr_1fr_1fr] bg-[#06245C] text-center text-white">
            <div className="border-r border-white/15 px-4 py-5 text-[30px] font-black uppercase">Años</div>
            <div className="border-r border-white/15 px-4 py-5 text-[30px] font-black uppercase">Cuota</div>
            <div className="px-4 py-5 text-[30px] font-black uppercase">Monto final</div>
          </div>
          {rows.map((row, index) => (
            <div
              key={row.years}
              className="grid grid-cols-[0.78fr_1fr_1fr] items-center text-center"
              style={{
                minHeight: rowHeight,
                background: index % 2 === 0 ? "#FFFFFF" : "#F7FBFF",
                borderTop: "1px solid #D9E7F7",
              }}
            >
              <div className="flex justify-center border-r border-[#D9E7F7] px-5">
                <div className="min-w-[160px] rounded-[18px] bg-gradient-to-r from-[#1266D6] to-[#06245C] px-8 py-3 text-white shadow-[0_10px_20px_rgba(18,102,214,0.18)]">
                  <span className="text-[54px] font-black leading-none">{row.years}</span>
                </div>
              </div>
              <div className="border-r border-[#D9E7F7] px-5">
                <p className="text-[44px] font-black leading-none text-[#1266D6]">
                  {formatMXN(row.cuota)}
                </p>
                <p className="mt-2 text-[13px] font-black uppercase tracking-[0.18em] text-[#64748B]">
                  mensual aproximado
                </p>
              </div>
              <div className="px-5">
                <p className="text-[44px] font-black leading-none text-[#0A8F3C]">
                  {formatMXN(row.total)}
                </p>
                <p className="mt-2 text-[13px] font-black uppercase tracking-[0.18em] text-[#64748B]">
                  estimado total
                </p>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-auto grid grid-cols-[1fr_320px] items-end gap-8">
          <div>
            <p className="text-[34px] font-black uppercase tracking-[0.08em] text-[#06245C]">
              Interés anual: {INSTITUTION.annualRatePercent}%
            </p>
            <p className="mt-3 max-w-2xl text-[17px] font-semibold leading-7 text-[#64748B]">
              Valores referenciales sujetos a evaluación crediticia, validación documental y
              condiciones contractuales aplicables.
            </p>
          </div>
          <div className="relative h-40">
            {[42, 66, 90, 118, 146].map((height, index) => (
              <div
                key={height}
                className="absolute bottom-0 w-12 rounded-t-[18px] bg-gradient-to-t from-[#06245C] to-[#27A7FF] shadow-[0_12px_24px_rgba(18,102,214,0.22)]"
                style={{ height, left: index * 54 }}
              />
            ))}
            <div className="absolute bottom-4 right-0 flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[#BFE3FF] bg-[#1266D6] text-[52px] font-black text-white shadow-[0_16px_28px_rgba(18,102,214,0.28)]">
              $
            </div>
          </div>
        </div>

        {!isSquare ? (
          <footer className="mt-8 flex items-center justify-between border-t border-[#D9E7F7] pt-5">
            <p className="text-[17px] font-black text-[#06245C]">
              Impulso Go, S.A. de C.V., SOFOM, E.N.R.
            </p>
            <p className="rounded-full bg-[#EAF4FF] px-6 py-3 text-[18px] font-black text-[#06245C]">
              Trámite 100% en línea
            </p>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

export function TablasTool() {
  const [amount, setAmount] = useState(10000);
  const [format, setFormat] = useState<Format>("vertical");
  const exportRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => buildSimulationTable(amount), [amount]);
  const amountError = amountValidation(amount);
  const size = format === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1350 };
  const bestRow = rows[0];

  async function downloadPdfOrFallback() {
    if (!exportRef.current || amountError) return;

    try {
      await document.fonts?.ready;
      await waitForPaint();

      const pdfFilename = `tabla-impulso-go-${amount}-${format}.pdf`;
      await exportElementToPdfForTables({
        amount,
        rows,
        filename: pdfFilename,
      });

      recordActivity({
        kind: "tabla",
        title: "Tabla exportada (PDF)",
        detail: `${formatMXN(amount)} - ${pdfFilename}`,
      });
    } catch (error) {
      // Fallback PNG (ruta anterior que ya existe)
      console.error("Error exportando PDF, usando fallback PNG:", error);

      if (!exportRef.current) return;

      await waitForImages(exportRef.current);

      await exportElementToPng(
        exportRef.current,
        `tabla-impulso-go-${amount}-${format}.png`,
        size.w,
        size.h,
      );

      recordActivity({
        kind: "tabla",
        title: "Tabla exportada (PNG fallback)",
        detail: `${formatMXN(amount)} - ${size.w}x${size.h}px`,
      });
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
      <div className="space-y-5">
        <Card className="space-y-4 rounded-lg">
          <div>
            <h2 className="font-black text-[var(--color-institutional)]">Simulador comercial</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              Monto de $10,000 a $250,000 MXN, incrementos de $5,000 MXN y tasa anual fija del 7%.
            </p>
          </div>
          <Input
            label="Monto de crédito (MXN)"
            type="number"
            step={5000}
            min={10000}
            max={MAX_AMOUNT}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          {amountError ? <p className="text-sm font-semibold text-[var(--color-danger)]">{amountError}</p> : null}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
            {quickAmounts.map((value) => (
              <Button key={value} variant="secondary" onClick={() => setAmount(value)} className="px-3">
                {formatMXN(value)}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 rounded-lg bg-slate-50">
          <h2 className="font-black text-[var(--color-institutional)]">Formato de salida</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={format === "square" ? "primary" : "secondary"} onClick={() => setFormat("square")}>
              1080 x 1080
            </Button>
            <Button variant={format === "vertical" ? "primary" : "secondary"} onClick={() => setFormat("vertical")}>
              1080 x 1350
            </Button>
          </div>
          <Button onClick={downloadPdfOrFallback} disabled={Boolean(amountError)}>
            Exportar PDF
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-lg">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Desde</p>
            <p className="mt-2 text-2xl font-black text-[var(--color-success)]">
              {bestRow ? formatMXN(bestRow.cuota) : "-"}
            </p>
            <p className="text-xs text-[var(--color-muted)]">mensual aprox.</p>
          </Card>
          <Card className="rounded-lg">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Proceso</p>
            <p className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
              En línea
            </p>
            <p className="text-xs text-[var(--color-muted)]">Sin visita presencial</p>
          </Card>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
        <div className="overflow-hidden" style={{ width: size.w * PREVIEW_SCALE, height: size.h * PREVIEW_SCALE }}>
          <div
            className="origin-top-left"
            style={{ transform: `scale(${PREVIEW_SCALE})`, width: size.w, height: size.h }}
          >
            <TableCanvas amount={amount} rows={rows} format={format} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0" aria-hidden="true">
        <div ref={exportRef}>
          <TableCanvas amount={amount} rows={rows} format={format} />
        </div>
      </div>
    </div>
  );
}
