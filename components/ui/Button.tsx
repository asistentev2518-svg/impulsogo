import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-[var(--color-action)] text-white shadow-button hover:bg-[var(--color-action-hover)] hover:shadow-lg active:scale-[0.98]",
  secondary:
    "bg-white text-[var(--color-institutional)] border border-[var(--color-institutional)]/25 shadow-sm hover:border-[var(--color-action)]/40 hover:bg-[var(--color-surface)] hover:shadow-md active:scale-[0.98]",
  danger: "bg-[var(--color-danger)] text-white shadow-button hover:bg-[#a81f1f] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--color-institutional)] hover:bg-[var(--color-surface)] active:scale-[0.98]",
} as const;

type Variant = keyof typeof variants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  prefetch?: boolean;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  target,
  rel,
  prefetch,
  loading = false,
  disabled,
  icon,
  ...props
}: Props) {
  const baseClasses = `inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-action)]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none`;
  const variantClasses = variants[variant];
  const finalClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

  const content = (
    <>
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={finalClasses} target={target} rel={rel} prefetch={prefetch}>
        {content}
      </Link>
    );
  }

  return (
    <button className={finalClasses} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
