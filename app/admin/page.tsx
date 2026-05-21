import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { INSTITUTION } from "@/lib/config";
import { listExpedientes } from "@/lib/expediente";

const tools = [
  {
    href: "/admin/expedientes",
    title: "Firma digital / expedientes",
    desc: "Consulta folios generados, hashes y estado de validación.",
  },
  {
    href: "/admin/contrato-manual",
    title: "Contrato manual",
    desc: "Genera el contrato imprimible en tres páginas PNG/PDF.",
  },
  {
    href: "/admin/documentos",
    title: "Documentos internos",
    desc: "Aprobación, cancelación, póliza y aviso para WhatsApp.",
  },
  {
    href: "/admin/tablas",
    title: "Tablas de montos",
    desc: "Simulación de cuotas y exportación visual para clientes.",
  },
  {
    href: "/admin/configuracion",
    title: "Configuración",
    desc: "Parámetros institucionales, enlaces y valores base.",
  },
];

export default async function AdminDashboardPage() {
  const expedientes = await listExpedientes();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-[#061a44] p-6 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
          Panel interno
        </p>
        <h1 className="mt-3 text-3xl font-black">Centro de operación Impulso Go</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
          Herramientas de trabajo para expedientes, contratos, documentos de WhatsApp y tablas de
          simulación. Mantén la firma digital fuera de la navegación pública y compártela solo por
          canal directo cuando corresponda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-lg">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Tasa</p>
          <p className="mt-2 text-3xl font-black text-[var(--color-institutional)]">
            {INSTITUTION.annualRatePercent}%
          </p>
          <p className="text-xs text-[var(--color-muted)]">Anual fija</p>
        </Card>
        <Card className="rounded-lg">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Plazos</p>
          <p className="mt-2 text-3xl font-black text-[var(--color-institutional)]">
            {INSTITUTION.allowedTermsYears.join("/")}
          </p>
          <p className="text-xs text-[var(--color-muted)]">Años permitidos</p>
        </Card>
        <Card className="rounded-lg">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Penalización
          </p>
          <p className="mt-2 text-3xl font-black text-[var(--color-danger)]">
            {INSTITUTION.penaltyPercent}%
          </p>
          <p className="text-xs text-[var(--color-muted)]">Cancelación</p>
        </Card>
        <Card className="rounded-lg">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Expedientes
          </p>
          <p className="mt-2 text-3xl font-black text-[var(--color-institutional)]">
            {expedientes.length}
          </p>
          <p className="text-xs text-[var(--color-muted)]">Registrados</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full rounded-lg transition hover:-translate-y-0.5 hover:border-[var(--color-action)] hover:shadow-md">
              <h2 className="font-black text-[var(--color-institutional)]">{tool.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{tool.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="rounded-lg">
        <h2 className="font-black text-[var(--color-institutional)]">Actividad reciente</h2>
        {expedientes.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">Sin expedientes registrados aún.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {expedientes.slice(0, 5).map((item) => (
              <li key={item.folio} className="flex justify-between gap-3 border-b border-slate-100 py-2">
                <span className="font-semibold">{item.folio}</span>
                <span className="text-[var(--color-muted)]">{item.createdAtCdmx}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
