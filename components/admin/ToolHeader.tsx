import type { ReactNode } from "react";

export function ToolHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-institutional)] md:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{description}</p>
        </div>
        {children ? <div className="shrink-0">{children}</div> : null}
      </div>
    </div>
  );
}

export function MetricTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
}) {
  const color =
    tone === "success"
      ? "text-[var(--color-success)]"
      : tone === "danger"
        ? "text-[var(--color-danger)]"
        : "text-[var(--color-institutional)]";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}
