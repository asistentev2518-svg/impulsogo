import { CLAUSE_ICON_MAP, ClauseIcon, type ClauseIconKey } from "./icons";

export function ContractClauseBlock({
  title,
  body,
  iconKey,
  compact = false,
}: {
  title: string;
  body: string;
  iconKey?: ClauseIconKey;
  compact?: boolean;
}) {
  const resolvedIcon = iconKey ?? CLAUSE_ICON_MAP[title] ?? "document";

  return (
    <div className={compact ? "mb-1.5" : "mb-3"}>
      <div className="flex items-center gap-2">
        <span className={`${compact ? "h-5 w-5" : "h-7 w-7"} flex shrink-0 items-center justify-center rounded-full bg-[#06245C] text-white`}>
          <ClauseIcon name={resolvedIcon} />
        </span>
        <h3 className={`${compact ? "px-2 py-0.5 text-[7.5px]" : "px-2.5 py-1 text-[9px]"} rounded-r-md bg-[#06245C] font-black uppercase leading-tight text-white`}>
          {title}
        </h3>
      </div>
      <div className={`rounded-lg border border-slate-200 bg-slate-50/80 ${compact ? "mt-1 p-1.5" : "mt-2 p-2.5"}`}>
        <p className={`whitespace-pre-line text-justify text-[#172033] ${compact ? "text-[7.2px] leading-[1.22]" : "text-[8.5px] leading-[1.45]"}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
