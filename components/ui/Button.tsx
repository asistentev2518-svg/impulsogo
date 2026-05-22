import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-[var(--color-action)] text-white shadow-sm shadow-blue-900/15 hover:bg-[#0f56b8]",
  secondary:
    "bg-white text-[var(--color-institutional)] border border-[var(--color-institutional)]/20 shadow-sm hover:border-[var(--color-action)]/35 hover:bg-[var(--color-surface)]",
  danger: "bg-[var(--color-danger)] text-white hover:bg-[#a81f1f]",
  ghost:
    "bg-transparent text-[var(--color-institutional)] hover:bg-[var(--color-surface)]",
} as const;

type Variant = keyof typeof variants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  prefetch?: boolean;
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  target,
  rel,
  prefetch,
  ...props
}: Props) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-action)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel} prefetch={prefetch}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
