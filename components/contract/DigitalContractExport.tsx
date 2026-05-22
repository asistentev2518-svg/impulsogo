import type { ContractClientData } from "@/lib/contract";
import { ContractPage1, ContractPage2, ContractPage3 } from "./ManualContractPages";
import { ContractPageShell } from "./ContractPageShell";

export function DigitalContractPage1({
  data,
}: {
  data: ContractClientData;
}) {
  return <ContractPage1 data={data} mode="filled" showQr={false} />;
}

export function DigitalContractPage2() {
  return <ContractPage2 showQr={false} />;
}

export function DigitalContractPage3({
  data,
  signatureDataUrl,
}: {
  data: ContractClientData;
  signatureDataUrl?: string | null;
}) {
  return <ContractPage3 data={data} signatureDataUrl={signatureDataUrl} showQr={false} />;
}

export function DigitalEvidenceAnnex({
  evidence,
  qrDataUrl,
}: {
  evidence: {
    folio: string;
    hash: string;
    createdAtCdmx: string;
    createdAtUtc?: string;
    browser: string;
    device: string;
    userAgent?: string;
  };
  qrDataUrl?: string;
}) {
  return (
    <ContractPageShell
      page={4}
      pageTitle="Anexo de evidencia digital"
      qrDataUrl={qrDataUrl}
      qrCaption="Verificar expediente en línea."
      pageLabel="Anexo de evidencia"
    >
      <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-[10px]">
        <p>
          <strong>Folio:</strong> {evidence.folio}
        </p>
        <p className="break-all">
          <strong>Hash SHA-256:</strong> {evidence.hash}
        </p>
        <p>
          <strong>Fecha CDMX:</strong> {evidence.createdAtCdmx}
        </p>
        {evidence.createdAtUtc ? (
          <p>
            <strong>Timestamp UTC:</strong> {evidence.createdAtUtc}
          </p>
        ) : null}
        <p>
          <strong>Navegador:</strong> {evidence.browser}
        </p>
        <p>
          <strong>Dispositivo:</strong> {evidence.device}
        </p>
        {evidence.userAgent ? (
          <p className="break-all text-[8px] text-slate-500">
            <strong>User agent:</strong> {evidence.userAgent}
          </p>
        ) : null}
        <p>
          Identificación oficial: INE frente, INE reverso y selfie con INE integradas al expediente digital.
        </p>
        <p className="text-[9px] text-slate-600">
          La firma electrónica, INE, selfie y aceptaciones integran el expediente con fines de trazabilidad y
          conservación documental conforme al aviso de privacidad.
        </p>
      </div>
      <p className="mt-4 text-center text-[8px] text-slate-500">Anexo técnico — no sustituye el contrato principal</p>
    </ContractPageShell>
  );
}
