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

function BrandStrip({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src={ASSETS.logo} alt="Impulso Go" width={82} height={82} />
        <div>
          <p className={`text-xl font-black ${dark ? "text-white" : "text-[#06245C]"}`}>Impulso Go</p>
          <p className={`text-[13px] font-bold uppercase tracking-[0.18em] ${dark ? "text-white/55" : "text-[#64748B]"}`}>
            SOFOM, E.N.R.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3">
        <Image src={ASSETS.condusef} alt="CONDUSEF" width={96} height={38} />
        <Image src={ASSETS.sipres} alt="SIPRES" width={96} height={38} />
      </div>
    </div>
  );
}

function Shell({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  const danger = tone === "danger";

  return (
    <div
      className={`relative h-[1350px] w-[1080px] overflow-hidden p-14 ${
        danger ? "bg-[#12090B] text-white" : "bg-[#F7FAFF] text-[#172033]"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className={`absolute inset-x-0 top-0 h-5 ${danger ? "bg-[#D71920]" : "bg-[#06245C]"}`} />
      <BrandStrip dark={danger} />
      {children}
      <div className={`absolute bottom-0 left-0 right-0 px-14 py-8 ${danger ? "bg-black/35" : "bg-white"}`}>
        <div className="flex items-end justify-between gap-8">
          <p className={`max-w-2xl text-[15px] leading-6 ${danger ? "text-white/62" : "text-[#64748B]"}`}>
            {INSTITUTION.legalName}. Valores referenciales sujetos a evaluación crediticia,
            validación documental y condiciones contractuales.
          </p>
          <p className={`text-right text-[13px] font-bold ${danger ? "text-white/50" : "text-[#06245C]"}`}>
            {INSTITUTION.shortName}
            <br />
            Expediente trazable
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="border-b border-slate-200 py-4">
      <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className={`mt-1 text-2xl ${strong ? "font-black text-[#0A8F3C]" : "font-bold text-[#172033]"}`}>
        {value}
      </p>
    </div>
  );
}

export function ApprovalTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell>
      <div className="mt-16 grid gap-10">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1266D6]">Resultado preliminar</p>
          <h1 className="mt-4 max-w-3xl text-6xl font-black leading-[1.02] text-[#06245C]">
            Crédito aprobado para integración de expediente.
          </h1>
          <p className="mt-5 text-2xl font-semibold text-[#64748B]">{data.clientName}</p>
        </div>

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="rounded-lg bg-white p-8 shadow-[0_28px_70px_rgba(6,36,92,0.12)]">
            <Detail label="Monto aprobado" value={formatMXN(data.approvedAmount)} strong />
            <Detail label="Pago mensual estimado" value={formatMXN(data.monthlyPayment)} />
            <Detail label="Total estimado al vencimiento" value={formatMXN(data.totalPayment)} />
            <Detail label="Cuenta destino" value={data.maskedAccount} />
          </div>
          <div className="rounded-lg bg-[#06245C] p-8 text-white">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-200">Condiciones</p>
            <p className="mt-8 text-7xl font-black">7%</p>
            <p className="mt-1 text-xl font-bold text-white/70">Tasa anual ordinaria fija</p>
            <div className="mt-10 space-y-4 text-xl">
              <p>Plazo: <strong>{data.termYears} años</strong></p>
              <p>Comisión apertura: <strong>{formatMXN(data.openingCommission)}</strong></p>
              <p>Ejecutivo: <strong>{data.executive}</strong></p>
              <p>Folio: <strong>{data.expedienteFolio}</strong></p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#1266D6]/20 bg-white p-7">
          <p className="text-3xl font-black text-[#06245C]">Impulsa tus metas, nosotros te acompañamos.</p>
          <p className="mt-3 text-xl leading-8 text-[#64748B]">
            Para continuar se requiere validación documental, aceptación de condiciones y
            formalización del contrato correspondiente.
          </p>
        </div>
      </div>
    </Shell>
  );
}

export function CancellationTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell tone="danger">
      <div className="mt-14">
        <p className="inline-flex rounded-md bg-[#D71920] px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-white">
          Advertencia de cancelación
        </p>
        <h1 className="mt-6 max-w-3xl text-7xl font-black uppercase leading-[0.98] text-white">
          Penalización contractual aplicable.
        </h1>
        <p className="mt-6 text-3xl font-bold text-white/86">{data.clientName}</p>
      </div>

      <div className="mt-12 grid grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="rounded-lg border-2 border-[#D71920] bg-[#D71920] p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">Penalización</p>
          <p className="mt-5 text-8xl font-black text-white">10%</p>
          <p className="mt-4 text-2xl font-bold leading-tight text-white">
            Sobre el monto solicitado o saldo insoluto, según etapa del contrato.
          </p>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/8 p-8">
          <div className="border-b border-white/12 pb-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-red-200">Penalización calculada</p>
            <p className="mt-2 text-5xl font-black text-red-300">{formatMXN(data.penalty)}</p>
          </div>
          <div className="pt-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-red-200">Adeudo total de cancelación</p>
            <p className="mt-2 text-6xl font-black text-white">{formatMXN(data.cancellationDebt)}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-[#D71920]/70 bg-black/45 p-8">
        <p className="text-3xl font-black text-red-200">La cancelación no elimina obligaciones ya generadas.</p>
        <p className="mt-4 text-2xl leading-9 text-white/80">
          Cancelar implica cubrir saldo insoluto, intereses devengados, comisiones, gastos y la
          penalización pactada. El incumplimiento puede derivar en reportes a sociedades de
          información crediticia y acciones de cobro conforme al contrato.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-white/8 p-5">
          <p className="text-sm text-white/50">Folio</p>
          <p className="mt-2 text-xl font-black">{data.expedienteFolio}</p>
        </div>
        <div className="rounded-lg bg-white/8 p-5">
          <p className="text-sm text-white/50">Ejecutivo</p>
          <p className="mt-2 text-xl font-black">{data.executive}</p>
        </div>
        <div className="rounded-lg bg-white/8 p-5">
          <p className="text-sm text-white/50">Fecha CDMX</p>
          <p className="mt-2 text-xl font-black">{data.cdmxDateTime}</p>
        </div>
      </div>
    </Shell>
  );
}

export function PolicyTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell>
      <div className="mt-16">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1266D6]">Cobertura vinculada</p>
        <h1 className="mt-4 max-w-3xl text-6xl font-black leading-[1.02] text-[#06245C]">
          Póliza de seguro obligatorio.
        </h1>
        <p className="mt-5 text-2xl text-[#64748B]">
          Documento informativo para expediente y seguimiento del financiamiento.
        </p>
      </div>

      <div className="mt-12 rounded-lg bg-white p-8 shadow-[0_28px_70px_rgba(6,36,92,0.12)]">
        <Detail label="Cliente" value={data.clientName} />
        <Detail label="Número de póliza" value={data.policyNumber} />
        <Detail label="Vigencia hasta" value={data.policyValidUntil} />
        <Detail label="Saldo protegido referencial" value={formatMXN(data.approvedAmount)} strong />
        <Detail label="Folio expediente" value={data.expedienteFolio} />
      </div>

      <div className="mt-10 rounded-lg bg-[#EAF4FF] p-8">
        <p className="text-2xl font-black text-[#06245C]">Finalidad de cobertura</p>
        <p className="mt-4 text-xl leading-8 text-[#64748B]">
          Protección del saldo insoluto conforme a las condiciones de la póliza contratada y
          vinculada al financiamiento.
        </p>
      </div>
    </Shell>
  );
}

export function PrivacyNoticeTemplate({ data }: { data: InternalDocData }) {
  return (
    <Shell>
      <div className="mt-16">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1266D6]">Datos personales</p>
        <h1 className="mt-4 max-w-3xl text-6xl font-black leading-[1.02] text-[#06245C]">
          Aviso de privacidad para expediente.
        </h1>
      </div>

      <div className="mt-12 grid gap-6">
        <div className="rounded-lg bg-white p-8 shadow-[0_28px_70px_rgba(6,36,92,0.12)]">
          <p className="text-2xl leading-9 text-[#172033]">
            {INSTITUTION.legalName} trata identificación oficial, selfie, datos de contacto,
            información del financiamiento y evidencia técnica para formalizar contrato, validar
            identidad, prevenir fraude, integrar expediente y dar seguimiento conforme a la LFPDPPP.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-[#EAF4FF] p-6">
            <p className="text-sm font-black uppercase text-[#1266D6]">Folio</p>
            <p className="mt-2 text-xl font-black text-[#06245C]">{data.expedienteFolio}</p>
          </div>
          <div className="rounded-lg bg-[#EAF4FF] p-6">
            <p className="text-sm font-black uppercase text-[#1266D6]">Fecha CDMX</p>
            <p className="mt-2 text-xl font-black text-[#06245C]">{data.cdmxDateTime}</p>
          </div>
          <div className="rounded-lg bg-[#EAF4FF] p-6">
            <p className="text-sm font-black uppercase text-[#1266D6]">Asesor</p>
            <p className="mt-2 text-xl font-black text-[#06245C]">{data.advisorInitials}</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
