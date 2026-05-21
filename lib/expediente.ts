import { promises as fs } from "fs";
import path from "path";
import { maskName } from "./sanitize";
import { sha256Canonical } from "./hash";
import { formatCdmxDateTime, toUtcIso } from "./datetime";

export type ExpedienteStatus = "valido" | "revocado" | "no_encontrado";

export type ExpedienteRecord = {
  folio: string;
  tipo: "contrato_digital" | "contrato_manual";
  status: ExpedienteStatus;
  clientNameMasked: string;
  hash: string;
  createdAtCdmx: string;
  createdAtUtc: string;
  amount?: number;
  termYears?: number;
};

const DATA_DIR = path.join(process.cwd(), "data", "expedientes");

function filePath(folio: string) {
  const safe = folio.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(DATA_DIR, `${safe}.json`);
}

export async function saveExpediente(record: ExpedienteRecord) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath(record.folio), JSON.stringify(record, null, 2), "utf8");
}

export async function getExpediente(folio: string): Promise<ExpedienteRecord | null> {
  try {
    const raw = await fs.readFile(filePath(folio), "utf8");
    return JSON.parse(raw) as ExpedienteRecord;
  } catch {
    return null;
  }
}

export async function listExpedientes(): Promise<ExpedienteRecord[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const files = await fs.readdir(DATA_DIR);
    const records: ExpedienteRecord[] = [];
    for (const file of files) {
      if (!file.endsWith(".json") || file.startsWith("_")) continue;
      const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
      records.push(JSON.parse(raw) as ExpedienteRecord);
    }
    return records.sort((a, b) => b.createdAtUtc.localeCompare(a.createdAtUtc));
  } catch {
    return [];
  }
}

export function buildExpedienteHashPayload(input: {
  folio: string;
  fullName: string;
  curp: string;
  phone: string;
  address: string;
  amount: number;
  termYears: number;
  acceptances: Record<string, string>;
  device: { browser: string; device: string; userAgent: string };
  createdAtCdmx: string;
  createdAtUtc: string;
}) {
  return {
    folio: input.folio,
    cliente: input.fullName,
    curp: input.curp,
    telefono: input.phone,
    domicilio: input.address,
    monto: input.amount,
    plazoAnios: input.termYears,
    aceptaciones: input.acceptances,
    dispositivo: input.device,
    fechaCdmx: input.createdAtCdmx,
    fechaUtc: input.createdAtUtc,
    evidencia: {
      ineFrente: true,
      ineReverso: true,
      selfieIne: true,
      firmaDigital: true,
    },
  };
}

export async function createDigitalExpedienteRecord(input: {
  folio: string;
  fullName: string;
  amount: number;
  termYears: number;
  hashPayload: Record<string, unknown>;
}) {
  const hash = sha256Canonical(input.hashPayload);
  const record: ExpedienteRecord = {
    folio: input.folio,
    tipo: "contrato_digital",
    status: "valido",
    clientNameMasked: maskName(input.fullName),
    hash,
    createdAtCdmx: formatCdmxDateTime(),
    createdAtUtc: toUtcIso(),
    amount: input.amount,
    termYears: input.termYears,
  };
  await saveExpediente(record);
  return record;
}
