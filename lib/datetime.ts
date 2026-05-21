import { DateTime } from "luxon";

const CDMX = "America/Mexico_City";

export function nowCdmx() {
  return DateTime.now().setZone(CDMX);
}

export function formatCdmxDateTime(value?: string | Date) {
  const dt = value
    ? DateTime.fromISO(typeof value === "string" ? value : value.toISOString()).setZone(CDMX)
    : nowCdmx();
  return dt.setLocale("es-MX").toFormat("dd/MM/yyyy HH:mm:ss");
}

export function formatCdmxDate(value?: string | Date) {
  const dt = value
    ? DateTime.fromISO(typeof value === "string" ? value : value.toISOString()).setZone(CDMX)
    : nowCdmx();
  return dt.setLocale("es-MX").toFormat("dd/MM/yyyy");
}

export function toUtcIso() {
  return DateTime.utc().toISO() ?? new Date().toISOString();
}
