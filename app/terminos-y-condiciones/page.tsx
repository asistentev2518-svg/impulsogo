import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Card } from "@/components/ui/Card";
import { INSTITUTION } from "@/lib/config";

const terms = [
  {
    title: "Uso del sitio",
    body:
      "El sitio permite consultar información institucional, simular montos referenciales e iniciar procesos documentales. Su uso debe realizarse con datos verdaderos, completos y actualizados.",
  },
  {
    title: "Naturaleza referencial",
    body:
      "Las simulaciones, cuotas y montos mostrados son estimaciones. No constituyen aprobación automática, oferta vinculante ni obligación de desembolso sin evaluación, validación y contrato firmado.",
  },
  {
    title: "Firma electrónica",
    body:
      "La firma, las aceptaciones, la fecha, el folio y la huella técnica de generación pueden integrarse como evidencia documental del proceso y de la voluntad expresada por el titular.",
  },
  {
    title: "Documentación e identidad",
    body:
      "El usuario se obliga a proporcionar información auténtica. La suplantación, alteración de documentos o uso de datos falsos podrá causar rechazo, cancelación y las acciones legales que correspondan.",
  },
  {
    title: "Disponibilidad tecnológica",
    body:
      "El servicio digital puede presentar interrupciones temporales por mantenimiento, conectividad o causas externas. Impulso Go procurará restablecer la operación en el menor tiempo razonable.",
  },
  {
    title: "Jurisdicción",
    body: `Para cualquier controversia relacionada con el uso del sitio o los documentos generados, las partes se someten a las leyes y tribunales competentes de ${INSTITUTION.jurisdiction}.`,
  },
];

export default function TermsPage() {
  return (
    <PublicShell>
      <main className="bg-[#f5f8fc]">
        <section className="border-b border-slate-200 bg-[#061a44] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
              Marco de uso
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight">
              Términos y condiciones
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
              Condiciones aplicables al uso del sitio, simuladores, documentos, firma electrónica y
              comunicaciones digitales de {INSTITUTION.legalName}.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 md:grid-cols-2">
            {terms.map((term, index) => (
              <Card key={term.title} className="rounded-lg">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
                  Cláusula {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-xl font-black text-[var(--color-institutional)]">
                  {term.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{term.body}</p>
              </Card>
            ))}
          </div>

          <aside className="h-max rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Lectura relacionada
            </p>
            <h2 className="mt-3 text-xl font-black text-[var(--color-institutional)]">
              Privacidad y datos personales
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              El tratamiento de datos personales se rige por el aviso de privacidad integral
              publicado en este sitio.
            </p>
            <Link
              href="/aviso-de-privacidad"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-institutional)]/20 bg-white px-5 py-3 text-sm font-bold text-[var(--color-institutional)] transition hover:bg-[var(--color-surface)]"
            >
              Ver aviso de privacidad
            </Link>
          </aside>
        </section>
      </main>
    </PublicShell>
  );
}
