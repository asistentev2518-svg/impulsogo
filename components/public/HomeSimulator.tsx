"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { calculateMonthlyPayment, formatMXN, type TermYears } from "@/lib/finance";
import { BRAND } from "@/lib/config";

const terms: TermYears[] = [2, 4, 6, 8];
const MIN = 10000;
const MAX = 250000;

export function HomeSimulator() {
  const [amount, setAmount] = useState(50000);
  const [termYears, setTermYears] = useState<TermYears>(4);
  const payment = calculateMonthlyPayment(amount, termYears);
  const percent = ((amount - MIN) / (MAX - MIN)) * 100;
  const text = encodeURIComponent(
    `Hola, realice una simulacion:\n\nMonto: ${formatMXN(amount)}\nPlazo: ${termYears} anos\nCuota estimada: ${formatMXN(payment.cuota)}\n\nQuiero recibir informacion sobre el proceso.`,
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
            Simulador financiero
          </p>
          <h3 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
            Calcula una referencia clara.
          </h3>
        </div>
        <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-black text-[var(--color-institutional)]">
          7.00% anual
        </span>
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-[var(--color-text)]">Monto del credito</label>
        <p className="mt-2 text-center text-4xl font-black text-[var(--color-institutional)]">
          {formatMXN(amount)}
        </p>
        <div className="relative mt-4 h-3 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[var(--color-action)]"
            style={{ width: `${percent}%` }}
          />
          <input
            aria-label="Monto del credito"
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
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-[var(--color-text)]">Plazo</label>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {terms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setTermYears(term)}
              className={`h-11 rounded-lg text-sm font-black transition ${
                termYears === term
                  ? "bg-[var(--color-institutional)] text-white"
                  : "bg-slate-100 text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {term} anos
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <span className="text-sm text-[var(--color-muted)]">Cuota mensual estimada</span>
          <strong className="text-2xl text-[var(--color-institutional)]">
            {formatMXN(payment.cuota)}
          </strong>
        </div>
        <div className="flex items-center justify-between gap-4 pt-3">
          <span className="text-sm text-[var(--color-muted)]">Total estimado a pagar</span>
          <strong>{formatMXN(payment.total)}</strong>
        </div>
      </div>

      <Button href={`${BRAND.whatsappUrl}&text=${text}`} className="mt-5 w-full">
        Recibir informacion por WhatsApp
      </Button>

      <p className="mt-4 text-center text-xs leading-5 text-[var(--color-muted)]">
        Valores referenciales sujetos a evaluacion, validacion documental y condiciones aplicables.
      </p>
    </div>
  );
}
