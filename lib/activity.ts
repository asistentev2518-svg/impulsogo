"use client";

export type ActivityKind =
  | "contrato_digital"
  | "contrato_manual"
  | "documento"
  | "tabla"
  | "configuracion";

export type ActivityRecord = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  createdAt: string;
  expiresAt: string;
};

const STORAGE_KEY = "impulso:recent-activity";
const TTL_MS = 72 * 60 * 60 * 1000;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readRaw(): ActivityRecord[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActivityRecord[]) : [];
  } catch {
    return [];
  }
}

function write(records: ActivityRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 40)));
}

export function purgeExpiredActivity(records = readRaw()) {
  const now = Date.now();
  const active = records.filter((record) => new Date(record.expiresAt).getTime() > now);
  write(active);
  return active;
}

export function getRecentActivity() {
  return purgeExpiredActivity().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function recordActivity(input: {
  kind: ActivityKind;
  title: string;
  detail: string;
}) {
  if (!canUseStorage()) return;
  const now = new Date();
  const record: ActivityRecord = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: input.kind,
    title: input.title,
    detail: input.detail,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + TTL_MS).toISOString(),
  };
  write([record, ...purgeExpiredActivity()]);
  window.dispatchEvent(new CustomEvent("impulso:activity"));
}

export function clearRecentActivity() {
  write([]);
  window.dispatchEvent(new CustomEvent("impulso:activity"));
}
