import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

const trustBlocks = [
  {
    title: "Registro consultable",
    text: "Información institucional verificable en los portales públicos correspondientes. La consulta no implica aprobación automática de operaciones.",
  },
  {
    title: "Contrato completo",
    text: "Documentación con cláusulas completas, aceptación expresa, folio, hash y QR de verificación cuando el trámite se formaliza.",
  },
  {
    title: "Tasa clara",
    text: "Simulaciones con tasa anual ordinaria fija del 7%. Valores referenciales sujetos a evaluación crediticia.",
  },
  {
    title: "Identidad validada",
    text: "Proceso preparado para integrar INE por ambos lados, selfie y evidencia técnica del consentimiento.",
  },
];

const processSteps = [
  "Atención y prevalidación",
  "Integración de datos",
  "Validación documental",
  "Revisión de condiciones",
  "Formalización trazable",
];

const faqs = [
  {
    q: "¿La simulación garantiza aprobación?",
    a: "No. Los montos son referenciales y todo financiamiento queda sujeto a evaluación crediticia y validación documental.",
  },
  {
    q: "¿Dónde se valida la entidad?",
    a: "Se puede consultar información pública en SIPRES/CONDUSEF. La consulta verifica datos de registro y no equivale a aprobación de operaciones.",
  },
  {
    q: "¿Por qué se solicita evidencia de identidad?",
    a: "Para prevenir suplantación, documentar consentimiento y conservar un expediente trazable cuando se formaliza el contrato.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-[#f7fbff]">
        <div className="absolute inset-x-0 top-0 h-32 bg-white" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-action)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
              {INSTITUTION.legalName}
            </div>
            <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-tight text-[var(--color-institutional)] md:text-6xl">
              Financiamiento formal con expediente documentado.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{BRAND.subtagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={BRAND.whatsappUrl}>Hablar por WhatsApp</Button>
              <Button href={BRAND.sipresUrl} variant="secondary">
                Consultar registro
              </Button>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="p-4">
                <p className="text-2xl font-black text-[var(--color-institutional)]">7%</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Tasa anual fija</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black text-[var(--color-institutional)]">2-8</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Años de plazo</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black text-[var(--color-institutional)]">QR</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Validación documental</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 top-10 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
              <Image
                src={ASSETS.confianza}
                alt="Respaldo institucional Impulso Go"
                width={960}
                height={620}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="grid gap-3 border-t border-slate-200 bg-white p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Domicilio
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-institutional)]">
                    Benito Juárez, Ciudad de México
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Expediente
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-institutional)]">
                    Folio, hash y trazabilidad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="respaldo" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
              Respaldo y claridad
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--color-institutional)]">
              Una experiencia pensada para generar confianza.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            El sitio público informa, orienta y canaliza. Los enlaces sensibles, como la firma de
            contrato, se comparten directamente al cliente cuando corresponde.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustBlocks.map((block) => (
            <Card key={block.title} className="h-full rounded-lg">
              <h3 className="text-lg font-black text-[var(--color-institutional)]">{block.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{block.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="proceso" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
                Proceso documentado
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
                De la atención al expediente, sin improvisación.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Cada etapa debe conservar coherencia visual, lenguaje claro y evidencia suficiente
                para sostener el expediente.
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-5">
              {processSteps.map((step, index) => (
                <li key={step} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black text-[var(--color-action)]">0{index + 1}</p>
                  <p className="mt-3 text-sm font-bold text-[var(--color-institutional)]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="ubicacion" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Card className="rounded-lg">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
              Ubicación
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
              Presencia local en Ciudad de México.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{INSTITUTION.address}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={BRAND.mapsUrl} variant="secondary">
                Ver en Google Maps
              </Button>
              <Button href={BRAND.condusefUrl} variant="ghost">
                Verificar en CONDUSEF
              </Button>
            </div>
          </Card>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <Image
              src={ASSETS.ubicacion}
              alt="Ubicación Impulso Go"
              width={920}
              height={520}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#061a44] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
              Preguntas frecuentes
            </p>
            <h2 className="mt-3 text-3xl font-black">Información antes de continuar.</h2>
          </div>
          <div className="grid gap-3">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-lg border border-white/10 bg-white/6 p-5">
                <h3 className="font-bold">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
