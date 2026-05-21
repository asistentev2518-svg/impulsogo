import Image from "next/image";
import type { ReactNode } from "react";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { CLAUSE_SECTIONS, CONTRACT_CLAUSES, type ContractClientData } from "@/lib/contract";
import { formatMXN } from "@/lib/finance";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#06245C] text-[10px] font-black text-white">
        IG
      </span>
      <h3 className="rounded-r-md bg-[#06245C] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-white">
        {children}
      </h3>
    </div>
  );
}

function DataBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
      <p className="text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 min-h-5 text-[11px] font-bold text-[#172033]">{value || " "}</p>
    </div>
  );
}

function PageShell({
  page,
  subtitle,
  children,
  qrDataUrl,
}: {
  page: number;
  subtitle: string;
  children: ReactNode;
  qrDataUrl?: string;
}) {
  return (
    <div className="print-page flex h-[1056px] w-[816px] flex-col bg-white p-9 text-[10.5px] leading-relaxed text-[#172033]">
      <header>
        <div className="flex items-start justify-between">
          <div className="w-24" />
          <div className="text-center">
            <Image src={ASSETS.logo} alt="Impulso Go" width={82} height={82} className="mx-auto" />
            <p className="mt-1 text-[12px] font-black text-[#06245C]">{INSTITUTION.legalName}</p>
          </div>
          <div className="flex w-24 flex-col items-end text-right">
            {qrDataUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR" width={70} height={70} />
                <p className="mt-1 text-[7.5px] leading-tight text-slate-500">
                  Escanea para validar la autenticidad de este documento.
                </p>
              </>
            ) : (
              <div className="h-[70px] w-[70px] border border-dashed border-slate-300" />
            )}
          </div>
        </div>
        <div className="my-2 flex items-center justify-center">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="mx-2 h-2 w-2 rounded-full bg-[#06245C]" />
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <h2 className="text-center text-[13px] font-black uppercase tracking-[0.08em] text-[#06245C]">
          {subtitle}
        </h2>
        <p className="text-center text-[9px] italic text-slate-500">Documento generado electrónicamente</p>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-4 border-t border-slate-200 pt-3">
        <div className="grid grid-cols-3 gap-3 text-[8.5px] leading-snug text-slate-600">
          <p>Empresa registrada ante la CONDUSEF.</p>
          <p>Tus datos están protegidos bajo estándares de seguridad documental.</p>
          <p>Documento generado electrónicamente con plena validez jurídica.</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 opacity-80">
            <Image src={ASSETS.condusef} alt="CONDUSEF" width={66} height={26} />
            <Image src={ASSETS.sipres} alt="SIPRES" width={70} height={26} />
          </div>
          <p className="text-[9px] font-bold text-slate-500">Página {page} de 3</p>
        </div>
      </footer>
    </div>
  );
}

export function ManualContractPage1({
  data,
  qrDataUrl,
}: {
  data: ContractClientData;
  qrDataUrl?: string;
}) {
  return (
    <PageShell
      page={1}
      subtitle="Contrato de crédito y otorgamiento de financiamiento"
      qrDataUrl={qrDataUrl}
    >
      <SectionTitle>1. Datos del cliente</SectionTitle>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <DataBox label="Nombre completo" value={data.fullName} />
        <DataBox label="CURP" value={data.curp} />
        <DataBox label="Teléfono" value={data.phone} />
        <DataBox label="Domicilio" value={data.address} />
      </div>

      <SectionTitle>2. Datos del financiamiento</SectionTitle>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-3 divide-x divide-slate-200">
          <div className="bg-white p-4 text-center">
            <p className="text-[9px] font-black uppercase text-slate-500">Monto solicitado</p>
            <p className="mt-2 text-[20px] font-black text-[#0A8F3C]">{formatMXN(data.amount)}</p>
          </div>
          <div className="bg-[#EAF4FF] p-4 text-center">
            <p className="text-[9px] font-black uppercase text-slate-500">Tasa anual ordinaria fija</p>
            <p className="mt-2 text-[24px] font-black text-[#06245C]">{INSTITUTION.annualRatePercent}%</p>
          </div>
          <div className="bg-white p-4 text-center">
            <p className="text-[9px] font-black uppercase text-slate-500">Plazo</p>
            <p className="mt-2 text-[20px] font-black text-[#06245C]">{data.termYears} años</p>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200">
          <DataBox label="Fecha de otorgamiento" value={data.grantDate} />
          <DataBox label="Fecha estimada de vencimiento" value={data.maturityDate} />
        </div>
      </div>
      <p className="mt-2 text-[8.5px] italic text-slate-500">
        La tasa anual ordinaria fija del {INSTITUTION.annualRatePercent}% es fija durante la vigencia del contrato. Valores referenciales sujetos a validación.
      </p>

      <SectionTitle>3. Datos bancarios</SectionTitle>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <DataBox label="Cuenta a acreditar" value={data.bankAccount} />
        <DataBox label="Banco" value={data.bankName} />
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-[#F8FAFC] p-3">
        <p className="text-[10px] text-slate-700">
          El CLIENTE declara que la información proporcionada es verdadera y correcta, y autoriza a
          IMPULSO GO para su verificación. La falsedad u omisión de datos podrá ser causa de
          cancelación del financiamiento y de las acciones legales que correspondan.
        </p>
      </div>
    </PageShell>
  );
}

export function ManualContractPage2({ qrDataUrl }: { qrDataUrl?: string }) {
  return (
    <PageShell page={2} subtitle="Declaraciones y cláusulas del contrato" qrDataUrl={qrDataUrl}>
      <div className="mt-4 space-y-3">
        <div>
          <SectionTitle>Declaraciones</SectionTitle>
          <div className="mt-2 rounded-lg border border-slate-200 p-3">
            <p className="whitespace-pre-line text-justify">{CLAUSE_SECTIONS[0].body}</p>
          </div>
        </div>
        {CLAUSE_SECTIONS.slice(1, 5).map((section) => (
          <div key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            <div className="mt-2 rounded-lg border border-slate-200 p-3">
              <p className="whitespace-pre-line text-justify">{section.body}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function ManualContractPage3({
  data,
  qrDataUrl,
}: {
  data: ContractClientData;
  qrDataUrl?: string;
}) {
  return (
    <PageShell page={3} subtitle="Cláusulas finales y aceptación" qrDataUrl={qrDataUrl}>
      <div className="mt-4 space-y-3">
        {CLAUSE_SECTIONS.slice(5).map((section) => (
          <div key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            <div className="mt-2 rounded-lg border border-slate-200 p-3">
              <p className="whitespace-pre-line text-justify">{section.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="font-bold text-[#06245C]">DECLARACIÓN FINAL DE ACEPTACIÓN:</p>
        <p className="mt-1 text-justify">{CONTRACT_CLAUSES.final.replace("DECLARACIÓN FINAL DE ACEPTACIÓN: ", "")}</p>
      </div>
      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-300">
        <div className="border-r border-slate-300 p-4">
          <p className="text-center text-[10px] font-black uppercase text-slate-700">Firma del cliente</p>
          <div className="mt-8 h-12 border-b border-slate-500" />
          <p className="mt-2 text-center text-[10px] font-bold">{data.fullName}</p>
        </div>
        <div className="p-4">
          <p className="text-center text-[10px] font-black uppercase text-slate-700">Representante legal</p>
          <div className="mt-8 h-12 border-b border-slate-500" />
          <p className="mt-2 text-center text-[10px] font-bold">{INSTITUTION.representative}</p>
          <p className="text-center text-[9px] text-slate-500">{INSTITUTION.representativeTitle}</p>
        </div>
      </div>
    </PageShell>
  );
}
