import { forwardRef, type ReactNode } from "react";
import { DocShell, SectionTitle } from "./doc-shell";
import {
  PRIVACY_CONTACT,
  type MasterData,
} from "@/components/dashboard/shared";

export const PrivacyDoc = forwardRef<
  HTMLDivElement,
  { master: MasterData; qrDataUrl?: string }
>(function PrivacyDoc({ master, qrDataUrl }, ref) {
  const accent = "#06245C";
  const sections: { n: number; title: string; body: ReactNode }[] = [
    {
      n: 1,
      title: "Identidad y domicilio del responsable",
      body: (
        <>
          <strong>Impulso Go</strong>, con domicilio en Ciudad de Mexico, es el responsable del
          tratamiento de los datos personales que recaba del titular.
        </>
      ),
    },
    {
      n: 2,
      title: "Datos personales tratados",
      body: "Datos de identificacion, contacto, informacion financiera, laboral, patrimonial y documentacion de respaldo del expediente.",
    },
    {
      n: 3,
      title: "Finalidades primarias",
      body: "Analisis de la solicitud, validacion de identidad, formalizacion del credito, gestion del expediente, cobranza administrativa y cumplimiento de obligaciones legales.",
    },
    {
      n: 4,
      title: "Finalidades secundarias",
      body: "Mejora de productos y servicios, prospeccion comercial y envio de comunicaciones informativas. El titular podra manifestar su negativa sin afectar la relacion principal.",
    },
    {
      n: 5,
      title: "Transferencias",
      body: "Los datos podran transferirse a sociedades de informacion crediticia, autoridades competentes y proveedores necesarios para la operacion.",
    },
    {
      n: 6,
      title: "Derechos ARCO y revocacion",
      body: (
        <>
          El titular podra ejercer sus derechos de <strong>acceso, rectificacion, cancelacion y
          oposicion</strong>, asi como revocar el consentimiento otorgado.
        </>
      ),
    },
    {
      n: 7,
      title: "Cambios al presente aviso",
      body: "Cualquier modificacion al presente Aviso de Privacidad sera publicada por los canales oficiales de Impulso Go.",
    },
  ];

  return (
    <DocShell
      ref={ref}
      accent="brand"
      badge="AVISO INTEGRAL"
      title="AVISO DE PRIVACIDAD"
      subtitle="Tratamiento de datos personales conforme a la Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares."
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      qrDataUrl={qrDataUrl}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "10px 18px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <Info label="Titular" value={master.name} />
        <Info label="Folio expediente" value={master.folio} mono />
        <Info label="Sucursal" value={master.city} />
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
        {sections.map((section) => (
          <div key={section.n}>
            <SectionTitle n={section.n} title={section.title} accent={accent} />
            <p style={{ margin: 0, fontSize: 11.5, color: "#172033", lineHeight: 1.5 }}>
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "auto", paddingTop: 12, fontSize: 10, color: "#64748b", lineHeight: 1.45 }}>
        El presente Aviso de Privacidad se emite en cumplimiento de la Ley Federal de Proteccion de
        Datos Personales en Posesion de los Particulares y su Reglamento. Folio de expediente:{" "}
        <strong style={{ color: "#172033" }}>{master.folio}</strong>.
      </p>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10 }}>
        <div
          style={{
            background: "#eef6ff",
            border: `1px solid ${accent}`,
            borderLeft: `4px solid ${accent}`,
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 11, color: accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Derechos ARCO
          </div>
          <div style={{ fontSize: 10.5, color: "#172033", lineHeight: 1.4, marginTop: 2 }}>
            Acceso, Rectificacion, Cancelacion y Oposicion. El titular puede ejercerlos en cualquier
            momento por los canales oficiales.
          </div>
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800, marginBottom: 4 }}>
            Contacto del responsable
          </div>
          <div style={{ fontSize: 10.5, color: "#172033" }}>{PRIVACY_CONTACT.email}</div>
          <div style={{ fontSize: 10.5, color: "#172033", marginTop: 2, lineHeight: 1.35 }}>
            {PRIVACY_CONTACT.address}
          </div>
        </div>
      </div>
    </DocShell>
  );
});

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800 }}>
        {label}
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 13,
          marginTop: 2,
          fontFamily: mono ? "Consolas, monospace" : "Inter, Segoe UI, system-ui, sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}
