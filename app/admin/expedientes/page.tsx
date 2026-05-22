import { RecentActivityPanel } from "@/components/admin/RecentActivity";
import { ToolHeader } from "@/components/admin/ToolHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ExpedientesPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        eyebrow="Firma digital"
        title="Contrato digital sin almacenamiento en nube"
        description="El flujo genera folio, fecha y huella técnica en el navegador. No conserva INE, selfie, firma ni expediente en una base de datos externa."
      >
        <Button href="/firma-contrato">Abrir flujo de firma</Button>
      </ToolHeader>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[#061a44]/10 bg-[#061a44] p-5 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
            Politica operativa
          </p>
          <h2 className="mt-3 text-2xl font-black">Huella temporal de 72 horas</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Cada generación registra una actividad local con folio, fecha y descripción. La
            actividad se muestra en este navegador y se elimina automáticamente después de 72 horas.
          </p>
        </div>

        <Card className="rounded-lg">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-black text-[var(--color-institutional)]">Actividad reciente</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Acciones locales relacionadas con firma, documentos, tablas y contrato manual.
              </p>
            </div>
          </div>
          <RecentActivityPanel />
        </Card>
      </div>
    </div>
  );
}
