import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Card } from "@/components/ui/Card";
import { INSTITUTION } from "@/lib/config";

const sections = [
  {
    title: "Datos personales tratados",
    body:
      "Datos de identificación, contacto, domicilio, información financiera, CURP, teléfono, banco, cuenta, INE por ambos lados, selfie, firma, aceptaciones, folio, fecha, hora y datos técnicos mínimos del dispositivo cuando el proceso lo requiera.",
  },
  {
    title: "Finalidades primarias",
    body:
      "Validar identidad, prevenir suplantación, evaluar la solicitud, formalizar contrato, generar documentos, conservar evidencia operativa, atender aclaraciones y cumplir obligaciones legales o contractuales.",
  },
  {
    title: "Transferencias",
    body:
      "La información podrá compartirse únicamente con autoridades competentes, sociedades de información crediticia o proveedores indispensables para la operación, siempre bajo controles de confidencialidad.",
  },
  {
    title: "Derechos ARCO",
    body:
      "El titular podrá solicitar acceso, rectificación, cancelación u oposición al tratamiento de sus datos mediante solicitud con nombre, identificación, medio de respuesta y descripción clara del derecho que desea ejercer.",
  },
  {
    title: "Conservación y seguridad",
    body:
      "Los datos se conservarán por el plazo necesario para cumplir las finalidades informadas. El acceso interno deberá limitarse al personal autorizado y a los procesos estrictamente necesarios.",
  },
  {
    title: "Cambios al aviso",
    body:
      "Cualquier actualización se publicará en este sitio. La versión vigente será la visible al momento de iniciar o continuar el trámite.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicShell>
      <main className="bg-[#f5f8fc]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-action)]">
                Documento legal
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--color-institutional)]">
                Aviso de privacidad integral
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Este aviso explica como {INSTITUTION.legalName} trata los datos personales
                recabados durante la solicitud, validación, firma y seguimiento documental.
              </p>
            </div>
            <div className="rounded-lg border border-[#061a44]/10 bg-[#061a44] p-5 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">
                Responsable
              </p>
              <p className="mt-3 text-lg font-black">{INSTITUTION.legalName}</p>
              <p className="mt-3 text-sm leading-6 text-white/72">{INSTITUTION.address}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
          <aside className="h-max rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Contenido
            </p>
            <ol className="mt-4 space-y-3 text-sm font-bold text-[var(--color-institutional)]">
              {sections.map((section, index) => (
                <li key={section.title} className="flex gap-3">
                  <span className="text-[var(--color-action)]">{String(index + 1).padStart(2, "0")}</span>
                  <span>{section.title}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-600">
              Para conocer condiciones comerciales del sitio, consulta tambien los{" "}
              <Link href="/terminos-y-condiciones" className="font-black text-[var(--color-action)]">
                terminos y condiciones
              </Link>
              .
            </div>
          </aside>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <Card key={section.title} className="rounded-lg">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)] text-sm font-black text-[var(--color-action)]">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-[var(--color-institutional)]">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="rounded-lg border-[var(--color-action)]/20 bg-[#eef6ff]">
              <h2 className="text-lg font-black text-[var(--color-institutional)]">
                Medio para ejercer derechos
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                La solicitud debe incluir nombre completo, identificación del titular, descripción
                precisa del derecho solicitado, documentos de soporte y un medio para recibir
                respuesta. El plazo de atención será el previsto por la legislación aplicable.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
