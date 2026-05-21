import type { ReactNode } from "react";

export function ContractSectionHeader({
  number,
  title,
  icon,
}: {
  number: number;
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#06245C] text-white">
        {icon}
      </span>
      <h2 className="rounded-r-lg bg-[#06245C] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
        {number}. {title}
      </h2>
    </div>
  );
}
