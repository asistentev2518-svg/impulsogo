import { forwardRef } from "react";
import { DocShell, DocStamp, FieldRow, SectionTitle } from "./doc-shell";
import { derive, formatMoney, type MasterData } from "@/components/dashboard/shared";

const CONSEQUENCES = [
  {
    title: "Reporte a buro de credito y veto financiero",
    desc: "Queja formal ante entidades de la federacion y solicitud de veto en sistemas financieros nacionales.",
  },
  {
    title: "Penalizacion 10% exigible",
    desc: "Cobro del 10% del valor del prestamo solicitado por solicitar el servicio y no disponer de el.",
  },
  {
    title: "Visita domiciliaria de oficial",
    desc: "Notificacion formal en el domicilio registrado durante la semana correspondiente.",
  },
  {
    title: "Citacion ante tribunal",
    desc: "Comunicacion de fecha y sede para comparecencia cuando el caso lo requiera.",
  },
];

export const CancellationDoc = forwardRef<
  HTMLDivElement,
  { master: MasterData; qrDataUrl?: string }
>(function CancellationDoc({ master, qrDataUrl }, ref) {
  const data = derive(master);
  const accent = "#C62828";

  return (
    <DocShell
      ref={ref}
      accent="danger"
      badge="NOTIFICACION FORMAL"
      title="NOTIFICACION FORMAL DE CANCELACION DE CREDITO"
      subtitle="Comunicado de cancelacion del expediente crediticio y obligaciones derivadas."
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      watermark="CANCELADO"
      qrDataUrl={qrDataUrl}
    >
      <DocStamp text="CANCELADO" color={accent} />

      <div
        style={{
          background: "white",
          border: `1px solid ${accent}`,
          borderLeft: `5px solid ${accent}`,
          borderRadius: 12,
          padding: "20px 24px",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 900, color: accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Comunicado oficial
        </div>
        <p style={{ marginTop: 8, fontSize: 14, color: "#172033", lineHeight: 1.5 }}>
          Se notifica que el expediente crediticio{" "}
          <strong style={{ fontFamily: "Consolas, monospace" }}>{master.folio}</strong>, a nombre de{" "}
          <strong>{master.name}</strong>, ha sido marcado como{" "}
          <strong style={{ color: accent }}>CANCELADO</strong> por incumplimiento de las condiciones
          operativas y contractuales aplicables al proceso de originacion.
        </p>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionTitle title="Detalle del adeudo" accent={accent} />
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 22px" }}>
          <FieldRow label="Titular" value={master.name} />
          <FieldRow label="RFC" value={data.rfc} mono />
          <FieldRow label="Cuenta asociada" value={data.accountMasked} mono />
          <FieldRow label="Plazo original" value={`${master.termYears} anos`} />
          <FieldRow label="Monto original aprobado" value={formatMoney(master.amount)} mono />
          <FieldRow label="Penalizacion contractual (10%)" value={formatMoney(data.penalty)} mono color={accent} />
          <FieldRow label="ADEUDO TOTAL EXIGIBLE" value={formatMoney(data.totalDue)} mono strong color={accent} />
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: "#fff1f2",
          border: `1px solid ${accent}`,
          borderLeft: `5px solid ${accent}`,
          borderRadius: 12,
          padding: "16px 22px",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 14, color: accent, letterSpacing: "0.08em" }}>
          NOTIFICACION DE ACCIONES INMEDIATAS
        </div>
        <p style={{ marginTop: 8, marginBottom: 8, fontSize: 12.5, color: "#172033", lineHeight: 1.5 }}>
          Derivado de la cancelacion del contrato, se procedera con las siguientes acciones:
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "#172033", lineHeight: 1.55 }}>
          <li style={{ marginBottom: 4 }}>
            <strong>Reporte inmediato ante entidades de informacion crediticia</strong>, mediante
            queja formal y solicitud de registro de incumplimiento.
          </li>
          <li style={{ marginBottom: 4 }}>
            <strong>Cobro del 10% del valor del prestamo solicitado</strong>{" "}
            (<span style={{ fontFamily: "Consolas, monospace" }}>{formatMoney(data.penalty)}</span>).
          </li>
          <li>
            <strong>Notificacion domiciliaria</strong> a cargo del area correspondiente, con
            seguimiento formal del expediente.
          </li>
        </ol>
      </div>

      <div style={{ marginTop: 14 }}>
        <SectionTitle title="Consecuencias del incumplimiento" accent={accent} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CONSEQUENCES.map((item) => (
            <div
              key={item.title}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderLeft: `3px solid ${accent}`,
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 12, color: "#172033" }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4, marginTop: 2 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <div style={{ fontSize: 11, color: "#64748b" }}>
          Canal de atencion a traves del ejecutivo asignado:{" "}
          <span style={{ color: "#172033", fontWeight: 700 }}>{master.executive}</span> - Sucursal {master.city}.
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "center", minWidth: 220 }}>
            <div style={{ borderBottom: "1px solid #172033", height: 28, fontSize: 22, color: "#172033", fontStyle: "italic" }}>
              {master.executive}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
              Ejecutivo notificador - {data.initials}
            </div>
          </div>
        </div>
      </div>
    </DocShell>
  );
});
