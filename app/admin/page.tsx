import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricTile } from "@/components/admin/ToolHeader";
import { RecentActivityPanel } from "@/components/admin/RecentActivity";
import { INSTITUTION } from "@/lib/config";
import { formatCdmxDateTime } from "@/lib/datetime";

const tools = [
  {
    href: "/admin/expedientes",
    title: "Firma digital",
    desc: "Genera contratos digitales con folio, fecha y huella técnica sin almacenamiento en nube.",
    action: "Abrir firma",
    code: "DIGITAL",
    metric: "Folio + huella",
    tone: "blue",
  },
  {
    href: "/admin/contrato-manual",
    title: "Contrato manual",
    desc: "Genera el contrato imprimible en tres páginas PNG/PDF.",
    action: "Crear contrato",
    code: "PDF/PNG",
    metric: "3 páginas",
    tone: "navy",
  },
  {
    href: "/admin/documentos",
    title: "Documentos internos",
    desc: "Aprobación, cancelación, póliza y aviso en formato PNG vertical.",
    action: "Generar PNG",
    code: "DOCUMENTOS",
    metric: "1080 x 1350",
    tone: "green",
  },
  {
    href: "/admin/tablas",
    title: "Tablas de montos",
    desc: "Simulación de cuotas y exportación visual para clientes.",
    action: "Simular monto",
    code: "SIMULADOR",
    metric: "2/4/6/8 años",
    tone: "amber",
  },
  {
    href: "/admin/configuracion",
    title: "Configuración",
    desc: "Parámetros institucionales, enlaces y contenido visible del inicio.",
    action: "Ajustar datos",
    code: "CONTROL",
    metric: "Sitio público",
    tone: "slate",
  },
];

const workflow = [
  ["01", "Captura", "Recibe datos, monto, plazo y documentos iniciales."],
  ["02", "Valida", "Confirma identidad, coherencia del expediente y condiciones."],
  ["03", "Genera", "Exporta contrato, documentos o tabla comercial según el caso."],
  ["04", "Entrega", "Descarga el material y registra actividad local por 72 horas."],
];

const toneClass: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  navy: "bg-[#eef4ff] text-[var(--color-institutional)] ring-blue-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-[#061a44] text-white shadow-sm">
        <div className="panel-grid relative p-6">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-[96px] bg-[#1266D6]/20" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                Panel interno
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                Centro de operación Impulso Go
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                Herramientas internas para contratos, documentos, tablas de simulación y actividad
                operativa local. La firma digital queda fuera de la navegación pública y se conserva
                como enlace discreto.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/admin/contrato-manual" className="bg-white !text-[#061a44] hover:bg-blue-50">
                  Generar contrato
                </Button>
                <Button href="/admin/tablas" className="border border-white/20 bg-white/10 hover:bg-white/15">
                  Crear tabla
                </Button>
                <Button href="/admin/configuracion" className="border border-white/20 bg-white/10 hover:bg-white/15">
                  Configurar sitio
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-white/8 p-4 text-sm backdrop-blur">
                <p className="text-white/55">Fecha CDMX</p>
                <p className="mt-1 font-bold">{formatCdmxDateTime()}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/8 p-4 text-sm backdrop-blur">
                <p className="text-white/55">Estado operativo</p>
                <p className="mt-1 font-bold text-emerald-200">Herramientas listas</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/8 p-4 text-sm backdrop-blur sm:col-span-2">
                <p className="text-white/55">Prioridad del día</p>
                <p className="mt-1 font-bold">
                  Generar materiales claros y mantener actividad local revisada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricTile label="Tasa anual fija" value={`${INSTITUTION.annualRatePercent}%`} />
        <MetricTile label="Plazos activos" value={INSTITUTION.allowedTermsYears.join("/")} />
        <MetricTile label="Penalización" value={`${INSTITUTION.penaltyPercent}%`} tone="danger" />
        <MetricTile label="Actividad" value="72h" tone="success" />
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-lg">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
                Herramientas
              </p>
              <h2 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
                Módulos operativos
              </h2>
            </div>
            <Button href="/admin/configuracion" variant="secondary">
              Ajustes
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="block">
                <div className="h-full rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-action)] hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <p
                      className={`rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ${
                        toneClass[tool.tone]
                      }`}
                    >
                      {tool.code}
                    </p>
                    <p className="text-right text-xs font-bold text-[var(--color-muted)]">
                      {tool.metric}
                    </p>
                  </div>
                  <h3 className="mt-5 font-black text-[var(--color-institutional)]">
                    {tool.title}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--color-muted)]">
                    {tool.desc}
                  </p>
                  <p className="mt-5 text-sm font-black text-[var(--color-action)]">{tool.action}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
              Flujo recomendado
            </p>
            <h2 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
              Operación documental
            </h2>
            <div className="mt-5 space-y-3">
              {workflow.map(([number, title, text]) => (
                <div key={number} className="grid grid-cols-[42px_1fr] gap-3 rounded-lg bg-slate-50 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-institutional)] text-xs font-black text-white">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-black text-[var(--color-text)]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-lg">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
              <h2 className="font-black text-[var(--color-institutional)]">Actividad reciente</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Acciones realizadas en este navegador. Se borran automaticamente despues de 72 horas.
                </p>
              </div>
              <Button href="/firma-contrato" variant="secondary">
                Firma digital
              </Button>
            </div>
            <RecentActivityPanel />
          </Card>
        </div>
      </section>
    </div>
  );
}
