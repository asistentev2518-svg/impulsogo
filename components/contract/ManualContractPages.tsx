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

export type EditableContractClause = {
  title: string;
  body: string;
};

export type EditableContractSettings = {
  annualRatePercent?: string | number;
  legalName?: string;
  representative?: string;
  representativeTitle?: string;
  declarations?: string;
};

function getContractSections(
  settings?: EditableContractSettings,
  clauses?: EditableContractClause[],
) {
  if (!settings && !clauses) return CLAUSE_SECTIONS;
  return [
    {
      title: "DECLARACIONES",
      body: settings?.declarations?.trim() || CONTRACT_CLAUSES.declaraciones,
    },
    ...(clauses?.length ? clauses : CLAUSE_SECTIONS.slice(1)),
  ];
}

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function ContractPage1({
  data,
  qrDataUrl,
  mode = "blank",
  settings,
  showQr = true,
}: {
  data: ContractClientData;
  qrDataUrl?: string;
  mode?: ContractPageMode;
  settings?: EditableContractSettings;
  showQr?: boolean;
}) {
  const isBlank = mode === "blank";
  const [addr1, addr2, addr3] = splitAddressLines(data.address);
  const rate = settings?.annualRatePercent ?? INSTITUTION.annualRatePercent;

  return (
    <ContractPageShell
      page={1}
      pageTitle="Contrato de crédito y otorgamiento de financiamiento"
      qrDataUrl={qrDataUrl}
      legalName={settings?.legalName}
      showQr={showQr}
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
        <FinancingGrid data={data} mode={mode} ratePercent={rate} />
        <p className="mt-1.5 flex items-start gap-1 text-[8px] italic text-slate-500">
          <span className="font-bold">ⓘ</span>
          La tasa anual ordinaria fija del {rate}% es fija durante toda la vigencia del contrato.
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

      <DeclarationBox text={settings?.declarations} />
    </ContractPageShell>
  );
}

export function ContractPage2({
  qrDataUrl,
  compact = true,
  settings,
  clauses,
  showQr = true,
}: {
  qrDataUrl?: string;
  compact?: boolean;
  settings?: EditableContractSettings;
  clauses?: EditableContractClause[];
  showQr?: boolean;
}) {
  const sections = getContractSections(settings, clauses);

  return (
    <ContractPageShell
      page={2}
      pageTitle="Declaraciones y cláusulas del contrato"
      qrDataUrl={qrDataUrl}
      legalName={settings?.legalName}
      showQr={showQr}
    >
      <div className={compact ? "space-y-0" : "mt-1"}>
        {sections.slice(0, 7).map((section) => (
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
  compact = true,
  settings,
  clauses,
  showQr = true,
}: {
  data: ContractClientData;
  qrDataUrl?: string;
  signatureDataUrl?: string | null;
  compact?: boolean;
  settings?: EditableContractSettings;
  clauses?: EditableContractClause[];
  showQr?: boolean;
}) {
  const sections = getContractSections(settings, clauses);

  return (
    <ContractPageShell
      page={3}
      pageTitle="Cláusulas finales y aceptación"
      qrDataUrl={qrDataUrl}
      qrCaption="Escanea para verificar la autenticidad de este documento."
      legalName={settings?.legalName}
      showQr={showQr}
    >
      <div className={compact ? "" : "mt-1"}>
        {sections.slice(7).map((section) => (
          <ContractClauseBlock
            key={section.title}
            title={section.title}
            body={section.body}
            compact={compact}
          />
        ))}
      </div>

      <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50/80 p-2">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#06245C] text-white">
            <IconHandshake className="h-3.5 w-3.5" />
          </span>
          <p className="text-[9px] font-black uppercase text-[#06245C]">Declaración final de aceptación</p>
        </div>
        <p className="text-justify text-[7.5px] leading-[1.28] text-[#172033]">
          {CONTRACT_CLAUSES.final.replace("DECLARACIÓN FINAL DE ACEPTACIÓN: ", "")}
        </p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-slate-300">
        <div className="border-r border-slate-300 p-2.5">
          <p className="text-center text-[9px] font-black uppercase text-slate-700">Firma del cliente</p>
          <div className="mt-4 flex h-10 items-end justify-center border-b border-slate-500">
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
        <div className="p-2.5">
          <p className="text-center text-[9px] font-black uppercase text-slate-700">
            Firma del representante legal
          </p>
          <div className="relative mt-4 flex h-10 items-end justify-center">
            <div className="border-b border-slate-500 w-full absolute bottom-0" />
            <svg
              viewBox="0 0 160 48"
              className="h-10 w-40 relative z-10"
              style={{ transform: "rotate(-2deg)" }}
            >
              <defs>
                <linearGradient id="inkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06245C" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#0a3478" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06245C" stopOpacity="0.9" />
                </linearGradient>
                <filter id="handDrawn" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g fill="none" stroke="url(#inkGradient)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 36 Q14 32 18 28 Q24 22 30 24 Q34 26 36 30 Q38 35 42 32" opacity="0.85" />
                <path d="M38 14 Q40 24 44 28 Q50 34 56 30 Q62 24 66 28 Q70 32 74 34 Q78 36 82 32" filter="url(#handDrawn)" />
                <path d="M82 18 Q87 26 92 28 Q98 30 104 26 Q108 22 112 24 Q116 28 118 32" opacity="0.92" />
                <path d="M120 20 Q126 16 132 22 Q138 28 144 18" opacity="0.88" />
                <path d="M148 24 Q150 22 154 26 Q152 30 150 28" strokeOpacity="0.7" />
              </g>
              <text x="40" y="38" fill="#0a3478" fontSize="24" fontFamily="Brush Script MT, Segoe Script, cursive" fontWeight="400" opacity="0.95" style={{ letterSpacing: "-1px" }}>
                Claudia
              </text>
              <line x1="8" y1="42" x2="152" y2="42" stroke="#06245C" strokeWidth="1.2" opacity="0.75" strokeDasharray="none" />
              <line x1="10" y1="43" x2="150" y2="43" stroke="#06245C" strokeWidth="0.6" opacity="0.4" />
            </svg>
          </div>
          <p className="mt-2 text-center text-[9px] font-bold">
            {settings?.representative || INSTITUTION.representative}
          </p>
          <p className="text-center text-[8px] text-slate-500">
            Cargo: {settings?.representativeTitle || INSTITUTION.representativeTitle}
          </p>
        </div>
      </div>
    </ContractPageShell>
  );
}

/** Manual imprimible: monto y plazo en blanco para el cliente */
export function ManualContractPage1(props: {
  data: ContractClientData;
  qrDataUrl?: string;
  settings?: EditableContractSettings;
  showQr?: boolean;
}) {
  return <ContractPage1 {...props} mode="blank" />;
}

export function ManualContractPage2(props: {
  qrDataUrl?: string;
  settings?: EditableContractSettings;
  clauses?: EditableContractClause[];
  showQr?: boolean;
}) {
  return <ContractPage2 {...props} />;
}

export function ManualContractPage3(props: {
  data: ContractClientData;
  qrDataUrl?: string;
  settings?: EditableContractSettings;
  clauses?: EditableContractClause[];
  showQr?: boolean;
}) {
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
        <p className="mt-1 text-justify text-[8.5px] leading-relaxed">
          {CONTRACT_CLAUSES.final.replace("DECLARACIÓN FINAL DE ACEPTACIÓN: ", "")}
        </p>
      </div>
    </>
  );
}
