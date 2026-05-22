"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/config";

const KEY = "impulso:config";

type LocalConfig = {
  whatsappUrl: string;
  sipresUrl: string;
  condusefUrl: string;
  mapsUrl: string;
  supportPhone: string;
  legalNote: string;
  heroTitle: string;
  heroCopy: string;
  simulatorTitle: string;
  simulatorCopy: string;
  processInfoTitle: string;
  processInfoBody: string;
  securityCopy: string;
  clientCounterBase: string;
  recentProcessesIntro: string;
};

const defaultConfig: LocalConfig = {
  whatsappUrl: BRAND.whatsappUrl,
  sipresUrl: BRAND.sipresUrl,
  condusefUrl: BRAND.condusefUrl,
  mapsUrl: BRAND.mapsUrl,
  supportPhone: BRAND.whatsappDisplay,
  legalNote:
    "La consulta del registro en SIPRES verifica la entidad y no implica aprobación de operaciones por parte de CONDUSEF.",
  heroTitle: "Financiamiento formal, contrato firmado y expediente trazable",
  heroCopy:
    "Proceso documentado de extremo a extremo: validación de identidad, contrato electrónico con cláusulas completas, firma con folio, hash y QR de verificación.",
  simulatorTitle: "Tasa, plazo y cuota visibles antes de avanzar.",
  simulatorCopy:
    "El cliente puede estimar su cuota antes de formalizar. El proceso evita dejar condiciones importantes escondidas o pendientes.",
  processInfoTitle: "Transparencia antes de cualquier decisión.",
  processInfoBody:
    "En algunos casos, como parte de la validación, puede contemplarse una póliza administrativa de respaldo, informada previamente al cliente antes de continuar.",
  securityCopy:
    "La información se maneja con controles de confidencialidad, resguardo documental y acceso interno controlado.",
  clientCounterBase: "58758",
  recentProcessesIntro:
    "Ejemplos referenciales de solicitudes atendidas. Cada caso se evalúa de forma individual.",
};

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-bold text-[var(--color-text)]">{label}</span>
      <textarea
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function ConfiguracionTool() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<LocalConfig>(() => {
    if (typeof window === "undefined") return defaultConfig;
    try {
      const stored = window.localStorage.getItem(KEY);
      return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  function update<K extends keyof LocalConfig>(key: K, value: LocalConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(config));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function reset() {
    setConfig(defaultConfig);
    localStorage.removeItem(KEY);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <Card className="space-y-4 rounded-lg">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
              Sitio público
            </p>
            <h2 className="mt-2 font-black text-[var(--color-institutional)]">
              Textos principales del inicio
            </h2>
          </div>
          <Input label="Título hero" value={config.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
          <TextArea label="Texto hero" value={config.heroCopy} onChange={(value) => update("heroCopy", value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Título simulador"
              value={config.simulatorTitle}
              onChange={(e) => update("simulatorTitle", e.target.value)}
            />
            <Input
              label="Base clientes satisfechos"
              value={config.clientCounterBase}
              onChange={(e) => update("clientCounterBase", e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <TextArea
            label="Texto simulador"
            value={config.simulatorCopy}
            onChange={(value) => update("simulatorCopy", value)}
          />
          <TextArea
            label="Introducción procesos recientes"
            value={config.recentProcessesIntro}
            onChange={(value) => update("recentProcessesIntro", value)}
          />
          <Input
            label="Título información adicional"
            value={config.processInfoTitle}
            onChange={(e) => update("processInfoTitle", e.target.value)}
          />
          <TextArea
            label="Texto información adicional"
            value={config.processInfoBody}
            onChange={(value) => update("processInfoBody", value)}
          />
          <TextArea
            label="Texto seguridad/confidencialidad"
            value={config.securityCopy}
            onChange={(value) => update("securityCopy", value)}
          />
        </Card>

        <Card className="space-y-4 rounded-lg">
          <h2 className="font-black text-[var(--color-institutional)]">Enlaces y contacto</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="WhatsApp URL" value={config.whatsappUrl} onChange={(e) => update("whatsappUrl", e.target.value)} />
            <Input label="Teléfono soporte" value={config.supportPhone} onChange={(e) => update("supportPhone", e.target.value)} />
            <Input label="SIPRES URL" value={config.sipresUrl} onChange={(e) => update("sipresUrl", e.target.value)} />
            <Input label="CONDUSEF URL" value={config.condusefUrl} onChange={(e) => update("condusefUrl", e.target.value)} />
            <Input label="Google Maps URL" value={config.mapsUrl} onChange={(e) => update("mapsUrl", e.target.value)} />
          </div>
          <TextArea
            label="Nota legal SIPRES/CONDUSEF"
            value={config.legalNote}
            onChange={(value) => update("legalNote", value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={save}>Guardar configuración local</Button>
            <Button variant="secondary" onClick={reset}>Restaurar base</Button>
            {saved ? <span className="text-sm font-bold text-[var(--color-success)]">Guardado</span> : null}
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="h-max rounded-lg bg-slate-50">
          <h2 className="font-black text-[var(--color-institutional)]">Vista de control</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-[var(--color-muted)]">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">Hero</p>
              <p className="mt-2 font-black text-[var(--color-institutional)]">{config.heroTitle}</p>
              <p className="mt-1 text-xs">{config.heroCopy}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">Procesos</p>
              <p className="mt-2 text-3xl font-black text-[var(--color-success)]">
                +{Number(config.clientCounterBase || 0).toLocaleString("es-MX")}
              </p>
              <p className="mt-1 text-xs">{config.recentProcessesIntro}</p>
            </div>
          </div>
        </Card>

        <Card className="h-max rounded-lg">
          <h2 className="font-black text-[var(--color-institutional)]">Notas de operación</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            <p>Estos valores son no sensibles y se guardan solo en el navegador del administrador.</p>
            <p>Para que cambien el sitio público de todos los clientes se requiere persistencia central, como base de datos o CMS seguro.</p>
            <p>Las credenciales y secreto de sesión deben vivir en variables de entorno del servidor.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
