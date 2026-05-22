"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildSimulationTable,
  calculateMonthlyPayment,
  formatMXN,
  type TermYears,
} from "@/lib/finance";
import { BRAND } from "@/lib/config";

const terms: TermYears[] = [2, 4, 6, 8];
const MIN = 10000;
const MAX = 250000;
const quickAmounts = [10000, 25000, 50000, 100000, 150000, 250000];

export function HomeSimulator() {
  const [amount, setAmount] = useState(50000);
  const [termYears, setTermYears] = useState<TermYears>(4);
  const payment = calculateMonthlyPayment(amount, termYears);
  const rows = useMemo(() => buildSimulationTable(amount), [amount]);
  const percent = ((amount - MIN) / (MAX - MIN)) * 100;
  const text = encodeURIComponent(
    `Hola, realicé una simulación:\n\nMonto: ${formatMXN(amount)}\nPlazo: ${termYears} años\nCuota estimada: ${formatMXN(payment.cuota)}\n\nQuiero recibir información sobre el proceso.`,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-blue-950/8">
      <div className="border-b border-slate-100 bg-gradient-to-r from-[#06245C] to-[#1266D6] p-5 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100">
              Simulador financiero
            </p>
            <h3 className="mt-2 text-2xl font-black">Calcula una referencia clara.</h3>
          </div>
          <span className="w-max rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">
            7.00% anual fija
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
                step={5000}
                value={amount}
                onChange={(event) => {
                  const value = Math.min(MAX, Math.max(MIN, Number(event.target.value) || MIN));
                  setAmount(Math.round(value / 5000) * 5000);
                }}
                className="h-10 rounded-lg border border-slate-200 px-3 text-right text-sm font-black text-[var(--color-institutional)] outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20"
              />
            </div>
            <p className="mt-3 text-center text-5xl font-black tracking-tight text-[var(--color-institutional)]">
              {formatMXN(amount)}
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
                step={5000}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="absolute inset-0 h-3 w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-bold text-[var(--color-muted)]">
              <span>$10,000</span>
              <span>$250,000</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`h-10 rounded-lg border px-2 text-xs font-black transition ${
                    amount === value
                      ? "border-[var(--color-action)] bg-[var(--color-surface)] text-[var(--color-action)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[var(--color-action)]/40"
                  }`}
                >
                  {formatMXN(value)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-[var(--color-text)]">Plazo</label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {terms.map((term) => (
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
                  {term} años
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-[#f8fbff] p-5 lg:border-l lg:border-t-0">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">
                Cuota mensual estimada
              </span>
              <strong className="text-3xl text-[var(--color-institutional)]">
                {formatMXN(payment.cuota)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">
                Total estimado a pagar
              </span>
              <strong className="text-lg text-[var(--color-success)]">{formatMXN(payment.total)}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 pt-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">Tasa anual</span>
              <strong className="text-[var(--color-institutional)]">7.00%</strong>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="grid grid-cols-[0.7fr_1fr_1fr] bg-[#06245C] text-center text-[11px] font-black uppercase tracking-[0.14em] text-white">
              <div className="px-3 py-3">Años</div>
              <div className="border-l border-white/10 px-3 py-3">Cuota</div>
              <div className="border-l border-white/10 px-3 py-3">Monto final</div>
            </div>
            {rows.map((row) => {
              const active = row.years === termYears;
              return (
                <button
                  key={row.years}
                  type="button"
                  onClick={() => setTermYears(row.years)}
                  className={`grid w-full grid-cols-[0.7fr_1fr_1fr] items-center border-t border-slate-100 text-center transition ${
                    active ? "bg-[#eef6ff]" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="px-3 py-3 text-lg font-black text-[var(--color-institutional)]">
                    {row.years}
                  </span>
                  <span className="border-l border-slate-100 px-3 py-3 font-black text-[var(--color-action)]">
                    {formatMXN(row.cuota)}
                  </span>
                  <span className="border-l border-slate-100 px-3 py-3 font-black text-[var(--color-success)]">
                    {formatMXN(row.total)}
                  </span>
                </button>
              );
            })}
          </div>

          <Button href={`${BRAND.whatsappUrl}&text=${text}`} className="mt-5 w-full bg-[#25D366] hover:bg-[#20bd5a]">
            Recibir información por WhatsApp
          </Button>
          <div className="mt-4 space-y-1 text-center text-xs leading-5 text-[var(--color-muted)]">
            <p>Valores referenciales sujetos a evaluación y términos aplicables.</p>
            <p>El resultado puede variar según cada caso.</p>
            <p>Cualquier costo administrativo se informa previamente con total transparencia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
