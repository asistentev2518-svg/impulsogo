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
  "Trámite totalmente en línea",
];

const processSteps = [
  ["01", "Captura datos", "El cliente registra identidad, contacto y condiciones solicitadas."],
  ["02", "Valida identidad", "INE por ambos lados, selfie y consentimiento biométrico."],
  ["03", "Lee contrato", "Cláusulas completas y aceptaciones expresas antes de firmar."],
  ["04", "Firma digital", "Firma, folio, fecha y huella técnica de generación."],
];

const operatingTools = [
  ["Firma digital", "Wizard público con contrato, evidencia, folio, huella técnica y PDF institucional."],
  ["Dashboard documental", "Aprobación, cancelación, póliza y aviso de privacidad en PNG vertical."],
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
    "Por qué se solicita evidencia de identidad?",
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

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)] md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-sm leading-7 text-slate-600 md:text-[15px]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicShell>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#061a44] text-white">
        <Image
          src={ASSETS.hero1}
          alt="Impulso Go"
          fill
          className="absolute inset-0 -z-20 object-cover"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[#03183f]/78" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(18,102,214,0.45),transparent_55%)]" />

        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-100 backdrop-blur">
                {INSTITUTION.legalName}
              </div>

              <h1 className="mt-6 text-[40px] font-black leading-[1.02] md:text-6xl">
                Financiamiento formal, contrato firmado y trámite en línea
              </h1>

              <p className="mt-5 text-base leading-8 text-white/78 md:text-lg">
                {BRAND.subtagline}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] justify-center"
                >
                  Resolver dudas por WhatsApp
                </Button>
                <Button
                  href={BRAND.sipresUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  className="border border-white/20 text-white hover:bg-white/10 justify-center"
                >
                  Consultar SIPRES
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {trustPills.map((pill) => (
                  <div
                    key={pill}
                    className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 backdrop-blur hover-lift"
                  >
                    <p className="text-[12px] font-bold leading-5 text-white/85">{pill}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-sm md:max-w-[360px]">
              <Card className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">
                  ¿Listo para iniciar?
                </p>
                <h3 className="mt-2 text-xl font-black text-white">
                  Genera tu expediente verificable
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Recibe información clara, valida la entidad en SIPRES y formaliza con contrato electrónico listo para descarga.
                </p>
                <div className="mt-5">
                  <Button href="/firma-contrato" className="w-full bg-white !text-[#061a44] hover:bg-blue-50">
                    Continuar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA sticky-ish */}
        <div className="border-t border-white/10 bg-[#061a44]/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                Verificación en SIPRES / CONDUSEF
              </p>
              <p className="mt-1 text-sm text-white/75">
                Consulta pública de registro: sin promesas, con trazabilidad.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href="/validar/IG-PROVISIONAL" variant="secondary" className="bg-white/10 text-white border border-white/15 hover:bg-white/15">
                Ver ejemplo
              </Button>
              <Button href={BRAND.condusefUrl} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a]">
                Consultar registro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFICACIÓN */}
      <section id="verificacion" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <SectionHeading
              eyebrow="Registro verificable"
              title="Respaldo institucional claro, sin promesas confusas."
              subtitle="La consulta en SIPRES permite revisar el registro público. Cada operación depende de evaluación crediticia, validación documental y firma contractual."
            />
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[28px] bg-[radial-gradient(ellipse_at_top,rgba(18,102,214,0.18),transparent_55%)]" />
              <Card className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">
                      Entidad
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
                      {INSTITUTION.legalName}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{INSTITUTION.address}</p>
                  </div>
                  <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <VerificationLogos variant="home" />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={BRAND.sipresUrl} target="_blank" rel="noopener noreferrer">
                    Consultar registro
                  </Button>
                  <Button href="/terminos-y-condiciones" variant="secondary">
                    Términos y condiciones
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SIMULADOR */}
      <section id="simulador" className="bg-[#eef6ff]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <SectionHeading
              eyebrow="Simulación transparente"
              title="Tasa, plazo y cuota visibles antes de avanzar."
              subtitle="Estima tu cuota y avanza con claridad. El proceso evita condiciones ocultas o pendientes."
            />
            <div className="relative">
              <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[30px] bg-white/60 backdrop-blur" />
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <HomeSimulator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVIDAD */}
      <HomeActivity />

      {/* PROCESO */}
      <section id="proceso" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Proceso documentado"
              title="De solicitud a expediente verificable."
              subtitle="Flujo explicado con pasos claros. Sin promesas: con trazabilidad."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {processSteps.map(([number, title, text]) => (
              <Card key={number} className="rounded-2xl p-5 hover-lift">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-[var(--color-action)]">{number}</p>
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-action)]/20 ring-2 ring-[var(--color-action)]/30" />
                </div>
                <h3 className="mt-4 text-lg font-black text-[var(--color-institutional)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HERRAMIENTAS */}
      <section id="herramientas" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <SectionHeading
              eyebrow="Ecosistema operativo"
              title="Sitio público y herramientas internas hablan el mismo idioma."
              subtitle="Contratos, documentos y tablas se generan con la misma lógica financiera, visual e institucional."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {operatingTools.map(([title, text]) => (
                <Card key={title} className="rounded-2xl p-5 hover-lift">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-action)]">
                    Herramienta
                  </p>
                  <h3 className="mt-3 text-xl font-black text-[var(--color-institutional)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section id="seguridad" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <SectionHeading
              eyebrow="Proceso claro"
              title="Estructurado, documentado y transparente."
              subtitle="Validación interna, formalización con condiciones y responsabilidades visibles para el cliente."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {processDetails.map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-black text-[var(--color-institutional)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {securityDetails.map(([title, text]) => (
              <Card key={title} className="rounded-2xl p-5 bg-[#f8fafc] hover-lift">
                <h3 className="font-black text-[var(--color-institutional)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* INFO ADICIONAL + UX “SERIA” */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <Card className="rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                Transparencia antes de cualquier decisión
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
                Claridad y expectativa real
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  En algunos casos, como parte de la validación, puede contemplarse una póliza
                  administrativa de respaldo, informada previamente al cliente antes de continuar.
                </p>
                <p>La aplicación depende del análisis individual de cada solicitud.</p>
                <p>
                  Todos los detalles se explican de manera clara antes de aceptar condiciones, firmar
                  documentos o avanzar en cualquier etapa.
                </p>
              </div>
            </Card>

            <Card className="rounded-2xl p-6 bg-white border border-slate-200">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                Acceso inmediato
              </p>
              <h3 className="mt-3 text-2xl font-black text-[var(--color-institutional)]">
                Contrato con evidencia
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Genera un folio, fecha y huella técnica con evidencia documental y descarga lista.
              </p>
              <div className="mt-5 space-y-3">
                <Button href="/firma-contrato" className="w-full bg-[#1266D6] hover:bg-[var(--color-action-hover)]">
                  Ir al wizard
                </Button>
                <Button
                  href={BRAND.sipresUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="w-full"
                >
                  Consultar registro
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Card className="rounded-2xl p-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                Ubicación
              </p>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-institutional)]">
                Presencia local y trámite 100% en línea
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{INSTITUTION.address}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                El trámite, validación documental y firma se realizan por medios digitales. No necesitas acudir físicamente.
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

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={ASSETS.ubicacion}
                alt="Ubicación Impulso Go"
                width={920}
                height={520}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#061a44] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-200">
                Preguntas frecuentes
              </p>
              <h2 className="mt-3 text-3xl font-black">Información antes de continuar.</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Respuestas claras para tomar decisiones con confianza.
              </p>
            </div>

            <div className="grid gap-3">
              {faqs.map(([question, answer]) => (
                <div key={question} className="rounded-2xl border border-white/10 bg-white/6 p-5">
                  <h3 className="font-bold">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/6 p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                  Próximo paso
                </p>
                <p className="mt-2 text-2xl font-black">Genera tu contrato con evidencia</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Wizard público: folio, fecha y huella técnica de generación.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/firma-contrato" className="bg-[#25D366] hover:bg-[#20bd5a]">
                  Empezar contrato
                </Button>
                <Button href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="border border-white/20">
                  Dudas por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
