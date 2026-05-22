import { forwardRef } from "react";
import { DocShell, DocStamp, FieldRow, SectionTitle } from "./doc-shell";
import {
  derive,
  formatMoney,
  offerDeadline72h,
  type MasterData,
} from "@/components/dashboard/shared";

export const ApprovalDoc = forwardRef<
  HTMLDivElement,
  { master: MasterData; qrDataUrl?: string }
>(function ApprovalDoc({ master, qrDataUrl }, ref) {
  const data = derive(master);
  const accent = "#0A8F3C";
  const deadline = offerDeadline72h();

  return (
    <DocShell
      ref={ref}
      accent="success"
      badge="EXPEDIENTE APROBADO"
      title="CONSTANCIA DE APROBACIÓN DE CRÉDITO"
      subtitle={`Resultado de la evaluación crediticia para ${master.name || "el titular"}.`}
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      watermark="APROBADO"
      qrDataUrl={qrDataUrl}
    >
      <DocStamp text="APROBADO" color={accent} />

      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 2px 12px rgba(11,42,91,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 800 }}>
              Monto aprobado
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 64,
                lineHeight: 1,
                marginTop: 6,
                color: accent,
                letterSpacing: "-0.025em",
              }}
            >
              {formatMoney(master.amount)}
            </div>
            <div style={{ marginTop: 14, fontSize: 20, fontWeight: 800, color: "#172033" }}>
              {master.name}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "Consolas, monospace", marginTop: 2 }}>
              RFC: <span style={{ color: "#172033" }}>{data.rfc}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 800,
                color: accent,
                background: "#ecfdf3",
                padding: "6px 12px",
                borderRadius: 999,
              }}
            >
              Dictamen aprobado
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>Sucursal originadora</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#172033" }}>{master.city}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionTitle title="Resumen financiero" accent={accent} />
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 22px" }}>
          <FieldRow label="Monto aprobado" value={formatMoney(master.amount)} mono strong />
          <FieldRow label="Comision por apertura (cargo independiente)" value={formatMoney(master.commission)} mono />
          <FieldRow label="Plazo" value={`${master.termYears} anos (${data.months} meses)`} />
          <FieldRow label="Tasa anual" value={`${data.annualRatePct.toFixed(2)}%`} mono />
          <FieldRow label="Pago mensual estimado" value={formatMoney(data.monthly)} mono />
          <FieldRow label="Total estimado a pagar" value={formatMoney(data.totalToPay)} mono strong />
        </div>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px" }}>
          <SectionTitle title="Cuenta de abono" accent={accent} />
          <div style={{ fontFamily: "Consolas, monospace", fontSize: 18, fontWeight: 800, letterSpacing: "0.1em", color: "#172033" }}>
            {data.accountMasked}
          </div>
          <div style={{ fontFamily: "Consolas, monospace", fontSize: 11, color: "#64748b", marginTop: 4 }}>
            CLABE {data.clabeMasked}
          </div>
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px" }}>
          <SectionTitle title="Ejecutivo asignado" accent={accent} />
          <div style={{ fontSize: 16, fontWeight: 800 }}>{master.executive}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Iniciales: <span style={{ fontWeight: 700 }}>{data.initials}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          background: "#ecfdf3",
          border: `1px solid ${accent}`,
          borderLeft: `4px solid ${accent}`,
          borderRadius: 12,
          padding: "12px 18px",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 12, color: accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Vigencia de la oferta - 72 horas maximo
        </div>
        <div style={{ fontSize: 12.5, color: "#172033", marginTop: 2 }}>
          La presente aprobación deberá formalizarse antes del{" "}
          <strong style={{ fontFamily: "Consolas, monospace" }}>{deadline}</strong> (hora CDMX).
        </div>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <p style={{ fontSize: 12.5, color: "#172033", lineHeight: 1.55, margin: 0 }}>
          Se informa que el expediente crediticio ha sido <strong>aprobado de forma preliminar</strong>{" "}
          conforme al proceso interno de validación de Impulso Go.
        </p>
        <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, marginTop: 6 }}>
          La disposición del crédito queda sujeta a firma, validación documental y cumplimiento de
          condiciones aplicables.
        </p>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "center", minWidth: 220 }}>
            <div style={{ borderBottom: "1px solid #172033", height: 28, fontSize: 22, color: "#172033", fontStyle: "italic" }}>
              {master.executive}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
              Ejecutivo asignado - {data.initials}
            </div>
          </div>
        </div>
      </div>
    </DocShell>
  );
});
