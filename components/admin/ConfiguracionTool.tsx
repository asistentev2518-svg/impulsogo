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
};

const defaultConfig: LocalConfig = {
  whatsappUrl: BRAND.whatsappUrl,
  sipresUrl: BRAND.sipresUrl,
  condusefUrl: BRAND.condusefUrl,
  mapsUrl: BRAND.mapsUrl,
  supportPhone: "55 1234 5678",
  legalNote:
    "La consulta del registro en SIPRES verifica la entidad y no implica aprobación de operaciones por parte de CONDUSEF.",
};

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

  function save() {
    localStorage.setItem(KEY, JSON.stringify(config));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="space-y-4">
        <h2 className="font-black text-[var(--color-institutional)]">Enlaces y contacto</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="WhatsApp URL" value={config.whatsappUrl} onChange={(e) => setConfig({ ...config, whatsappUrl: e.target.value })} />
          <Input label="Teléfono soporte" value={config.supportPhone} onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })} />
          <Input label="SIPRES URL" value={config.sipresUrl} onChange={(e) => setConfig({ ...config, sipresUrl: e.target.value })} />
          <Input label="CONDUSEF URL" value={config.condusefUrl} onChange={(e) => setConfig({ ...config, condusefUrl: e.target.value })} />
          <Input label="Google Maps URL" value={config.mapsUrl} onChange={(e) => setConfig({ ...config, mapsUrl: e.target.value })} />
        </div>
        <label className="block text-sm">
          <span className="font-bold text-[var(--color-text)]">Nota legal SIPRES/CONDUSEF</span>
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]"
            rows={4}
            value={config.legalNote}
            onChange={(e) => setConfig({ ...config, legalNote: e.target.value })}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={save}>Guardar configuración local</Button>
          {saved ? <span className="text-sm font-bold text-[var(--color-success)]">Guardado</span> : null}
        </div>
      </Card>

      <Card className="h-max bg-slate-50">
        <h2 className="font-black text-[var(--color-institutional)]">Notas de operación</h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
          <p>Estos valores son no sensibles y se guardan solo en el navegador del administrador.</p>
          <p>Para producción conviene mover esta configuración a una base de datos segura con control de auditoría.</p>
          <p>Las credenciales y secreto de sesión deben vivir en variables de entorno del servidor.</p>
        </div>
      </Card>
    </div>
  );
}
