import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

const trustBlocks = [
  {
    title: "Registro consultable",
    text: "Registro consultable en SIPRES de CONDUSEF. La consulta verifica la entidad y no implica aprobación de operaciones por parte de CONDUSEF.",
  },
  {
    title: "Contrato electrónico",
    text: "Contrato electrónico con cláusulas completas y trazabilidad documental.",
  },
  {
    title: "Tasa anual fija",
    text: "Tasa anual ordinaria fija del 7%. Valores referenciales sujetos a evaluación crediticia.",
  },
  {
    title: "Validación de identidad",
    text: "Validación de identidad con INE y selfie para prevención de fraude.",
  },
  {
    title: "Expediente digital",
    text: "Folio, hash y QR de verificación para integridad documental.",
  },
  {
    title: "Proceso guiado",
    text: "Proceso documentado de extremo a extremo en cinco pasos claros.",
  },
];

const steps = [
  "Datos del cliente",
  "Validación de identidad",
  "Revisión del contrato",
  "Firma electrónica",
  "PDF blindado con folio, hash y QR",
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-action)]">
              {INSTITUTION.legalName}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-[var(--color-institutional)] md:text-5xl">
              {BRAND.tagline}
            </h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">{BRAND.subtagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/firma-contrato">Iniciar proceso de firma</Button>
              <Button href={BRAND.whatsappUrl} variant="secondary">
                Resolver dudas por WhatsApp
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Button href={BRAND.sipresUrl} variant="ghost">
                Consultar registro en SIPRES
              </Button>
              <Button href={BRAND.condusefUrl} variant="ghost">
                Verificar en CONDUSEF
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Image
              src={ASSETS.confianza}
              alt="Confianza"
              width={280}
              height={200}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            />
            <Image
              src="/assets/impulso-go/hero-1.jpeg"
              alt="Impulso Go"
              width={280}
              height={200}
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-[var(--color-institutional)]">
          Confianza institucional
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trustBlocks.map((block) => (
            <Card key={block.title}>
              <h3 className="font-semibold text-[var(--color-institutional)]">{block.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{block.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold text-[var(--color-institutional)]">Proceso público</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-slate-200 bg-[var(--color-surface)] p-4">
                <p className="text-sm font-bold text-[var(--color-action)]">Paso {index + 1}</p>
                <p className="mt-2 text-sm font-medium">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Card className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-institutional)]">Ubicación</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{INSTITUTION.address}</p>
            <Button href={BRAND.mapsUrl} className="mt-4" variant="secondary">
              Ver en Google Maps
            </Button>
          </div>
          <Image src={ASSETS.ubicacion} alt="Ubicación" width={220} height={120} />
        </Card>
      </section>
    </PublicShell>
  );
}
