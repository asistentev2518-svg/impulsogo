import Image from "next/image";
import { HomeActivity } from "@/components/public/HomeActivity";
import { HomeSimulator } from "@/components/public/HomeSimulator";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { VerificationLogos } from "@/components/ui/VerificationLogos";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

const trustPills = [
  "Registro verificable en SIPRES / CONDUSEF",
  "Contrato electrónico con cláusulas completas",
  "Tasa anual fija 7%",
  "Tramite totalmente en linea",
];

const processSteps = [
  ["01", "Captura datos", "El cliente registra identidad, contacto y condiciones solicitadas."],
  ["02", "Valida identidad", "INE por ambos lados, selfie y consentimiento biométrico."],
  ["03", "Lee contrato", "Cláusulas completas y aceptaciones expresas antes de firmar."],
  ["04", "Firma digital", "Firma, folio, fecha y huella técnica de generación."],
];

const operatingTools = [
  ["Firma digital", "Wizard público con contrato, evidencia, folio, huella técnica y PDF institucional."],
  ["Dashboard documental", "Aprobación, cancelación, póliza y aviso de privacidad en PNG 1080 x 1350."],
  ["Contrato manual", "Formatos imprimibles de contrato para casos operativos fuera del flujo digital."],
  ["Tablas de montos", "Material comercial exportable con cuotas, plazo y notas legales referenciales."],
];

const faqs = [
  [
    "La simulación garantiza aprobación?",
    "No. Los montos son referenciales y todo financiamiento queda sujeto a evaluación crediticia, validación documental y formalización contractual.",
  ],
  [
    "Donde se valida la entidad?",
    "La referencia pública se consulta en SIPRES de CONDUSEF. Esa consulta verifica el registro y no implica aprobación de operaciones.",
  ],
  [
    "Por que se solicita evidencia de identidad?",
    "Para prevenir suplantacion, documentar consentimiento y conservar un expediente trazable cuando se formaliza el contrato.",
  ],
];

const processDetails = [
  ["Información clara desde el inicio", "Sin letras pequeñas ni condiciones ocultas."],
  ["Proceso explicado paso a paso", "Cada etapa se comunica con detalle antes de continuar."],
  ["Evaluación individual", "Cada solicitud se analiza de forma personalizada."],
  ["Sin promesas de aprobación", "Trabajamos con transparencia y expectativas reales."],
];

const securityDetails = [
  ["Procesos seguros", "La información se maneja con controles de confidencialidad y trazabilidad."],
  ["Manejo confidencial de datos", "La operación contempla resguardo documental y acceso interno controlado."],
  ["Protección de información personal", "Los datos no se comparten con terceros sin consentimiento del cliente."],
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative isolate min-h-[84svh] overflow-hidden bg-[#061a44] text-white">
        <Image
          src={ASSETS.hero1}
          alt="Atencion financiera Impulso Go"
          fill
          className="absolute inset-0 -z-20 object-cover"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[#03183f]/86" />
        <div className="mx-auto flex min-h-[84svh] max-w-7xl flex-col justify-center px-4 py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-100 backdrop-blur">
              {INSTITUTION.legalName}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] md:text-6xl">
              Financiamiento formal, contrato firmado y trámite en línea
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
              Proceso documentado de extremo a extremo: validación de identidad, contrato
              electrónico con cláusulas completas, firma con folio, fecha y huella técnica de generación.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a]"
              >
                Resolver dudas por WhatsApp
              </Button>
              <Button
                href={BRAND.sipresUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                className="border border-white/20 text-white hover:bg-white/10"
              >
                Consultar SIPRES
              </Button>
            </div>
          </div>

          <div className="mt-10 grid max-w-4xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {trustPills.map((pill) => (
              <div key={pill} className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 backdrop-blur">
                <p className="text-xs font-bold leading-5 text-white/82">{pill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="verificacion" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
              Registro verificable
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
              Respaldo institucional claro, sin promesas confusas.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              La consulta en SIPRES permite revisar el registro público. La aprobación de cada
              operación depende de evaluación crediticia, validación documental y firma contractual.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={BRAND.sipresUrl} target="_blank" rel="noopener noreferrer">
                Consultar registro
              </Button>
              <Button href="/terminos-y-condiciones" variant="secondary">
                Terminos y condiciones
              </Button>
            </div>
          </div>
          <Card className="rounded-lg p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">
                  Entidad
                </p>
                <h3 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
                  {INSTITUTION.legalName}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{INSTITUTION.address}</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <VerificationLogos variant="home" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="simulador" className="bg-[#eef6ff]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
              Simulación transparente
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
              Tasa, plazo y cuota visibles antes de avanzar.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              El cliente puede estimar su cuota antes de formalizar. El proceso evita dejar
              condiciones importantes escondidas o pendientes.
            </p>
          </div>
          <HomeSimulator />
        </div>
      </section>

      <HomeActivity />

      <section id="proceso" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
            Proceso documentado
          </p>
          <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
            De solicitud a expediente verificable.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {processSteps.map(([number, title, text]) => (
            <Card key={number} className="rounded-lg">
              <p className="text-xs font-black text-[var(--color-action)]">{number}</p>
              <h3 className="mt-3 text-lg font-black text-[var(--color-institutional)]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="herramientas" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
              Ecosistema operativo
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
              Sitio público y herramientas internas hablan el mismo idioma.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Contratos, documentos, tablas y expedientes se generan con la misma lógica financiera,
              visual e institucional.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {operatingTools.map(([title, text]) => (
              <Card key={title} className="rounded-lg">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">
                  Herramienta
                </p>
                <h3 className="mt-3 text-xl font-black text-[var(--color-institutional)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="seguridad" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
              Proceso claro
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
              Un proceso estructurado, documentado y transparente.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Toda solicitud pasa por validación interna con base en la información proporcionada.
              Posteriormente se formaliza mediante contrato con condiciones, montos y
              responsabilidades visibles para el cliente.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {processDetails.map(([title, text]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-black text-[var(--color-institutional)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Card className="rounded-lg">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
              Información adicional del proceso
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
              Transparencia antes de cualquier decisión.
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              <p>
                En algunos casos, como parte de la validación, puede contemplarse una póliza
                administrativa de respaldo, informada previamente al cliente antes de continuar.
              </p>
              <p>Su aplicación depende del análisis individual de cada solicitud.</p>
              <p>
                Todos los detalles se explican de manera clara antes de aceptar condiciones,
                firmar documentos o avanzar en cualquier etapa.
              </p>
            </div>
          </Card>
          <div className="grid gap-3">
            {securityDetails.map(([title, text]) => (
              <Card key={title} className="rounded-lg">
                <h3 className="font-black text-[var(--color-institutional)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="ubicacion" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Card className="rounded-lg">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
              Ubicación
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
              Presencia local y trámite completamente en línea.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{INSTITUTION.address}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              El trámite, la validación documental y la firma se realizan por medios digitales. No
              es necesario acudir físicamente para iniciar el proceso.
            </p>
            <p className="mt-3 text-sm font-bold text-[var(--color-institutional)]">
              WhatsApp: {BRAND.whatsappDisplay}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={BRAND.condusefUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                Consultar registro en SIPRES
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

      <section id="faq" className="bg-[#061a44] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-200">
              Preguntas frecuentes
            </p>
            <h2 className="mt-3 text-3xl font-black">Información antes de continuar.</h2>
          </div>
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-lg border border-white/10 bg-white/6 p-5">
                <h3 className="font-bold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
