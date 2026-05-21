import type { ReactNode } from "react";
import { INSTITUTION } from "@/lib/config";
import { CLAUSE_SECTIONS, CONTRACT_CLAUSES, type ContractClientData } from "@/lib/contract";
import { ContractClauseBlock } from "./ContractClauseBlock";
import { ContractPageShell } from "./ContractPageShell";
import { ContractSectionHeader } from "./ContractSectionHeader";
import {
  DeclarationBox,
  FieldLine,
  FieldRadio,
  FinancingGrid,
  splitAddressLines,
} from "./ContractFormFields";
import { IconBank, IconDollar, IconHandshake, IconPerson } from "./icons";

export type ContractPageMode = "blank" | "filled";

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function ContractPage1({
  data,
  qrDataUrl,
  mode = "blank",
}: {
  data: ContractClientData;
  qrDataUrl?: string;
  mode?: ContractPageMode;
}) {
  const isBlank = mode === "blank";
  const [addr1, addr2, addr3] = splitAddressLines(data.address);

  return (
    <ContractPageShell
      page={1}
      pageTitle="Contrato de crédito y otorgamiento de financiamiento"
      qrDataUrl={qrDataUrl}
    >
      <ContractSectionHeader
        number={1}
        title="Datos del cliente"
        icon={<IconPerson className="h-4 w-4" />}
      />
      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
        <div className="grid grid-cols-2 gap-3">
          <FieldLine label="Nombre completo" value={data.fullName} blank={isBlank} fullWidth />
          <FieldLine label="CURP" value={data.curp} blank={isBlank} />
          <FieldRadio label="Sexo" value={data.gender} blank={isBlank} />
          <FieldLine label="Teléfono" value={formatPhoneDisplay(data.phone)} blank={isBlank} />
          <FieldLine label="Ingresos mensuales" value={data.monthlyIncome} blank={isBlank} />
          <div className="col-span-2 space-y-2">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">Domicilio</p>
            <FieldLine label="" value={addr1} blank={isBlank && !addr1} />
            <FieldLine label="" value={addr2} blank={isBlank && !addr2} />
            <FieldLine label="" value={addr3} blank={isBlank && !addr3} />
          </div>
        </div>
      </div>

      <ContractSectionHeader
        number={2}
        title="Datos del financiamiento"
        icon={<IconDollar className="h-4 w-4" />}
      />
      <div className="mt-2">
        <FinancingGrid data={data} mode={mode} />
        <p className="mt-1.5 flex items-start gap-1 text-[8px] italic text-slate-500">
          <span className="font-bold">ⓘ</span>
          La tasa anual ordinaria fija del {INSTITUTION.annualRatePercent}% es fija durante toda la vigencia del contrato.
        </p>
      </div>

      <ContractSectionHeader
        number={3}
        title="Datos bancarios"
        icon={<IconBank className="h-4 w-4" />}
      />
      <div className="mt-2 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
        <FieldLine label="Cuenta a acreditar" value={data.bankAccount} blank={isBlank} />
        <FieldLine label="Nombre del banco" value={data.bankName} blank={isBlank} />
      </div>

      <DeclarationBox />
    </ContractPageShell>
  );
}

export function ContractPage2({
  qrDataUrl,
  compact = false,
}: {
  qrDataUrl?: string;
  compact?: boolean;
}) {
  return (
    <ContractPageShell
      page={2}
      pageTitle="Declaraciones y cláusulas del contrato"
      qrDataUrl={qrDataUrl}
    >
      <div className={compact ? "space-y-0" : "mt-1"}>
        {CLAUSE_SECTIONS.slice(0, 5).map((section) => (
          <ContractClauseBlock
            key={section.title}
            title={section.title}
            body={section.body}
            compact={compact}
          />
        ))}
      </div>
    </ContractPageShell>
  );
}

export function ContractPage3({
  data,
  qrDataUrl,
  signatureDataUrl,
  compact = false,
}: {
  data: ContractClientData;
  qrDataUrl?: string;
  signatureDataUrl?: string | null;
  compact?: boolean;
}) {
  return (
    <ContractPageShell
      page={3}
      pageTitle="Cláusulas finales y aceptación"
      qrDataUrl={qrDataUrl}
      qrCaption="Escanea para verificar la autenticidad de este documento."
    >
      <div className={compact ? "" : "mt-1"}>
        {CLAUSE_SECTIONS.slice(5).map((section) => (
          <ContractClauseBlock
            key={section.title}
            title={section.title}
            body={section.body}
            compact={compact}
          />
        ))}
      </div>

      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#06245C] text-white">
            <IconHandshake className="h-3.5 w-3.5" />
          </span>
          <p className="text-[9px] font-black uppercase text-[#06245C]">Declaración final de aceptación</p>
        </div>
        <p className="text-[8.5px] leading-relaxed text-justify text-[#172033]">
          {CONTRACT_CLAUSES.final.replace("DECLARACIÓN FINAL DE ACEPTACIÓN: ", "")}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-slate-300">
        <div className="border-r border-slate-300 p-3">
          <p className="text-center text-[9px] font-black uppercase text-slate-700">Firma del cliente</p>
          <div className="mt-6 flex h-10 items-end justify-center border-b border-slate-500">
            {signatureDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={signatureDataUrl} alt="Firma" className="max-h-9 max-w-full object-contain" />
            ) : null}
          </div>
          <p className="mt-2 text-center text-[9px] font-bold">{data.fullName || "Nombre completo"}</p>
          <p className="mt-1 text-center text-[8px] text-slate-500">
            Fecha: {data.signatureDate || "DD / MM / AAAA"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-[9px] font-black uppercase text-slate-700">Firma del representante legal</p>
          <div className="mt-6 h-10 border-b border-slate-500" />
          <p className="mt-2 text-center text-[9px] font-bold">{INSTITUTION.representative}</p>
          <p className="text-center text-[8px] text-slate-500">Cargo: {INSTITUTION.representativeTitle}</p>
        </div>
      </div>
    </ContractPageShell>
  );
}

/** Manual imprimible: monto y plazo en blanco para el cliente */
export function ManualContractPage1(props: { data: ContractClientData; qrDataUrl?: string }) {
  return <ContractPage1 {...props} mode="blank" />;
}

export function ManualContractPage2(props: { qrDataUrl?: string }) {
  return <ContractPage2 {...props} />;
}

export function ManualContractPage3(props: { data: ContractClientData; qrDataUrl?: string }) {
  return <ContractPage3 {...props} />;
}

/** Bloque de cláusulas para vista previa en wizard (sin shell de página) */
export function ContractClausesPreview({ children }: { children?: ReactNode }) {
  return <div className="space-y-0">{children}</div>;
}

export function ContractClausesPreviewContent() {
  return (
    <>
      {CLAUSE_SECTIONS.map((section) => (
        <ContractClauseBlock key={section.title} title={section.title} body={section.body} compact />
      ))}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-[9px] font-black uppercase text-[#06245C]">Declaración final de aceptación</p>
        <p className="mt-1 text-[8.5px] leading-relaxed text-justify">
          {CONTRACT_CLAUSES.final.replace("DECLARACIÓN FINAL DE ACEPTACIÓN: ", "")}
        </p>
      </div>
    </>
  );
}
