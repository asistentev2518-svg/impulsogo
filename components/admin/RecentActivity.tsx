"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  clearRecentActivity,
  getRecentActivity,
  type ActivityKind,
  type ActivityRecord,
} from "@/lib/activity";

const tone: Record<ActivityKind, string> = {
  contrato_digital: "bg-blue-50 text-blue-700",
  contrato_manual: "bg-indigo-50 text-indigo-700",
  documento: "bg-emerald-50 text-emerald-700",
  tabla: "bg-amber-50 text-amber-700",
  configuracion: "bg-slate-100 text-slate-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function RecentActivityPanel() {
  const [records, setRecords] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    const refresh = () => setRecords(getRecentActivity());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("impulso:activity", refresh);
    const interval = window.setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("impulso:activity", refresh);
      window.clearInterval(interval);
    };
  }, []);

  if (records.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-[var(--color-muted)]">
        Sin actividad reciente en este navegador. Las acciones se muestran aqui durante 72 horas y
        despues se limpian automaticamente.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <ul className="divide-y divide-slate-100 text-sm">
        {records.slice(0, 8).map((record) => (
          <li key={record.id} className="grid gap-2 py-3 sm:grid-cols-[108px_1fr_auto] sm:items-start">
            <span className={`w-max rounded-md px-2 py-1 text-[10px] font-black uppercase ${tone[record.kind]}`}>
              {record.kind.replace("_", " ")}
            </span>
            <span>
              <span className="block font-black text-[var(--color-institutional)]">{record.title}</span>
              <span className="mt-0.5 block text-xs leading-5 text-[var(--color-muted)]">{record.detail}</span>
            </span>
            <span className="text-xs font-bold text-slate-400">{formatDate(record.createdAt)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            clearRecentActivity();
            setRecords([]);
          }}
          className="min-h-9 px-3 py-2 text-xs"
        >
          Limpiar actividad
        </Button>
      </div>
    </div>
  );
}
