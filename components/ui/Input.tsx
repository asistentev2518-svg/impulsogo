import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = "",
  id,
  required,
  ...props
}: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const hasError = Boolean(error);

  return (
    <label className="flex flex-col gap-2 text-sm" htmlFor={inputId}>
      <span className="font-bold text-[var(--color-text)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-danger)]">*</span>}
      </span>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`h-11 w-full rounded-xl border bg-white px-3.5 text-[var(--color-text)] outline-none transition-all duration-200 ease-out placeholder:text-slate-400
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${hasError
              ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-[var(--color-danger)]/20"
              : "border-slate-200 hover:border-slate-300 focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20"
            }
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-[var(--color-muted)]
            ${className}`}
          required={required}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
      {hint && !error && (
        <span className="text-xs text-[var(--color-muted)]">{hint}</span>
      )}
      {error && (
        <span className="text-xs font-medium text-[var(--color-danger)]">{error}</span>
      )}
    </label>
  );
}
