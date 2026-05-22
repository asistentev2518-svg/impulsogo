import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { buildExpedienteHashPayload } from "@/lib/expediente-payload";
import { formatCdmxDateTime, toUtcIso } from "@/lib/datetime";
import { getClientDeviceFromHeaders } from "@/lib/device";
import { maskName, sanitizeText } from "@/lib/sanitize";
import { sha256Canonical } from "@/lib/hash";

function generateTransientFolio() {
  const year = new Date().getFullYear();
  const seed = `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
  return `IG-${year}-${seed.slice(-6)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folio = searchParams.get("folio");

  if (folio) {
    return NextResponse.json(
      { status: "no_encontrado", folio, message: "Los expedientes no se guardan en servidor." },
      { status: 404 },
    );
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    curp?: string;
    phone?: string;
    address?: string;
    amount?: number;
    termYears?: number;
    acceptances?: Record<string, string>;
  };

  const fullName = sanitizeText(body.fullName ?? "", 120);
  const curp = sanitizeText(body.curp ?? "", 20).toUpperCase();
  const phone = sanitizeText(body.phone ?? "", 15);
  const address = sanitizeText(body.address ?? "", 300);
  const amount = Number(body.amount);
  const termYears = Number(body.termYears);

  if (!fullName || !curp || !phone || !address || !amount || !termYears) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const folio = generateTransientFolio();
  const createdAtCdmx = formatCdmxDateTime();
  const createdAtUtc = toUtcIso();
  const device = getClientDeviceFromHeaders(request.headers.get("user-agent"));

  const hashPayload = buildExpedienteHashPayload({
    folio,
    fullName,
    curp,
    phone,
    address,
    amount,
    termYears,
    acceptances: body.acceptances ?? {},
    device,
    createdAtCdmx,
    createdAtUtc,
  });

  const record = {
    folio,
    tipo: "contrato_digital",
    status: "valido",
    clientNameMasked: maskName(fullName),
    hash: sha256Canonical(hashPayload),
    createdAtCdmx,
    createdAtUtc,
    fullName,
    amount,
    termYears,
    expiresAtUtc: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  };

  return NextResponse.json({ record, hashPayload });
}
