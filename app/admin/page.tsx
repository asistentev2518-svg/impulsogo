import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricTile } from "@/components/admin/ToolHeader";
import { INSTITUTION } from "@/lib/config";
import { formatCdmxDateTime } from "@/lib/datetime";
import { listExpedientes } from "@/lib/expediente";

const tools = [
  {
    href: "/admin/expedientes",
    title: "Firma digital / expedientes",
    desc: "Consulta folios generados, hashes y estado de validación pública.",
    action: "Revisar folios",
  },
  {
    href: "/admin/contrato-manual",
    title: "Contrato manual",
    desc: "Genera el contrato imprimible en tres páginas PNG/PDF.",
    action: "Crear contrato",
  },
  {
    href: "/admin/documentos",
    title: "Documentos internos",
    desc: "Aprobación, cancelación, póliza y aviso para WhatsApp.",
    action: "Generar PNG",
  },
  {
    href: "/admin/tablas",
    title: "Tablas de montos",
    desc: "Simulación de cuotas y exportación visual para clientes.",
    action: "Simular monto",
  },
  {
    href: "/admin/configuracion",
    title: "Configuración",
    desc: "Parámetros institucionales, enlaces y valores base.",
    action: "Ajustar datos",
  },
];

export default async function AdminDashboardPage() {
  const expedientes = await listExpedientes();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-[#061a44] text-white shadow-sm">
        <div className="panel-grid p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                Panel interno
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Centro de operación Impulso Go
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
                Herramientas para contratos, expedientes, documentos de WhatsApp y tablas de
                simulación. La firma digital existe por enlace directo y no se promociona en la
                navegación pública.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/8 p-4 text-sm">
              <p className="text-white/55">Fecha CDMX</p>
              <p className="mt-1 font-bold">{formatCdmxDateTime()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricTile label="Tasa anual fija" value={`${INSTITUTION.annualRatePercent}%`} />
        <MetricTile label="Plazos" value={INSTITUTION.allowedTermsYears.join("/")} />
        <MetricTile label="Penalización" value={`${INSTITUTION.penaltyPercent}%`} tone="danger" />
        <MetricTile label="Expedientes" value={String(expedientes.length)} tone="success" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="block">
            <Card className="h-full rounded-lg transition hover:-translate-y-0.5 hover:border-[var(--color-action)] hover:shadow-md">
              <h2 className="font-black text-[var(--color-institutional)]">{tool.title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--color-muted)]">{tool.desc}</p>
              <p className="mt-5 text-sm font-black text-[var(--color-action)]">{tool.action}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="rounded-lg">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-black text-[var(--color-institutional)]">Actividad reciente</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Últimos expedientes generados para validación pública.
            </p>
          </div>
          <Button href="/admin/expedientes" variant="secondary">
            Ver expedientes
          </Button>
        </div>
        {expedientes.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-[var(--color-muted)]">
            Sin expedientes registrados aún.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {expedientes.slice(0, 5).map((item) => (
              <li key={item.folio} className="flex flex-wrap justify-between gap-3 py-3">
                <span className="font-bold text-[var(--color-institutional)]">{item.folio}</span>
                <span className="text-[var(--color-muted)]">{item.createdAtCdmx}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
