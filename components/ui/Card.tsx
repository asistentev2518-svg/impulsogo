import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  hoverable = false,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: "default" | "elevated" | "outlined" | "glass";
}) {
  const baseClasses = "rounded-xl p-5 transition-all duration-200 ease-out";

  const variantClasses = {
    default: "border border-slate-200/80 bg-white shadow-sm",
    elevated: "border border-slate-200/60 bg-white shadow-card hover:shadow-card-hover",
    outlined: "border-2 border-slate-200 bg-white",
    glass: "border border-white/20 bg-white/80 backdrop-blur-lg shadow-lg",
  };

  const hoverClasses = hoverable
    ? "hover:scale-[1.01] hover:shadow-card-hover hover:border-slate-300/60 cursor-pointer"
    : "";

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`.trim();

  return <div className={finalClasses}>{children}</div>;
}
