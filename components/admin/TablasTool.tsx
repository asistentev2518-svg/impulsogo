"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ASSETS, BRAND } from "@/lib/config";
import {
  buildSimulationTable,
  formatMXN,
  QUICK_AMOUNTS,
  validateAmount,
} from "@/lib/finance";
import { exportElementToPng } from "@/lib/png-export";

type Format = "square" | "vertical";

export function TablasTool() {
  const [amount, setAmount] = useState(10000);
  const [format, setFormat] = useState<Format>("vertical");
  const previewRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => buildSimulationTable(amount), [amount]);
  const amountError = validateAmount(amount);

  const size = format === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1350 };

  async function downloadPng() {
    if (!previewRef.current) return;
    await exportElementToPng(
      previewRef.current.firstElementChild as HTMLElement,
      `tabla-${amount}-${format}.png`,
      size.w,
      size.h,
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <Input
          label="Monto de crédito (MXN)"
          type="number"
          step={5000}
          min={10000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {amountError ? <p className="text-sm text-[var(--color-danger)]">{amountError}</p> : null}
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((value) => (
            <Button key={value} variant="secondary" onClick={() => setAmount(value)}>
              {formatMXN(value)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant={format === "square" ? "primary" : "ghost"} onClick={() => setFormat("square")}>
            1080×1080
          </Button>
          <Button variant={format === "vertical" ? "primary" : "ghost"} onClick={() => setFormat("vertical")}>
            1080×1350
          </Button>
          <Button onClick={downloadPng}>Exportar PNG</Button>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-2xl border bg-slate-100 p-4">
        <div ref={previewRef} className="origin-top-left scale-[0.35]">
          <div
            className="flex flex-col bg-white p-12 text-[#172033]"
            style={{ width: size.w, height: size.h, fontFamily: "Inter, sans-serif" }}
          >
            <div className="flex items-center justify-between">
              <Image src={ASSETS.logo} alt="Impulso Go" width={80} height={80} />
              <p className="text-right text-sm font-semibold text-[#1266D6]">7% anual fija</p>
            </div>
            <h2 className="mt-8 text-4xl font-bold text-[#06245C]">Tabla de simulación de crédito</h2>
            <p className="mt-4 text-6xl font-black text-[#0A8F3C]">{formatMXN(amount)}</p>
            <table className="mt-10 w-full border-collapse text-2xl">
              <thead>
                <tr className="bg-[#06245C] text-white">
                  <th className="p-4 text-left">Plazo</th>
                  <th className="p-4 text-left">Cuota mensual aprox.</th>
                  <th className="p-4 text-left">Monto final al vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.years} className="border-b border-slate-200">
                    <td className="p-4">{row.years} años</td>
                    <td className="p-4 font-semibold text-[#0A8F3C]">{formatMXN(row.cuota)}</td>
                    <td className="p-4">{formatMXN(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-8 text-lg text-[#64748B]">
              Valores referenciales. Sujeto a evaluación crediticia.
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#06245C]">
              Impulsa tus metas, nosotros te acompañamos.
            </p>
            <div className="mt-auto flex items-center justify-between pt-8">
              <Image src={ASSETS.condusef} alt="CONDUSEF" width={90} height={36} />
              <p className="text-xl font-semibold text-[#1266D6]">Contacto WhatsApp</p>
              <Image src={ASSETS.sipres} alt="SIPRES" width={90} height={36} />
            </div>
            <p className="sr-only">{BRAND.whatsappUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
