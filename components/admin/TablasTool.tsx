"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ASSETS } from "@/lib/config";
import {
  buildSimulationTable,
  formatMXN,
  QUICK_AMOUNTS,
  validateAmount,
} from "@/lib/finance";
import { exportElementToPng } from "@/lib/png-export";

type Format = "square" | "vertical";
const PREVIEW_SCALE = 0.42;

export function TablasTool() {
  const [amount, setAmount] = useState(10000);
  const [format, setFormat] = useState<Format>("vertical");
  const previewRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => buildSimulationTable(amount), [amount]);
  const amountError = validateAmount(amount);

  const size = format === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1350 };
  const bestRow = rows[0];

  async function downloadPng() {
    if (!previewRef.current || amountError) return;
    await exportElementToPng(
      previewRef.current.firstElementChild as HTMLElement,
      `tabla-${amount}-${format}.png`,
      size.w,
      size.h,
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <div>
            <h2 className="font-black text-[var(--color-institutional)]">Simulador</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              Monto mínimo de $10,000 MXN, incrementos de $5,000 MXN y tasa anual fija del 7%.
            </p>
          </div>
          <Input
            label="Monto de crédito (MXN)"
            type="number"
            step={5000}
            min={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          {amountError ? <p className="text-sm font-semibold text-[var(--color-danger)]">{amountError}</p> : null}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
            {QUICK_AMOUNTS.map((value) => (
              <Button key={value} variant="secondary" onClick={() => setAmount(value)} className="px-3">
                {formatMXN(value)}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 bg-slate-50">
          <h2 className="font-black text-[var(--color-institutional)]">Exportación</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={format === "square" ? "primary" : "secondary"} onClick={() => setFormat("square")}>
              1080 x 1080
            </Button>
            <Button variant={format === "vertical" ? "primary" : "secondary"} onClick={() => setFormat("vertical")}>
              1080 x 1350
            </Button>
          </div>
          <Button onClick={downloadPng} disabled={Boolean(amountError)}>
            Exportar PNG
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Desde</p>
            <p className="mt-2 text-2xl font-black text-[var(--color-success)]">
              {bestRow ? formatMXN(bestRow.cuota) : "-"}
            </p>
            <p className="text-xs text-[var(--color-muted)]">mensual aprox.</p>
          </Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Tasa</p>
            <p className="mt-2 text-2xl font-black text-[var(--color-institutional)]">7%</p>
            <p className="text-xs text-[var(--color-muted)]">anual fija</p>
          </Card>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
        <div className="overflow-hidden" style={{ width: size.w * PREVIEW_SCALE, height: size.h * PREVIEW_SCALE }}>
        <div
          ref={previewRef}
          className="origin-top-left"
          style={{ transform: `scale(${PREVIEW_SCALE})`, width: size.w, height: size.h }}
        >
          <div
            className="relative flex flex-col overflow-hidden bg-[#F7FAFF] p-12 text-[#172033]"
            style={{ width: size.w, height: size.h, fontFamily: "Inter, sans-serif" }}
          >
            <div className="absolute inset-x-0 top-0 h-5 bg-[#06245C]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={ASSETS.logo} alt="Impulso Go" width={82} height={82} />
                <div>
                  <p className="text-2xl font-black text-[#06245C]">Impulso Go</p>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#64748B]">SOFOM, E.N.R.</p>
                </div>
              </div>
              <div className="rounded-lg bg-white px-5 py-3 text-right shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#1266D6]">Tasa fija</p>
                <p className="text-3xl font-black text-[#06245C]">7% anual</p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-[1fr_0.55fr] gap-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1266D6]">Tabla de simulación de crédito</p>
                <h2 className="mt-4 text-6xl font-black leading-[1.02] text-[#06245C]">
                  Financiamiento claro para tomar decisiones.
                </h2>
              </div>
              <div className="rounded-lg bg-[#0A8F3C] p-6 text-white">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-white/70">Monto inicial</p>
                <p className="mt-5 text-5xl font-black">{formatMXN(amount)}</p>
              </div>
            </div>

            <table className="mt-12 w-full border-collapse overflow-hidden rounded-lg bg-white text-[23px] shadow-[0_28px_70px_rgba(6,36,92,0.12)]">
              <thead>
                <tr className="bg-[#06245C] text-white">
                  <th className="p-5 text-left">Plazo</th>
                  <th className="p-5 text-left">Cuota mensual aprox.</th>
                  <th className="p-5 text-left">Monto final al vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.years} className="border-b border-slate-200 last:border-b-0">
                    <td className="p-5 font-black text-[#06245C]">{row.years} años</td>
                    <td className="p-5 font-black text-[#0A8F3C]">{formatMXN(row.cuota)}</td>
                    <td className="p-5 font-bold">{formatMXN(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 rounded-lg border border-[#1266D6]/18 bg-white p-6">
              <p className="text-2xl font-black text-[#06245C]">
                Impulsa tus metas, nosotros te acompañamos.
              </p>
              <p className="mt-2 text-lg leading-7 text-[#64748B]">
                Valores referenciales. Sujeto a evaluación crediticia, validación documental y
                condiciones aplicables.
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-8">
              <Image src={ASSETS.condusef} alt="CONDUSEF" width={108} height={44} />
              <div className="rounded-lg bg-[#06245C] px-6 py-3 text-xl font-black text-white">
                Contacto por WhatsApp
              </div>
              <Image src={ASSETS.sipres} alt="SIPRES" width={108} height={44} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
