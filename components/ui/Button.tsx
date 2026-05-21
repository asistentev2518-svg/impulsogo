import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-[var(--color-action)] text-white hover:brightness-110",
  secondary:
    "bg-white text-[var(--color-institutional)] border border-[var(--color-institutional)]/20 hover:bg-[var(--color-surface)]",
  danger: "bg-[var(--color-danger)] text-white hover:brightness-110",
  ghost: "bg-transparent text-[var(--color-institutional)] hover:bg-[var(--color-surface)]",
} as const;

type Variant = keyof typeof variants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: Props) {
  const classes = `inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
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
