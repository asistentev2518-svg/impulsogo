import Image from "next/image";
import { forwardRef, type ReactNode } from "react";
import { DOC_VERSION, MAIN_LOGO } from "@/components/dashboard/shared";

type Accent = "success" | "danger" | "brand" | "ink";

const ACCENTS: Record<Accent, string> = {
  success: "#0A8F3C",
  danger: "#C62828",
  brand: "#06245C",
  ink: "#172033",
};

export const DOC_W = 1080;
export const DOC_H = 1350;

export type DocShellProps = {
  accent: Accent;
  badge: string;
  title: string;
  subtitle?: string;
  folio: string;
  emittedAt: string;
  city: string;
  folioCondusef: string;
  showQr?: boolean;
  watermark?: string;
  qrDataUrl?: string;
  children: ReactNode;
};

export const DocShell = forwardRef<HTMLDivElement, DocShellProps>(function DocShell(
  {
    accent,
    badge,
    title,
    subtitle,
    folio,
    emittedAt,
    city,
    folioCondusef,
    showQr = true,
    watermark,
    qrDataUrl,
    children,
  },
  ref,
) {
  const accentColor = ACCENTS[accent];

  return (
    <div
      ref={ref}
      style={{
        width: DOC_W,
        height: DOC_H,
        background: "#fbfaf5",
        color: "#172033",
        fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 8, background: accentColor }} />

      <header
        style={{
          padding: "36px 64px 24px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              height: 56,
              width: 56,
              borderRadius: 12,
              background: "white",
              boxShadow: "0 0 0 1px #e2e8f0, 0 2px 8px rgba(11,42,91,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={MAIN_LOGO} alt="Impulso Go" width={40} height={40} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: 800, fontSize: 22 }}>Impulso Go</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Soluciones de crédito - México
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              display: "inline-block",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "6px 12px",
              borderRadius: 999,
              background:
                accent === "danger"
                  ? "#fff1f2"
                  : accent === "success"
                    ? "#ecfdf3"
                    : "#eef6ff",
              color: accentColor,
              border: `1px solid ${accentColor}`,
            }}
          >
            {badge}
          </span>
          <div style={{ marginTop: 10, fontSize: 11, color: "#64748b", fontFamily: "Consolas, monospace" }}>
            Folio expediente: <span style={{ color: "#172033", fontWeight: 700 }}>{folio}</span>
          </div>
          <div style={{ marginTop: 2, fontSize: 11, color: "#64748b", fontFamily: "Consolas, monospace" }}>
            Emitido: <span style={{ color: "#172033" }}>{emittedAt} - {city}</span>
          </div>
        </div>
      </header>

      <div style={{ padding: "0 64px 8px" }}>
        <h1
          style={{
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "#172033",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p style={{ marginTop: 6, fontSize: 14, color: "#64748b", lineHeight: 1.4 }}>
            {subtitle}
          </p>
        ) : null}
        <div style={{ marginTop: 14, height: 2, width: 80, background: accentColor, borderRadius: 2 }} />
      </div>

      {watermark ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) rotate(-22deg)",
            fontWeight: 900,
            fontSize: 130,
            color: accentColor,
            opacity: 0.045,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            letterSpacing: "0.05em",
          }}
        >
          {watermark}
        </div>
      ) : null}

      <main
        style={{
          padding: "20px 64px 24px",
          flex: 1,
          position: "relative",
          zIndex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>

      <footer
        style={{
          marginTop: "auto",
          padding: "22px 64px 28px",
          background: "white",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: "#172033", letterSpacing: "0.04em" }}>
            REGISTRO VERIFICABLE EN SIPRES / CONDUSEF
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "#64748b", lineHeight: 1.45 }}>
            Folio CONDUSEF/SIPRES:{" "}
            <span style={{ fontFamily: "Consolas, monospace", color: "#172033", fontWeight: 700 }}>
              {folioCondusef}
            </span>
            {" - "}Escanea el QR para consultar el registro público.
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: "#64748b" }}>
            © {new Date().getFullYear()} Impulso Go - Documento interno generado el {emittedAt} ({city}) - {DOC_VERSION}.
          </div>
        </div>
        {showQr ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ background: "white", padding: 6, borderRadius: 8, border: "1px solid #e2e8f0" }}>
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="QR SIPRES" width={84} height={84} />
              ) : (
                <div style={{ width: 84, height: 84, background: "#eef2f7" }} />
              )}
            </div>
            <span style={{ fontSize: 9, color: "#64748b" }}>Verificar registro</span>
          </div>
        ) : null}
      </footer>
    </div>
  );
});

export function DocStamp({ text, color }: { text: string; color: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 130,
        right: 60,
        transform: "rotate(-14deg)",
        border: `4px solid ${color}`,
        color,
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: "0.18em",
        padding: "8px 18px",
        borderRadius: 8,
        opacity: 0.85,
        zIndex: 2,
        background: "rgba(255,255,255,0.72)",
      }}
    >
      {text}
    </div>
  );
}

export function FieldRow({
  label,
  value,
  mono = false,
  strong = false,
  color,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 0",
        borderBottom: "1px solid #e2e8f0",
        gap: 18,
      }}
    >
      <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
      <span
        style={{
          fontSize: strong ? 16 : 14,
          fontWeight: strong ? 800 : 600,
          color: color ?? "#172033",
          fontFamily: mono ? "Consolas, monospace" : "Inter, Segoe UI, system-ui, sans-serif",
          fontFeatureSettings: '"tnum"',
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function SectionTitle({
  n,
  title,
  accent,
}: {
  n?: number;
  title: string;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      {typeof n === "number" ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 6,
            background: accent,
            color: "white",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {n}
        </span>
      ) : null}
      <h3
        style={{
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#172033",
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>
  );
}
