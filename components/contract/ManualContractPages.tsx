import Image from "next/image";
import type { ReactNode } from "react";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { CLAUSE_SECTIONS, type ContractClientData } from "@/lib/contract";
import { formatMXN } from "@/lib/finance";

function PageShell({
  page,
  children,
  qrDataUrl,
}: {
  page: number;
  children: ReactNode;
  qrDataUrl?: string;
}) {
  return (
    <div className="w-[816px] bg-white p-10 text-[11px] leading-relaxed text-[#172033]">
      <div className="mb-4 flex items-start justify-between">
        <Image src={ASSETS.logo} alt="Impulso Go" width={56} height={56} />
        {qrDataUrl ? (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR" width={80} height={80} />
            <p className="mt-1 max-w-[110px] text-[9px]">
              Escanea para validar la autenticidad de este documento.
            </p>
          </div>
        ) : null}
      </div>
      <h2 className="text-sm font-bold text-[#06245C]">
        CONTRATO DE CRÉDITO Y OTORGAMIENTO DE FINANCIAMIENTO
      </h2>
      <p className="text-xs text-[#64748B]">Documento generado electrónicamente</p>
      {children}
      <div className="mt-8 flex items-end justify-between border-t border-slate-200 pt-3">
        <div className="flex gap-2">
          <Image src={ASSETS.condusef} alt="CONDUSEF" width={60} height={24} />
          <Image src={ASSETS.sipres} alt="SIPRES" width={60} height={24} />
        </div>
        <p className="text-[9px] text-[#64748B]">Página {page} de 3</p>
      </div>
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
    <PageShell page={1} qrDataUrl={qrDataUrl}>
      <div className="mt-4 space-y-2 rounded-lg bg-[#EAF4FF] p-4">
        <p>
          <strong>Cliente:</strong> {data.fullName}
        </p>
        <p>
          <strong>CURP:</strong> {data.curp}
        </p>
        <p>
          <strong>Teléfono:</strong> {data.phone}
        </p>
        <p>
          <strong>Domicilio:</strong> {data.address}
        </p>
        <p>
          <strong>Monto:</strong> {formatMXN(data.amount)}
        </p>
        <p>
          <strong>Plazo:</strong> {data.termYears} años
        </p>
        <p>
          <strong>Fecha de otorgamiento:</strong> {data.grantDate}
        </p>
        <p>
          <strong>Vencimiento estimado:</strong> {data.maturityDate}
        </p>
        <p>
          <strong>Cuenta a acreditar:</strong> {data.bankAccount}
        </p>
        <p>
          <strong>Banco:</strong> {data.bankName}
        </p>
      </div>
    </PageShell>
  );
}

export function ManualContractPage2({ qrDataUrl }: { qrDataUrl?: string }) {
  return (
    <PageShell page={2} qrDataUrl={qrDataUrl}>
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-bold text-[#06245C]">DECLARACIONES</h3>
          <p className="whitespace-pre-line">{CLAUSE_SECTIONS[0].body}</p>
        </div>
        {CLAUSE_SECTIONS.slice(1, 5).map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-[#06245C]">{section.title}</h3>
            <p className="whitespace-pre-line">{section.body}</p>
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
    <PageShell page={3} qrDataUrl={qrDataUrl}>
      <div className="mt-4 space-y-4">
        {CLAUSE_SECTIONS.slice(5).map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-[#06245C]">{section.title}</h3>
            <p className="whitespace-pre-line">{section.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs text-[#64748B]">Firma del cliente</p>
          <div className="mt-8 h-14 border-b border-slate-400" />
          <p className="mt-2">{data.fullName}</p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Representante legal</p>
          <div className="mt-8 h-14 border-b border-slate-400" />
          <p className="mt-2">{INSTITUTION.representative}</p>
        </div>
      </div>
    </PageShell>
  );
}
