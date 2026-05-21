import { NextResponse } from "next/server";
import {
  createDigitalExpedienteRecord,
  getExpediente,
  listExpedientes,
} from "@/lib/expediente";
import { generateFolio } from "@/lib/folio";
import { getServerSession } from "@/lib/session";
import { buildExpedienteHashPayload } from "@/lib/expediente";
import { formatCdmxDateTime, toUtcIso } from "@/lib/datetime";
import { getClientDeviceFromHeaders } from "@/lib/device";
import { sanitizeText } from "@/lib/sanitize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folio = searchParams.get("folio");

  if (folio) {
    const record = await getExpediente(folio);
    if (!record) {
      return NextResponse.json({ status: "no_encontrado" }, { status: 404 });
    }
    return NextResponse.json(record);
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const records = await listExpedientes();
  return NextResponse.json(records);
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

  const folio = await generateFolio();
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

  const record = await createDigitalExpedienteRecord({
    folio,
    fullName,
    amount,
    termYears,
    hashPayload,
  });

  return NextResponse.json({ record, hashPayload });
}
