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
    <div className={compact ? "mb-2.5" : "mb-3"}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#06245C] text-white">
          <ClauseIcon name={resolvedIcon} />
        </span>
        <h3 className="rounded-r-md bg-[#06245C] px-2.5 py-1 text-[9px] font-black uppercase leading-tight text-white">
          {title}
        </h3>
      </div>
      <div className={`rounded-lg border border-slate-200 bg-slate-50/80 ${compact ? "mt-1.5 p-2" : "mt-2 p-2.5"}`}>
        <p className={`whitespace-pre-line text-justify text-[#172033] ${compact ? "text-[8px] leading-[1.35]" : "text-[8.5px] leading-[1.45]"}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
