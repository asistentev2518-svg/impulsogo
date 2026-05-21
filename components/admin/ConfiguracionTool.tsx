"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/config";

const KEY = "impulso:config";

export function ConfiguracionTool() {
  const [config, setConfig] = useState<{
    whatsappUrl: string;
    sipresUrl: string;
    condusefUrl: string;
    mapsUrl: string;
    supportPhone: string;
    legalNote: string;
  }>({
    whatsappUrl: BRAND.whatsappUrl,
    sipresUrl: BRAND.sipresUrl,
    condusefUrl: BRAND.condusefUrl,
    mapsUrl: BRAND.mapsUrl,
    supportPhone: "55 1234 5678",
    legalNote:
      "La consulta del registro en SIPRES verifica la entidad y no implica aprobación de operaciones por parte de CONDUSEF.",
  });

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setConfig(JSON.parse(saved) as typeof config);
  }, []);

  function save() {
    localStorage.setItem(KEY, JSON.stringify(config));
  }

  return (
    <Card className="space-y-4">
      <h2 className="font-semibold text-[var(--color-institutional)]">Parámetros institucionales</h2>
      <Input label="WhatsApp URL" value={config.whatsappUrl} onChange={(e) => setConfig({ ...config, whatsappUrl: e.target.value })} />
      <Input label="SIPRES URL" value={config.sipresUrl} onChange={(e) => setConfig({ ...config, sipresUrl: e.target.value })} />
      <Input label="CONDUSEF URL" value={config.condusefUrl} onChange={(e) => setConfig({ ...config, condusefUrl: e.target.value })} />
      <Input label="Google Maps URL" value={config.mapsUrl} onChange={(e) => setConfig({ ...config, mapsUrl: e.target.value })} />
      <Input label="Teléfono soporte" value={config.supportPhone} onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })} />
      <label className="text-sm">
        Nota legal SIPRES/CONDUSEF
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
          rows={4}
          value={config.legalNote}
          onChange={(e) => setConfig({ ...config, legalNote: e.target.value })}
        />
      </label>
      <Button onClick={save}>Guardar configuración local</Button>
      <p className="text-xs text-[var(--color-muted)]">
        MVP: configuración no sensible en localStorage del navegador. Migrar a backend para
        producción.
      </p>
    </Card>
  );
}
