'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const TASA_ANUAL = 0.07;
const TASA_MENSUAL = TASA_ANUAL / 12;
const PLAZOS = [2, 4, 6, 8] as const;
const MIN = 10000;
const MAX = 250000;
const STEP = 5000;

type Plazo = (typeof PLAZOS)[number];

const fmtMXN = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });

function calcularCuota(monto: number, plazoAnios: number) {
  const plazoMeses = plazoAnios * 12;
  const cuota = (monto * TASA_MENSUAL) / (1 - Math.pow(1 + TASA_MENSUAL, -plazoMeses));
  return Math.round(cuota * 100) / 100;
}

type Fila = { mes: number; cuota: number; interes: number; capital: number; saldo: number };

function tablaAmortizacion(monto: number, plazoAnios: number, cuota: number): Fila[] {
  const meses = plazoAnios * 12;
  const filas: Fila[] = [];
  let saldo = monto;
  for (let mes = 1; mes <= meses; mes++) {
    const interes = saldo * TASA_MENSUAL;
    let capital = cuota - interes;
    let nuevoSaldo = saldo - capital;
    if (mes === meses) {
      // Ajuste final para cerrar en 0
      capital += nuevoSaldo;
      nuevoSaldo = 0;
    }
    filas.push({
      mes,
      cuota: Math.round(cuota * 100) / 100,
      interes: Math.round(interes * 100) / 100,
      capital: Math.round(capital * 100) / 100,
      saldo: Math.max(0, Math.round(nuevoSaldo * 100) / 100),
    });
    saldo = nuevoSaldo;
  }
  return filas;
}

function useCuotaAnimada(target: number) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const duration = 500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setValue(target);
        fromRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

export default function Simulator() {
  const [monto, setMonto] = useState(100000);
  const [plazo, setPlazo] = useState<Plazo>(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cuota = useMemo(() => calcularCuota(monto, plazo), [monto, plazo]);
  const cuotaAnim = useCuotaAnimada(cuota);

  const totalPagado = cuota * plazo * 12;
  const interesTotal = Math.max(0, totalPagado - monto);
  const pctInteres = totalPagado > 0 ? (interesTotal / totalPagado) * 100 : 0;
  const pctCapital = 100 - pctInteres;

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 4, y: px * 4 });
  };

  const descargarPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const left = 48;
    let y = 56;

    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('IMPULSO GO', left, y);
    doc.setFontSize(10);
    doc.setTextColor(100);
    y += 18;
    doc.text('S.A. de C.V., SOFOM, E.N.R.', left, y);
    y += 14;
    doc.text('Cotización de financiamiento (referencial)', left, y);

    y += 28;
    doc.setDrawColor(220);
    doc.line(left, y, 547, y);

    y += 28;
    doc.setFontSize(12);
    doc.setTextColor(20);
    const filas: [string, string][] = [
      ['Monto a financiar', fmtMXN(monto)],
      ['Plazo', `${plazo} años (${plazo * 12} meses)`],
      ['Tasa anual fija', '7.00%'],
      ['Cuota mensual estimada', fmtMXN(cuota)],
      ['Total a pagar', fmtMXN(totalPagado)],
      ['Intereses totales', fmtMXN(interesTotal)],
    ];
    filas.forEach(([k, v]) => {
      doc.setTextColor(100);
      doc.text(k, left, y);
      doc.setTextColor(20);
      doc.text(v, 547, y, { align: 'right' });
      y += 24;
    });

    y += 12;
    doc.setDrawColor(220);
    doc.line(left, y, 547, y);
    y += 22;
    doc.setFontSize(8);
    doc.setTextColor(130);
    const disclaimer =
      'Valores referenciales sujetos a evaluación crediticia. Costo Anual Total (CAT) promedio 7.5% sin IVA. ' +
      'Esta cotización no representa una oferta vinculante ni garantiza la aprobación del crédito.';
    doc.text(doc.splitTextToSize(disclaimer, 499), left, y);

    y += 48;
    doc.setTextColor(150);
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-MX')} · wa.me/525547823544`,
      left,
      y
    );

    doc.save(`cotizacion-impulso-go-${monto}-${plazo}a.pdf`);
  };

  const filasTabla = useMemo(
    () => (modalOpen ? tablaAmortizacion(monto, plazo, cuota) : []),
    [modalOpen, monto, plazo, cuota]
  );

  return (
    <section id="simulador" className="bg-gray-50 px-4 py-20 dark:bg-[#111827] lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
          Simula tu crédito
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
          Tasa <span className="font-semibold text-blue-500">7.00% anual fija</span>. Ajusta el monto y el plazo.
        </p>

        <div
          onMouseMove={handleTilt}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 150ms ease-out',
          }}
          className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800 lg:p-8"
        >
          {/* Monto */}
          <label htmlFor="monto" className="text-sm text-gray-500 dark:text-gray-400">
            Monto a financiar
          </label>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{fmtMXN(monto)}</span>
            <span className="text-xs text-gray-400">
              {fmtMXN(MIN)} – {fmtMXN(MAX)}
            </span>
          </div>
          <input
            id="monto"
            type="range"
            className="amount-slider mt-4 w-full"
            min={MIN}
            max={MAX}
            step={STEP}
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
          />

          {/* Plazo */}
          <div className="mt-8">
            <span className="text-sm text-gray-500 dark:text-gray-400">Plazo</span>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {PLAZOS.map((p) => {
                const active = p === plazo;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlazo(p)}
                    aria-pressed={active}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {p} años
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resultado + donut */}
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cuota mensual estimada</p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white">{fmtMXN(cuotaAnim)}</p>
              <p className="mt-1 text-xs text-gray-400">a {plazo} años · 7.00% anual fija</p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative h-[120px] w-[120px] rounded-full"
                style={{
                  background: `conic-gradient(#3b82f6 0% ${pctCapital}%, #06b6d4 ${pctCapital}% 100%)`,
                  transition: 'background 400ms ease',
                }}
                role="img"
                aria-label={`Capital ${pctCapital.toFixed(0)}%, intereses ${pctInteres.toFixed(0)}%`}
              >
                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white dark:bg-gray-800">
                  <span className="text-xs text-gray-400">Intereses</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {pctInteres.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-xs">
                <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Capital
                </p>
                <p className="mt-1 flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" /> Intereses
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Ver tabla de amortización
            </button>
            <button
              type="button"
              onClick={descargarPDF}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-500"
            >
              Descargar cotización PDF
            </button>
          </div>

          <p className="mt-6 flex items-start gap-2 text-xs text-gray-400">
            <span aria-hidden="true">⚠️</span>
            <span>
              Valores referenciales sujetos a evaluación crediticia. Costo Anual Total (CAT) promedio 7.5% sin IVA.
            </span>
          </p>
        </div>
      </div>

      {/* Modal tabla amortizacion */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Tabla de amortización"
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 p-5">
              <div>
                <h3 className="text-lg font-bold text-white">Tabla de amortización</h3>
                <p className="text-xs text-gray-400">
                  {fmtMXN(monto)} · {plazo} años · cuota {fmtMXN(cuota)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-800 text-gray-300">
                  <tr>
                    <th className="px-4 py-2 font-medium">Mes</th>
                    <th className="px-4 py-2 text-right font-medium">Cuota</th>
                    <th className="px-4 py-2 text-right font-medium">Interés</th>
                    <th className="px-4 py-2 text-right font-medium">Capital</th>
                    <th className="px-4 py-2 text-right font-medium">Saldo</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {filasTabla.map((f) => (
                    <tr key={f.mes} className="border-t border-gray-800">
                      <td className="px-4 py-2">{f.mes}</td>
                      <td className="px-4 py-2 text-right">{fmtMXN(f.cuota)}</td>
                      <td className="px-4 py-2 text-right">{fmtMXN(f.interes)}</td>
                      <td className="px-4 py-2 text-right">{fmtMXN(f.capital)}</td>
                      <td className="px-4 py-2 text-right">{fmtMXN(f.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
