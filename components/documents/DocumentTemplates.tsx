import Image from "next/image";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { formatMXN } from "@/lib/finance";

export type InternalDocData = {
  clientName: string;
  approvedAmount: number;
  openingCommission: number;
  accountLastFour: string;
  termYears: number;
  executive: string;
  branchCity: string;
  expedienteFolio: string;
  condusefFolio: string;
  cdmxDateTime: string;
  monthlyPayment: number;
  totalPayment: number;
  penalty: number;
  cancellationDebt: number;
  maskedAccount: string;
  policyNumber: string;
  policyValidUntil: string;
  advisorInitials: string;
};

function Shell({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  const bg =
    tone === "danger"
      ? "bg-gradient-to-b from-[#1a1a1a] to-[#3b0a0a] text-white"
      : "bg-white text-[#172033]";
  return (
    <div
      className={`relative h-[1350px] w-[1080px] overflow-hidden p-12 ${bg}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="flex items-center justify-between">
        <Image src={ASSETS.logo} alt="Impulso Go" width={72} height={72} />
        <Image src={ASSETS.sipres} alt="SIPRES" width={90} height={36} />
      </div>
      {children}
      <p className="absolute bottom-8 left-12 right-12 text-center text-xs opacity-70">
        {INSTITUTION.legalName} · Valores referenciales. Sujeto a evaluación crediticia.
      </p>
    </div>
  );
}

export function ApprovalTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell>
      <h1 className="mt-10 text-4xl font-bold text-[#06245C]">Aprobación de crédito</h1>
      <p className="mt-4 text-xl text-[#64748B]">{data.clientName}</p>
      <div className="mt-10 space-y-4 rounded-3xl bg-[#EAF4FF] p-8 text-2xl">
        <p>
          Monto aprobado: <strong className="text-[#0A8F3C]">{formatMXN(data.approvedAmount)}</strong>
        </p>
        <p>Plazo: {data.termYears} años · Tasa 7% anual fija</p>
        <p>Pago mensual estimado: {formatMXN(data.monthlyPayment)}</p>
        <p>Total estimado: {formatMXN(data.totalPayment)}</p>
        <p>Cuenta: {data.maskedAccount}</p>
        <p>Ejecutivo: {data.executive}</p>
        <p>Folio: {data.expedienteFolio}</p>
      </div>
      <p className="mt-8 text-lg">Impulsa tus metas, nosotros te acompañamos.</p>
    </Shell>
  );
}

export function CancellationTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell tone="danger">
      <h1 className="mt-10 text-5xl font-black uppercase text-red-500">Aviso de cancelación</h1>
      <p className="mt-6 text-3xl font-bold">{data.clientName}</p>
      <div className="mt-10 space-y-5 rounded-3xl border-2 border-red-500 bg-black/40 p-8 text-2xl">
        <p className="font-bold text-red-400">
          Penalización del 10% aplicable conforme al contrato.
        </p>
        <p>Penalización calculada: {formatMXN(data.penalty)}</p>
        <p className="text-red-200">Adeudo total de cancelación: {formatMXN(data.cancellationDebt)}</p>
        <p>
          Cancelar implica cubrir saldo insoluto, intereses devengados y penalización. Esta acción
          puede afectar su historial crediticio.
        </p>
      </div>
      <p className="mt-8 text-xl font-semibold text-red-300">
        Documento contundente de advertencia. No implica negociación automática.
      </p>
    </Shell>
  );
}

export function PolicyTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell>
      <h1 className="mt-10 text-4xl font-bold text-[#06245C]">Póliza de seguro obligatorio</h1>
      <div className="mt-10 space-y-4 text-2xl">
        <p>Cliente: {data.clientName}</p>
        <p>Número de póliza: {data.policyNumber}</p>
        <p>Vigencia hasta: {data.policyValidUntil}</p>
        <p>Saldo protegido referencial: {formatMXN(data.approvedAmount)}</p>
      </div>
    </Shell>
  );
}

export function PrivacyNoticeTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell>
      <h1 className="mt-10 text-4xl font-bold text-[#06245C]">Aviso de privacidad</h1>
      <p className="mt-6 text-xl leading-relaxed text-[#64748B]">
        {INSTITUTION.legalName} trata identificación oficial, selfie, datos de contacto y
        financiamiento para formalizar contrato, validar identidad, prevenir fraude y conservar
        expediente conforme a la LFPDPPP.
      </p>
      <p className="mt-6 text-lg">Folio expediente: {data.expedienteFolio}</p>
      <p className="text-lg">Fecha CDMX: {data.cdmxDateTime}</p>
    </Shell>
  );
}
