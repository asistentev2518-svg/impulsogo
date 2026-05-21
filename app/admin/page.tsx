import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { INSTITUTION } from "@/lib/config";
import { listExpedientes } from "@/lib/expediente";

const tools = [
  { href: "/admin/expedientes", title: "Firma digital / expedientes", desc: "Historial de folios generados." },
  { href: "/admin/contrato-manual", title: "Contrato manual", desc: "Generador imprimible PNG/PDF." },
  { href: "/admin/documentos", title: "Documentos internos", desc: "Aprobación, cancelación, póliza y aviso." },
  { href: "/admin/tablas", title: "Tablas de montos", desc: "Simulación y exportación PNG." },
  { href: "/admin/configuracion", title: "Configuración", desc: "Parámetros institucionales y enlaces." },
];

export default async function AdminDashboardPage() {
  const expedientes = await listExpedientes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-institutional)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Parámetros activos: tasa {INSTITUTION.annualRatePercent}%, plazos{" "}
          {INSTITUTION.allowedTermsYears.join("/")} años, penalización{" "}
          {INSTITUTION.penaltyPercent}%.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full transition hover:border-[var(--color-action)]">
              <h2 className="font-semibold text-[var(--color-institutional)]">{tool.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{tool.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold">Accesos recientes</h2>
        {expedientes.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">Sin expedientes registrados aún.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {expedientes.slice(0, 5).map((item) => (
              <li key={item.folio} className="flex justify-between gap-3 border-b border-slate-100 py-2">
                <span>{item.folio}</span>
                <span className="text-[var(--color-muted)]">{item.createdAtCdmx}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
