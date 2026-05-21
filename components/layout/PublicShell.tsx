import type { ReactNode } from "react";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--color-bg)]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
