import { PublicShell } from "@/components/layout/PublicShell";
import { INSTITUTION } from "@/lib/config";

export default function TermsPage() {
  return (
    <PublicShell>
      <article className="prose-legal mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[var(--color-institutional)]">
          Términos y condiciones
        </h1>

        <h2>Uso del sitio</h2>
        <p>
          El sitio de {INSTITUTION.legalName} es para consulta, simulación referencial y
          formalización documental conforme a los procesos publicados.
        </p>

        <h2>Naturaleza referencial</h2>
        <p>
          Las simulaciones y tablas son valores referenciales y están sujetas a evaluación
          crediticia. No constituyen oferta vinculante ni aprobación automática.
        </p>

        <h2>Comunicaciones electrónicas</h2>
        <p>
          Se reconoce validez de comunicaciones por medios electrónicos autorizados por el cliente.
        </p>

        <h2>Firma electrónica y evidencia digital</h2>
        <p>
          La firma electrónica, evidencia técnica, folio, hash y QR integran el expediente con
          fines de trazabilidad y conservación documental.
        </p>

        <h2>Prohibición de datos falsos</h2>
        <p>Queda prohibido proporcionar información falsa, incompleta o suplantar identidad.</p>

        <h2>Limitación tecnológica</h2>
        <p>
          Se aplicará una limitación de responsabilidad tecnológica razonable por interrupciones
          temporales del servicio digital.
        </p>

        <h2>Jurisdicción</h2>
        <p>Para controversias, tribunales competentes de {INSTITUTION.jurisdiction}.</p>
      </article>
    </PublicShell>
  );
}
