import { PublicShell } from "@/components/layout/PublicShell";
import { INSTITUTION } from "@/lib/config";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <article className="prose-legal mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[var(--color-institutional)]">Aviso de privacidad</h1>
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Responsable: {INSTITUTION.legalName}
        </p>
        <p>Domicilio: {INSTITUTION.address}</p>

        <h2>Datos tratados</h2>
        <p>
          Identificación oficial por ambos lados, selfie para validación de identidad y
          prevención de suplantación, datos de contacto, datos del financiamiento, IP,
          dispositivo, navegador, fecha, hora, folio y hash cuando aplique.
        </p>

        <h2>Finalidades</h2>
        <p>
          Formalizar contrato electrónico, validar identidad, prevenir fraude, integrar y
          conservar expediente, evaluar solicitud y dar seguimiento, y reportar información
          crediticia cuando aplique.
        </p>

        <h2>Derechos ARCO</h2>
        <p>
          Puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición mediante
          solicitud con nombre, canal de respuesta, identificación, descripción clara y elementos
          para localizar sus datos. Respuesta en un plazo máximo de 20 días hábiles.
        </p>

        <h2>Base legal</h2>
        <p>
          LFPDPPP y normativa aplicable a identificación de clientes para SOFOM.
        </p>
      </article>
    </PublicShell>
  );
}
