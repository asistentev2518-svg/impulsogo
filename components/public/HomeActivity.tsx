"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMXN } from "@/lib/finance";

type ProcessStatus = "Aprobado" | "En revisión" | "En proceso" | "Preaprobado";

type ProcessCase = {
  caseId: string;
  amount: number;
  termYears: number;
  profile: string;
  time: string;
  location: string;
  initials: string;
};

const BASE_CLIENT_COUNT = 58758;
const BASE_DATE = "2026-05-22";

const statusPool: ProcessStatus[] = [
  "Aprobado",
  "Aprobado",
  "Preaprobado",
  "En revisión",
  "En proceso",
];

const processCases: ProcessCase[] = [
  {
    caseId: "IG-2026-00421",
    amount: 25000,
    termYears: 4,
    profile: "Trabajador independiente",
    time: "4 horas",
    location: "Ciudad de México",
    initials: "J.P.",
  },
  {
    caseId: "IG-2026-00813",
    amount: 60000,
    termYears: 4,
    profile: "Empleado",
    time: "4 horas",
    location: "Monterrey",
    initials: "M.L.",
  },
  {
    caseId: "IG-2026-00297",
    amount: 80000,
    termYears: 6,
    profile: "PyME",
    time: "5 horas",
    location: "Guadalajara",
    initials: "R.G.",
  },
  {
    caseId: "IG-2026-01054",
    amount: 45000,
    termYears: 4,
    profile: "Profesional",
    time: "3 horas",
    location: "Puebla",
    initials: "A.S.",
  },
  {
    caseId: "IG-2026-01187",
    amount: 120000,
    termYears: 6,
    profile: "Empleado",
    time: "6 horas",
    location: "Ciudad de México",
    initials: "C.H.",
  },
  {
    caseId: "IG-2026-01342",
    amount: 200000,
    termYears: 8,
    profile: "PyME",
    time: "7 horas",
    location: "Monterrey",
    initials: "F.V.",
  },
  {
    caseId: "IG-2026-01509",
    amount: 35000,
    termYears: 2,
    profile: "Trabajador independiente",
    time: "4 horas",
    location: "Guadalajara",
    initials: "L.M.",
  },
  {
    caseId: "IG-2026-01678",
    amount: 90000,
    termYears: 6,
    profile: "Profesional",
    time: "5 horas",
    location: "Ciudad de México",
    initials: "D.R.",
  },
  {
    caseId: "IG-2026-01821",
    amount: 50000,
    termYears: 4,
    profile: "Empleado",
    time: "4 horas",
    location: "Puebla",
    initials: "K.T.",
  },
];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayIndex(date: Date) {
  const [baseYear, baseMonth, baseDay] = BASE_DATE.split("-").map(Number);
  const base = new Date(baseYear, baseMonth - 1, baseDay).getTime();
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.max(0, Math.floor((current - base) / 86_400_000));
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function dailyIncrement(index: number) {
  return 30 + (hashString(`impulso-clientes-${index}`) % 21);
}

function buildClientCount(date: Date) {
  const days = dayIndex(date);
  let total = BASE_CLIENT_COUNT;
  for (let index = 1; index <= days; index += 1) {
    total += dailyIncrement(index);
  }
  return total;
}

function statusFor(caseId: string, key: string) {
  return statusPool[hashString(`${key}-${caseId}`) % statusPool.length];
}

function statusClass(status: ProcessStatus) {
  if (status === "Aprobado") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "Preaprobado") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (status === "En revisión") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function buildActivity(date: Date) {
  const key = dateKey(date);
  return {
    count: buildClientCount(date),
    key,
    cases: processCases.map((item) => ({ ...item, status: statusFor(item.caseId, key) })),
  };
}

function useDailyActivity() {
  const fallback = useMemo(() => buildActivity(new Date(`${BASE_DATE}T12:00:00`)), []);
  const [activity, setActivity] = useState(fallback);

  useEffect(() => {
    const timer = window.setTimeout(() => setActivity(buildActivity(new Date())), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return activity;
}

export function HomeActivity() {
  const activity = useDailyActivity();
  const [displayCount, setDisplayCount] = useState(activity.count);

  useEffect(() => {
    let frame = 0;
    const start = Math.max(BASE_CLIENT_COUNT, activity.count - 180);
    const end = activity.count;
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / 950);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(start + (end - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activity.count]);

  return (
    <section id="casos" className="border-y border-slate-200 bg-[#f3f7fc]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
            Registro operativo
          </p>
          <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
            Procesos recientes registrados
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Ejemplos referenciales de solicitudes atendidas. Cada caso se evalúa de forma individual
            y el estado puede cambiar conforme avanza la validación.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activity.cases.map((item) => (
            <article
              key={item.caseId}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <p className="font-mono text-xs font-bold text-[var(--color-institutional)]">
                  Caso: {item.caseId}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${statusClass(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Monto solicitado
                </p>
                <p className="mt-2 text-3xl font-black text-[var(--color-institutional)]">
                  {formatMXN(item.amount)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Plazo: <strong>{item.termYears} años</strong>
                </p>
              </div>
              <dl className="grid gap-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Perfil</dt>
                  <dd className="text-right font-semibold text-slate-700">{item.profile}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Tiempo de proceso</dt>
                  <dd className="font-semibold text-slate-700">{item.time}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Ubicación</dt>
                  <dd className="text-right font-semibold text-slate-700">{item.location}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Iniciales</dt>
                  <dd className="font-semibold text-slate-700">{item.initials}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[0.75fr_1.25fr] md:items-center">
          <div className="text-center md:text-left">
            <p className="text-5xl font-black tracking-tight text-[var(--color-success)]">
              +{new Intl.NumberFormat("es-MX").format(displayCount)}
            </p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--color-institutional)]">
              clientes satisfechos
            </p>
          </div>
          <p className="text-sm leading-7 text-slate-600">
            El volumen mostrado acompaña el crecimiento operativo diario. Los procesos publicados son
            ejemplos referenciales y pueden variar por análisis, documentación y validaciones internas.
          </p>
        </div>
      </div>
    </section>
  );
}
