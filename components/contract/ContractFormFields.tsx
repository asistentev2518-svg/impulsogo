import { INSTITUTION } from "@/lib/config";
import { formatMXN } from "@/lib/finance";
import type { ContractClientData } from "@/lib/contract";
import { IconCalendar, IconShield } from "./icons";

export function FieldLine({
  label,
  value,
  blank = false,
  fullWidth = false,
  className = "",
}: {
  label: string;
  value?: string;
  blank?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  const display = blank ? "" : value?.trim() || "";
  return (
    <div className={fullWidth ? `col-span-2 ${className}` : className}>
      {label ? (
        <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">{label}</p>
      ) : null}
      {blank && !display ? (
        <div className="mt-1 min-h-[18px] border-b border-slate-400" />
      ) : (
        <p className="mt-0.5 min-h-[18px] border-b border-slate-300 text-[10.5px] font-semibold text-[#172033]">
          {display || "\u00A0"}
        </p>
      )}
    </div>
  );
}

export function FieldRadio({
  label,
  value,
  blank = false,
}: {
  label: string;
  value?: "Masculino" | "Femenino";
  blank?: boolean;
}) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-1.5 flex gap-4 text-[10px] font-semibold">
        <label className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded-full border-2 ${!blank && value === "Masculino" ? "border-[#06245C] bg-[#06245C]" : "border-slate-400"}`} />
          Masculino
        </label>
        <label className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded-full border-2 ${!blank && value === "Femenino" ? "border-[#06245C] bg-[#06245C]" : "border-slate-400"}`} />
          Femenino
        </label>
      </div>
    </div>
  );
}

export function FinancingGrid({
  data,
  mode = "blank",
  ratePercent = INSTITUTION.annualRatePercent,
}: {
  data: ContractClientData;
  mode?: "blank" | "filled";
  ratePercent?: string | number;
}) {
  const isBlank = mode === "blank";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="grid grid-cols-3 divide-x divide-slate-200">
        <div className="bg-white p-3 text-center">
          <p className="text-[8px] font-black uppercase text-slate-500">Monto solicitado</p>
          {isBlank ? (
            <div className="mx-auto mt-2 flex max-w-[140px] items-end justify-center gap-1 border-b border-slate-400 pb-1">
              <span className="text-lg font-black text-slate-400">$</span>
              <span className="min-h-[22px] flex-1" />
            </div>
          ) : (
            <p className="mt-2 text-[18px] font-black text-[#0A8F3C]">{formatMXN(data.amount ?? 0)}</p>
          )}
        </div>
        <div className="bg-[#EAF4FF] p-3 text-center">
          <p className="text-[8px] font-black uppercase text-slate-500">Tasa anual ordinaria fija</p>
          <p className="mt-1 text-[22px] font-black leading-none text-[#06245C]">{ratePercent}%</p>
          <p className="text-[8px] font-black uppercase text-[#06245C]">Anual fija</p>
        </div>
        <div className="bg-white p-3 text-center">
          <p className="text-[8px] font-black uppercase text-slate-500">Plazo en años</p>
          {isBlank ? (
            <div className="mx-auto mt-3 max-w-[100px] border-b border-slate-400 pb-1" />
          ) : (
            <p className="mt-2 text-[18px] font-black text-[#06245C]">{data.termYears ?? "—"} años</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200">
        <div className="p-3">
          <p className="text-[8px] font-black uppercase text-slate-500">Fecha de otorgamiento</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold">
            <IconCalendar className="h-3.5 w-3.5 text-slate-400" />
            {isBlank && !data.grantDate ? (
              <span className="text-slate-400">DD / MM / AAAA</span>
            ) : (
              <span className="border-b border-slate-300 pb-0.5">{data.grantDate || "DD / MM / AAAA"}</span>
            )}
          </div>
        </div>
        <div className="p-3">
          <p className="text-[8px] font-black uppercase text-slate-500">Fecha estimada de vencimiento</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold">
            <IconCalendar className="h-3.5 w-3.5 text-slate-400" />
            {isBlank ? (
              <span className="text-slate-400">DD / MM / AAAA</span>
            ) : (
              <span className="border-b border-slate-300 pb-0.5">{data.maturityDate || "—"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeclarationBox({ text }: { text?: string }) {
  return (
    <div className="mt-3 flex gap-2 rounded-lg border border-slate-200 bg-[#F1F5F9] p-3">
      <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-[#06245C]" />
      <p className="whitespace-pre-line text-[9px] leading-relaxed text-slate-700">
        {text ??
          "El CLIENTE declara que la información proporcionada es verdadera y correcta, y autoriza a IMPULSO GO para su verificación. La falsedad u omisión de datos podrá ser causa de cancelación del financiamiento y de las acciones legales que correspondan."}
      </p>
    </div>
  );
}

export function splitAddressLines(address: string) {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) return [parts[0], parts.slice(1, -1).join(", ") || "", parts[parts.length - 1]];
  if (parts.length === 2) return [parts[0], parts[1], ""];
  return [address, "", ""];
}
