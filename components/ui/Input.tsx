import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="flex flex-col gap-2 text-sm" htmlFor={inputId}>
      <span className="font-bold text-[var(--color-text)]">{label}</span>
      <input
        id={inputId}
        className={`h-11 rounded-lg border border-slate-200 bg-white px-3.5 text-[var(--color-text)] outline-none ring-[var(--color-action)] transition placeholder:text-slate-400 focus:border-[var(--color-action)] focus:ring-2 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
    </label>
  );
}
