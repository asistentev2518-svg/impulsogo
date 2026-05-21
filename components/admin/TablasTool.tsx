"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";
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
  const isSquare = format === "square";
  const bestRow = rows[0];

  async function downloadPng() {
    if (!previewRef.current || amountError) return;
    await exportElementToPng(
      previewRef.current.firstElementChild as HTMLElement,
      `tabla-impulso-go-${amount}-${format}.png`,
      size.w,
      size.h,
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <div>
            <h2 className="font-black text-[var(--color-institutional)]">Simulador comercial</h2>
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
          <h2 className="font-black text-[var(--color-institutional)]">Formato de salida</h2>
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
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Contacto</p>
            <p className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
              {BRAND.whatsappDisplay}
            </p>
            <p className="text-xs text-[var(--color-muted)]">WhatsApp oficial</p>
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
              data-export-dark="true"
              className="relative overflow-hidden bg-[#061A44] text-white"
              style={{ width: size.w, height: size.h, fontFamily: "Inter, sans-serif" }}
            >
              <div className="absolute inset-0 opacity-[0.07] panel-grid" />
              <div className="relative flex h-full flex-col p-8">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image src={ASSETS.logo} alt="Impulso Go" width={76} height={76} />
                    <div>
                      <p className="text-2xl font-black leading-tight">Impulso Go</p>
                      <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-white/62">
                        S.A. de C.V., SOFOM, E.N.R.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[12px] font-black uppercase tracking-[0.22em] text-white/85">
                    Registro SIPRES / CONDUSEF
                  </div>
                </header>

                <section
                  className="mt-6 flex flex-1 flex-col overflow-hidden rounded-lg bg-white text-[#172033] shadow-[0_34px_90px_rgba(0,0,0,0.34)]"
                >
                  <div className="border-b border-[#E5EDF7] px-10 pb-4 pt-6 text-center">
                    <p className="text-[12px] font-black uppercase tracking-[0.38em] text-[#1266D6]">
                      Simulación oficial de crédito
                    </p>
                    <h2
                      className="mt-3 font-black tracking-tight text-[#06245C]"
                      style={{ fontSize: isSquare ? 38 : 46, lineHeight: 1 }}
                    >
                      Tabla de montos referenciales
                    </h2>
                  </div>

                  <div className="px-10 pt-5">
                    <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#1266D6]">
                      Datos del financiamiento
                    </p>
                    <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg border border-[#E5EDF7]">
                      <div className="bg-[#FAFCFF] px-6 py-4 text-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#64748B]">
                          Monto solicitado
                        </p>
                        <p
                          className="mt-2 font-black tracking-tight text-[#06245C]"
                          style={{ fontSize: isSquare ? 34 : 48, lineHeight: 1 }}
                        >
                          {formatMXN(amount)}
                        </p>
                      </div>
                      <div className="border-l border-[#E5EDF7] bg-[#F4F9FF] px-6 py-4 text-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#64748B]">
                          Tasa anual ordinaria
                        </p>
                        <p
                          className="mt-2 font-black tracking-tight text-[#1266D6]"
                          style={{ fontSize: isSquare ? 36 : 50, lineHeight: 1 }}
                        >
                          {INSTITUTION.annualRatePercent}%
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#1266D6]">
                          Fija
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-10 pb-4 pt-5">
                    <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#1266D6]">
                      Detalle de pagos por plazo
                    </p>
                    <div className="mt-3 overflow-hidden rounded-lg border border-[#E5EDF7]">
                      <div className="grid grid-cols-[0.8fr_1.2fr_1.2fr] bg-[#06245C] text-center text-white">
                        <div className="px-4 py-4 text-[12px] font-black uppercase tracking-[0.24em]">Plazo</div>
                        <div className="border-l border-white/10 px-4 py-4 text-[12px] font-black uppercase tracking-[0.24em]">
                          Cuota mensual
                        </div>
                        <div className="border-l border-white/10 px-4 py-4 text-[12px] font-black uppercase tracking-[0.24em]">
                          Monto total
                        </div>
                      </div>
                      {rows.map((row, index) => (
                        <div
                          key={row.years}
                          className="grid grid-cols-[0.8fr_1.2fr_1.2fr] items-center border-t border-[#E5EDF7] text-center"
                          style={{ background: index % 2 === 0 ? "#FFFFFF" : "#FAFCFF" }}
                        >
                          <div className="px-4 py-3">
                            <span className="inline-flex items-baseline gap-1 rounded-lg bg-[#06245C] px-5 py-2 text-white">
                              <span className="text-[30px] font-black leading-none">{row.years}</span>
                              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                                años
                              </span>
                            </span>
                          </div>
                          <div className="border-l border-[#E5EDF7] px-4 py-3">
                            <p className="text-[30px] font-black leading-none text-[#06245C]">
                              {formatMXN(row.cuota)}
                            </p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
                              MXN / mes
                            </p>
                          </div>
                          <div className="border-l border-[#E5EDF7] px-4 py-3">
                            <p className="text-[30px] font-black leading-none text-[#0A8F3C]">
                              {formatMXN(row.total)}
                            </p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
                              Al vencimiento
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-6 border-t border-[#E5EDF7] bg-[#FAFCFF] px-10 py-4">
                    <div>
                      <p className="text-sm font-black text-[#06245C]">Valores referenciales</p>
                      <p className="mt-1 text-[12px] leading-5 text-[#64748B]">
                        Sujeto a evaluación crediticia, validación documental y condiciones
                        contractuales aplicables.
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <Image
                        src={ASSETS.condusef}
                        alt="CONDUSEF"
                        width={104}
                        height={42}
                        className="h-[42px] w-auto object-contain"
                      />
                      <Image
                        src={ASSETS.sipres}
                        alt="SIPRES"
                        width={104}
                        height={42}
                        className="h-[42px] w-auto object-contain"
                      />
                    </div>
                    <div className="rounded-full bg-[#0A8F3C] px-5 py-3 text-[13px] font-black uppercase tracking-[0.12em] text-white">
                      WhatsApp {BRAND.whatsappDisplay}
                    </div>
                  </div>
                </section>

                <footer className="pt-4 text-center">
                  <p className="text-lg font-bold text-white/92">Impulsa tus metas, nosotros te acompañamos.</p>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.2em] text-[#8bc4ff]">
                    Financiamiento formal, contrato firmado y expediente trazable.
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
