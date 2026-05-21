import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {children}
    </svg>
  );
}

export function IconPerson(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4Z" />
    </Svg>
  );
}

export function IconDollar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 3v2h-2v1h2a2 2 0 0 1 0 4h-2v2h2v1h-2v-2h2a2 2 0 1 0 0-4h-2V5h2Z" />
    </Svg>
  );
}

export function IconBank(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 10 12 4l9 6v2H3v-2Zm2 4h14v6H5v-6Zm2 2v2h2v-2H7Zm4 0v2h2v-2h-2Z" />
    </Svg>
  );
}

export function IconClipboard(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3h6a2 2 0 0 1 2 2h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1a2 2 0 0 1 2-2Zm2 2v2h2V5h-2Z" />
    </Svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 3 10v11h7v-6h4v6h7V10l-9-7Z" />
    </Svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1 14-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6Z" />
    </Svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5l4 2-.9 1.8-4.6-2.3V7h1.5Z" />
    </Svg>
  );
}

export function IconDocument(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 2h7l5 5v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V8h4.5L15 3.5ZM9 12h6v2H9v-2Zm0 4h6v2H9v-2Z" />
    </Svg>
  );
}

export function IconCancel(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.2 6.8-1.4-1.4L12 10.2 9.2 7.4 7.8 8.8 10.6 11.6 7.8 14.4l1.4 1.4 2.8-2.8 2.8 2.8 1.4-1.4-2.8-2.8 2.8-2.8Z" />
    </Svg>
  );
}

export function IconScale(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 7 8h3v2H5l7 11 7-11h-5V8h3l-5-5Zm0 14.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </Svg>
  );
}

export function IconHandshake(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10h3l2-2 3 3 4-4 3 3h3v2h-3l-3-3-4 4-3-3-2 2H4v-2Z" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
    </Svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm0 2a3 3 0 0 1 3 3v3H9V7a3 3 0 0 1 3-3Z" />
    </Svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10Z" />
    </Svg>
  );
}

export type ClauseIconKey =
  | "clipboard"
  | "document"
  | "home"
  | "shield"
  | "clock"
  | "cancel"
  | "scale"
  | "handshake";

const clauseIcons: Record<ClauseIconKey, (props: IconProps) => ReactNode> = {
  clipboard: IconClipboard,
  document: IconDocument,
  home: IconHome,
  shield: IconShield,
  clock: IconClock,
  cancel: IconCancel,
  scale: IconScale,
  handshake: IconHandshake,
};

export function ClauseIcon({ name, className }: { name: ClauseIconKey; className?: string }) {
  const Icon = clauseIcons[name];
  return <Icon className={className} width={14} height={14} />;
}

export const CLAUSE_ICON_MAP: Record<string, ClauseIconKey> = {
  DECLARACIONES: "clipboard",
  "PRIMERA. PAGOS": "document",
  "SEGUNDA. DOMICILIOS Y MEDIOS DE CONTACTO": "home",
  "TERCERA. INFORMACIÓN CREDITICIA": "shield",
  "CUARTA. COSTO ANUAL TOTAL (CAT)": "clock",
  "QUINTA. VERIFICACIÓN Y VALIDACIÓN DIGITAL": "shield",
  "SEXTA. COMISIONES, GASTOS ADMINISTRATIVOS Y PÓLIZA DE SEGURO OBLIGATORIO": "document",
  "SÉPTIMA. CANCELACIÓN DEL CONTRATO Y PENALIZACIÓN": "cancel",
  "OCTAVA. ACEPTACIÓN, LEGISLACIÓN Y JURISDICCIÓN": "scale",
};
