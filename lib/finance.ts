import { INSTITUTION } from "./config";

export const ANNUAL_RATE = 0.07;
export const ALLOWED_TERMS = INSTITUTION.allowedTermsYears;
export const MIN_AMOUNT = INSTITUTION.minAmount;
export const AMOUNT_INCREMENT = INSTITUTION.amountIncrement;
export const PENALTY_RATE = 0.1;

export type TermYears = (typeof ALLOWED_TERMS)[number];

export function calculateMonthlyPayment(amount: number, years: TermYears) {
  const monthlyRate = ANNUAL_RATE / 12;
  const months = years * 12;
  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const cuota = Math.round(monthlyPayment);
  const total = cuota * months;
  return { cuota, total, months, monthlyRate };
}

export function calculatePenalty(amount: number) {
  return Math.round(amount * PENALTY_RATE);
}

export function calculateCancellationDebt(balance: number, accruedInterest = 0) {
  const penalty = calculatePenalty(balance);
  return balance + accruedInterest + penalty;
}

export function formatMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function validateAmount(amount: number): string | null {
  if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
    return `El monto mínimo es ${formatMXN(MIN_AMOUNT)}.`;
  }
  if (amount % AMOUNT_INCREMENT !== 0) {
    return `El monto debe ser múltiplo de ${formatMXN(AMOUNT_INCREMENT)}.`;
  }
  return null;
}

export function validateTerm(years: number): string | null {
  if (!ALLOWED_TERMS.includes(years as TermYears)) {
    return "Seleccione un plazo válido (2, 4, 6 u 8 años).";
  }
  return null;
}

export function maskAccount(lastFour: string) {
  const digits = lastFour.replace(/\D/g, "").slice(-4);
  return `****${digits.padStart(4, "*")}`;
}

export function advisorInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

export function buildSimulationTable(amount: number) {
  return ALLOWED_TERMS.map((years) => {
    const { cuota, total } = calculateMonthlyPayment(amount, years);
    return { years, cuota, total };
  });
}

export const QUICK_AMOUNTS = [10000, 15000, 20000, 25000, 30000, 50000, 100000];
