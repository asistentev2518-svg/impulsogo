import { forwardRef } from "react";
import { DocShell, FieldRow, SectionTitle } from "./doc-shell";
import { derive, formatMoney, type MasterData } from "@/components/dashboard/shared";

const COVERAGES = [
  "Fallecimiento por cualquier causa del titular.",
  "Invalidez total y permanente derivada de accidente o enfermedad.",
  "Desempleo involuntario, sujeto a condiciones de la poliza.",
  "Saldo insoluto del credito al momento del siniestro.",
];

export const PolicyDoc = forwardRef<
  HTMLDivElement,
  { master: MasterData; qrDataUrl?: string }
>(function PolicyDoc({ master, qrDataUrl }, ref) {
  const data = derive(master);
  const accent = "#06245C";

  return (
    <DocShell
      ref={ref}
      accent="brand"
      badge="POLIZA ACTIVA"
      title="CONSTANCIA DE POLIZA DE PROTECCION CREDITICIA"
      subtitle="Caratula resumen de la poliza vinculada al expediente crediticio."
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      watermark="POLIZA"
      qrDataUrl={qrDataUrl}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: 24,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "center",
          boxShadow: "0 2px 12px rgba(11,42,91,0.05)",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800 }}>
            Numero de poliza
          </div>
          <div style={{ fontFamily: "Consolas, monospace", fontSize: 32, fontWeight: 800, color: accent, marginTop: 4, letterSpacing: "0.04em" }}>
            {data.policyNumber}
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: "#64748b" }}>
            Producto: <span style={{ color: "#172033", fontWeight: 700 }}>Proteccion crediticia</span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            Beneficiario: <span style={{ color: "#172033", fontWeight: 700 }}>Impulso Go / entidad correspondiente</span>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", fontSize: 12, fontWeight: 800, color: "#0A8F3C", background: "#ecfdf3", padding: "8px 14px", borderRadius: 999 }}>
            Estado: ACTIVA
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>Monto protegido</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#172033" }}>{formatMoney(master.amount)}</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionTitle n={1} title="Datos del asegurado" accent={accent} />
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 22px" }}>
          <FieldRow label="Nombre del titular" value={master.name} strong />
          <FieldRow label="RFC" value={data.rfc} mono />
          <FieldRow label="Sucursal" value={master.city} />
          <FieldRow label="Ejecutivo asignado" value={master.executive} />
        </div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 18px" }}>
          <SectionTitle n={2} title="Datos de la poliza" accent={accent} />
          <FieldRow label="Credito asociado" value={master.folio} mono />
          <FieldRow label="Plazo del credito" value={`${master.termYears} anos`} />
          <FieldRow label="Producto asociado" value="Proteccion crediticia" />
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 18px" }}>
          <SectionTitle n={3} title="Cobertura" accent={accent} />
          <FieldRow label="Tipo" value="Proteccion asociada al expediente crediticio" />
          <FieldRow label="Moneda" value="MXN" />
          <FieldRow label="Monto protegido" value={formatMoney(master.amount)} mono strong />
        </div>
      </div>

      <div style={{ marginTop: 14, background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 18px" }}>
        <SectionTitle n={4} title="Coberturas incluidas" accent={accent} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {COVERAGES.map((item) => (
            <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: "#172033", lineHeight: 1.4 }}>
              <span style={{ color: accent, fontWeight: 900 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 18px" }}>
        <SectionTitle n={5} title="Vigencia" accent={accent} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <div style={{ textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800 }}>Inicio</div>
            <div style={{ fontFamily: "Consolas, monospace", fontSize: 13, fontWeight: 800, color: "#172033", marginTop: 2 }}>{data.validFrom}</div>
          </div>
          <div style={{ flex: 1, position: "relative", height: 8 }}>
            <div style={{ position: "absolute", inset: 0, background: "#e2e8f0", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", background: accent, borderRadius: 4, opacity: 0.85 }} />
            <div style={{ position: "absolute", left: "50%", top: -22, transform: "translateX(-50%)", fontSize: 10, color: "#64748b", fontWeight: 700 }}>
              {master.termYears} anos de cobertura
            </div>
          </div>
          <div style={{ textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800 }}>Vigente hasta</div>
            <div style={{ fontFamily: "Consolas, monospace", fontSize: 13, fontWeight: 800, color: accent, marginTop: 2 }}>{data.validTo}</div>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "auto", paddingTop: 14, fontSize: 11, color: "#64748b", lineHeight: 1.5, marginBottom: 0 }}>
        Este documento resume los datos principales de la poliza asociada al expediente crediticio.
        Las coberturas, exclusiones y condiciones aplicables se sujetan a los terminos contratados y
        documentos vigentes.
      </p>
    </DocShell>
  );
});
