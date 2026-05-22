import { ASSETS } from "@/lib/config";

export const MAIN_LOGO = ASSETS.logo;
export const EXECUTIVES = ["Adela Tapia", "Ely Garcia", "Maritza Lopez"];
export const TERMS = [2, 4, 6, 8];
export const DOC_VERSION = "v1.0 - 2026";
export const PRIVACY_CONTACT = {
  email: "privacidad@impulsogo.mx",
  address: "Fresas 12, interior 10, Col. Tlacoquemécatl, C.P. 03200, Benito Juárez, Ciudad de México.",
};

export type DocKind = "aprobacion" | "cancelacion" | "poliza" | "aviso";

export const DOC_LABEL: Record<DocKind, string> = {
  aprobacion: "Aprobación",
  cancelacion: "Cancelación",
  poliza: "Póliza de seguro",
  aviso: "Aviso de privacidad",
};

export const DOC_FILE_PREFIX: Record<DocKind, string> = {
  aprobacion: "aprobacion",
  cancelacion: "cancelacion",
  poliza: "poliza",
  aviso: "aviso-privacidad",
};

export type MasterData = {
  name: string;
  amount: number;
  commission: number;
  account: string;
  termYears: number;
  executive: string;
  city: string;
  folio: string;
  folioCondusef: string;
  emittedAt: string;
};

export type Derived = {
  penalty: number;
  totalDue: number;
  months: number;
  monthly: number;
  totalToPay: number;
  annualRatePct: number;
  accountMasked: string;
  clabeMasked: string;
  rfc: string;
  initials: string;
  policyNumber: string;
  validFrom: string;
  validTo: string;
};

export const DEFAULT_MASTER: MasterData = {
  name: "Maria Fernanda Lopez",
  amount: 50000,
  commission: 970,
  account: "4575",
  termYears: 4,
  executive: "Adela Tapia",
  city: "CDMX",
  folio: "FIN-2026-00000",
  folioCondusef: "16103",
  emittedAt: "",
};

const ANNUAL_RATE = 0.07;

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatAccount(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `****${digits}`;
}

export function nowMx() {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function fakeCLABE(account: string) {
  const last4 = account.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `*** **** ****** ${last4}`;
}

export function fakeRFC(name: string) {
  const parts = name.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const last = parts[parts.length - 1] ?? "XXXX";
  const first = parts[0] ?? "X";
  let seed = 0;
  for (const ch of name) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const yy = ((seed % 40) + 60).toString().padStart(2, "0");
  const mm = (((seed >> 4) % 12) + 1).toString().padStart(2, "0");
  const dd = (((seed >> 8) % 28) + 1).toString().padStart(2, "0");
  return `${last.slice(0, 2)}${first[0] ?? "X"}${last[2] ?? "X"}${yy}${mm}${dd}***`;
}

export function todayMx() {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addMonths(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function offerDeadline72h() {
  const date = new Date();
  date.setHours(date.getHours() + 72);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function derive(master: MasterData): Derived {
  const principal = Math.max(0, master.amount || 0);
  const penalty = principal * 0.1;
  const months = Math.max(1, master.termYears * 12);
  const monthlyRate = ANNUAL_RATE / 12;
  const monthly =
    principal > 0
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : 0;
  const totalToPay = monthly * months;

  return {
    penalty,
    totalDue: principal + penalty,
    months,
    monthly,
    totalToPay,
    annualRatePct: ANNUAL_RATE * 100,
    accountMasked: formatAccount(master.account),
    clabeMasked: fakeCLABE(master.account),
    rfc: fakeRFC(master.name || "Cliente"),
    initials: initials(master.executive || "-"),
    policyNumber: master.folio.replace(/^FIN/, "POL"),
    validFrom: todayMx(),
    validTo: addMonths(master.termYears * 12),
  };
}

export function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "cliente"
  );
}

export function validateMaster(master: MasterData) {
  const errors: string[] = [];
  if (!master.name || master.name.trim().length < 3) {
    errors.push("Captura el nombre completo del cliente.");
  }
  if (!master.amount || master.amount <= 0) {
    errors.push("El monto aprobado debe ser mayor a cero.");
  }
  if (master.commission < 0) {
    errors.push("La comision no puede ser negativa.");
  }
  if (!/^\d{4}$/.test(master.account)) {
    errors.push("Los ultimos 4 digitos de cuenta deben ser 4 numeros.");
  }
  if (!master.termYears || master.termYears <= 0) {
    errors.push("Selecciona un plazo valido.");
  }
  if (!master.executive) {
    errors.push("Asigna un ejecutivo.");
  }
  if (!master.folio || !/FIN-\d{4}-\d{4,6}/.test(master.folio)) {
    errors.push("El folio de expediente no es valido.");
  }
  return errors;
}

export function whatsappText(doc: DocKind, master: MasterData) {
  const first = (master.name || "cliente").split(/\s+/)[0];
  switch (doc) {
    case "aprobacion":
      return `Hola ${first}, tu expediente ${master.folio} fue marcado como APROBADO. Te compartimos la constancia con el resumen de tu crédito y el QR de verificación institucional.`;
    case "cancelacion":
      return `Hola ${first}, tu expediente ${master.folio} fue marcado como CANCELADO. Te compartimos la notificación formal con el detalle del adeudo exigible y las acciones requeridas.`;
    case "poliza":
      return `Hola ${first}, te compartimos la constancia de póliza asociada a tu expediente ${master.folio}.`;
    case "aviso":
      return `Hola ${first}, te compartimos el Aviso de Privacidad integral correspondiente a tu expediente ${master.folio}.`;
  }
}
