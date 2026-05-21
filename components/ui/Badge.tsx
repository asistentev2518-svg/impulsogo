import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "danger";
}) {
  const tones = {
    default: "bg-[var(--color-surface)] text-[var(--color-institutional)]",
    success: "bg-emerald-50 text-[var(--color-success)]",
    danger: "bg-red-50 text-[var(--color-danger)]",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
