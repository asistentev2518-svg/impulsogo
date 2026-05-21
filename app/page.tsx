import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

const trustBlocks = [
  {
    title: "Registro consultable en SIPRES",
    text: "Consulta pública del registro institucional en el portal de CONDUSEF. Verifica datos de la entidad y no implica aprobación de operaciones.",
  },
  {
    title: "Contrato electrónico completo",
    text: "Cláusulas completas, aceptaciones expresas, firma digital, folio, hash SHA-256 y QR de verificación documental.",
  },
  {
    title: "Tasa clara del 7%",
    text: "Simulaciones con tasa anual ordinaria fija del 7%, plazos 2/4/6/8 años y valores sujetos a evaluación crediticia.",
  },
  {
    title: "Identidad y evidencia",
    text: "Validación preparada para INE por ambos lados, selfie sosteniendo INE, datos técnicos y conservación del expediente.",
  },
];

const processSteps = [
  "Datos del cliente",
  "Validación de identidad",
  "Revisión del contrato",
  "Firma electrónica",
  "PDF con folio, hash y QR",
];

const toolBlocks = [
  {
    title: "Firma digital",
    text: "Wizard público de contrato con evidencia documental y validación por folio.",
  },
  {
    title: "Contrato manual",
    text: "Formato imprimible de tres páginas con QR, cláusulas base y datos del financiamiento.",
  },
  {
    title: "Documentos WhatsApp",
    text: "Aprobación, cancelación, póliza y aviso de privacidad en formato vertical 1080 x 1350.",
  },
  {
    title: "Tablas de montos",
    text: "Material comercial exportable con cuotas, monto final y nota legal referencial.",
  },
];

const faqs = [
  {
    q: "¿La simulación garantiza aprobación?",
    a: "No. Los montos son referenciales y todo financiamiento queda sujeto a evaluación crediticia y validación documental.",
  },
  {
    q: "¿Dónde se valida la entidad?",
    a: "La referencia pública se consulta en SIPRES de CONDUSEF con el folio institucional correspondiente.",
  },
  {
    q: "¿Por qué se solicita evidencia de identidad?",
    a: "Para prevenir suplantación, documentar consentimiento y conservar un expediente trazable cuando se formaliza el contrato.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative isolate min-h-[76svh] overflow-hidden bg-[#061a44] text-white">
        <Image
          src={ASSETS.hero1}
          alt="Atención financiera Impulso Go"
          fill
          className="absolute inset-0 -z-20 object-cover"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[#03183f]/82" />
        <div className="mx-auto flex max-w-7xl flex-col justify-end px-4 pb-10 pt-20 md:pb-12 md:pt-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-4 border-[#22c55e] bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
              {INSTITUTION.legalName}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
              {BRAND.subtagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/firma-contrato">Iniciar proceso de firma</Button>
              <Button href={BRAND.whatsappUrl} variant="secondary">
                Resolver dudas por WhatsApp
              </Button>
              <Button
                href={BRAND.sipresUrl}
                variant="ghost"
                className="border border-white/20 text-white hover:bg-white/10"
              >
                Consultar registro en SIPRES
              </Button>
            </div>
          </div>

          <div className="mt-10 grid max-w-4xl gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
            <div className="bg-[#061a44]/75 p-5">
              <p className="text-3xl font-black">7%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                Tasa anual fija
              </p>
            </div>
            <div className="bg-[#061a44]/75 p-5">
              <p className="text-3xl font-black">2/4/6/8</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                Plazos en años
              </p>
            </div>
            <div className="bg-[#061a44]/75 p-5">
              <p className="text-3xl font-black">QR + Hash</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                Validación documental
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="respaldo" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
              Respaldo y claridad
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--color-institutional)] md:text-4xl">
              Información verificable, contrato completo y expediente trazable.
            </h2>
          </div>
          <p className="text-sm leading-7 text-slate-600">
            El sitio público orienta al cliente y concentra los puntos críticos del proceso:
            verificación institucional, documentación legal, evidencia de identidad y firma con
            validación posterior por folio.
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
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
                Proceso documentado
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
                De la solicitud al PDF verificable.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Cada etapa está diseñada para dejar evidencia suficiente del consentimiento,
                identidad y condiciones del financiamiento.
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

      <section id="herramientas" className="bg-[#eef6ff]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
              Ecosistema operativo
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
              Una sola plataforma para contrato, documentos, tablas y expedientes.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              La operación privada mantiene el mismo lenguaje visual y financiero del sitio
              público, con herramientas listas para exportar PDF y PNG de calidad comercial.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/firma-contrato" variant="secondary">
                Ver flujo de firma
              </Button>
              <Button href={BRAND.condusefUrl} variant="ghost">
                Verificar en CONDUSEF
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {toolBlocks.map((tool) => (
              <Card key={tool.title} className="rounded-lg bg-white">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">
                  Herramienta
                </p>
                <h3 className="mt-3 text-xl font-black text-[var(--color-institutional)]">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{tool.text}</p>
              </Card>
            ))}
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
            <p className="mt-3 text-sm font-bold text-[var(--color-institutional)]">
              WhatsApp: {BRAND.whatsappDisplay}
            </p>
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
