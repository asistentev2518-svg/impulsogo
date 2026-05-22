"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  clearRecentActivity,
  getRecentActivity,
  type ActivityKind,
  type ActivityRecord,
} from "@/lib/activity";

const kindConfig: Record<ActivityKind, { bg: string; text: string; border: string; icon: string }> = {
  contrato_digital: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    icon: "signature"
  },
  contrato_manual: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: "document"
  },
  documento: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    icon: "folder"
  },
  tabla: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    icon: "table"
  },
  configuracion: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: "settings"
  },
};

const icons: Record<string, React.ReactNode> = {
  signature: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
  document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  folder: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
  table: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
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

function formatTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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
      <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Sin actividad reciente</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Las acciones se muestran aquí durante 72 horas.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <ul className="space-y-2">
        {records.slice(0, 10).map((record, index) => {
          const config = kindConfig[record.kind];
          return (
            <li
              key={record.id}
              className="group rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-sm"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.border} border`}>
                  <svg className={`h-5 w-5 ${config.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icons[config.icon]}
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--color-institutional)]">
                        {record.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                        {record.detail}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-[var(--color-text)]">
                        {formatDate(record.createdAt)}
                      </p>
                      <p className="text-[10px] text-[var(--color-muted)]">
                        {formatTime(record.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${config.bg} ${config.text}`}>
                      {record.kind.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end pt-2">
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
