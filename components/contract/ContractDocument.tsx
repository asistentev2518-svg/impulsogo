import Image from "next/image";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { CLAUSE_SECTIONS, type ContractClientData } from "@/lib/contract";
import { formatMXN } from "@/lib/finance";

export function ContractDocument({
  data,
  qrDataUrl,
  showEvidence = false,
  evidence,
}: {
  data: ContractClientData;
  qrDataUrl?: string;
  showEvidence?: boolean;
  evidence?: {
    hash: string;
    folio: string;
    createdAtCdmx: string;
    browser: string;
    device: string;
  };
}) {
  return (
    <div className="w-[816px] bg-white p-10 text-[11px] leading-relaxed text-[#172033]">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Image src={ASSETS.logo} alt="Impulso Go" width={64} height={64} />
          <div>
            <p className="text-sm font-bold text-[#06245C]">{INSTITUTION.legalName}</p>
            <p className="text-xs text-[#64748B]">
              CONTRATO DE CRÉDITO Y OTORGAMIENTO DE FINANCIAMIENTO
            </p>
          </div>
        </div>
        {qrDataUrl ? (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR" width={90} height={90} />
            <p className="mt-1 max-w-[120px] text-[9px]">
              Escanea para validar la autenticidad de este documento.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-[#EAF4FF] p-4">
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
          <strong>Tasa:</strong> {INSTITUTION.annualRatePercent}% anual ordinaria fija
        </p>
        <p>
          <strong>Cuota mensual estimada:</strong> {formatMXN(data.monthlyPayment)}
        </p>
        <p>
          <strong>Monto final estimado:</strong> {formatMXN(data.totalAtMaturity)}
        </p>
        {data.folio ? (
          <p>
            <strong>Folio:</strong> {data.folio}
          </p>
        ) : null}
      </div>

      {CLAUSE_SECTIONS.map((section) => (
        <div key={section.title} className="mb-4">
          <h3 className="mb-1 text-xs font-bold text-[#06245C]">{section.title}</h3>
          <p className="whitespace-pre-line">{section.body}</p>
        </div>
      ))}

      <div className="mt-6 border-t border-slate-200 pt-4">
        <p className="font-semibold text-[#06245C]">DECLARACIÓN FINAL DE ACEPTACIÓN</p>
        <p className="mt-2 whitespace-pre-line">
          EL CLIENTE reconoce que la firma del presente contrato refleja su voluntad de obligarse
          en los términos aquí establecidos.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="mb-8 text-xs text-[#64748B]">Firma del cliente</p>
          <div className="h-16 border-b border-slate-400" />
          <p className="mt-2 font-medium">{data.fullName}</p>
        </div>
        <div>
          <p className="mb-8 text-xs text-[#64748B]">Representante legal</p>
          <div className="h-16 border-b border-slate-400" />
          <p className="mt-2 font-medium">{INSTITUTION.representative}</p>
          <p className="text-xs">{INSTITUTION.representativeTitle}</p>
        </div>
      </div>

      {showEvidence && evidence ? (
        <div className="mt-8 rounded-lg border border-slate-200 p-4">
          <h3 className="font-bold text-[#06245C]">Anexo de evidencia digital</h3>
          <p className="mt-2">Folio: {evidence.folio}</p>
          <p>Hash SHA-256: {evidence.hash}</p>
          <p>Fecha CDMX: {evidence.createdAtCdmx}</p>
          <p>Navegador: {evidence.browser}</p>
          <p>Dispositivo: {evidence.device}</p>
          <p className="mt-2 text-[10px] text-[#64748B]">
            La firma electrónica, INE, selfie y aceptaciones integran el expediente con fines de
            trazabilidad y conservación documental.
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3">
          <Image src={ASSETS.condusef} alt="CONDUSEF" width={70} height={28} />
          <Image src={ASSETS.sipres} alt="SIPRES" width={70} height={28} />
        </div>
        <p className="max-w-xs text-right text-[9px] text-[#64748B]">
          Empresa registrada ante la CONDUSEF. Documento generado electrónicamente con plena validez
          jurídica.
        </p>
      </div>
    </div>
  );
}
