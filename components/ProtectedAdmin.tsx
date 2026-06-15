"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  children: ReactNode;
};

export function ProtectedAdmin({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  const showLoading = useMemo(() => isLoading, [isLoading]);

  if (showLoading) {
    return (
      <div className="mx-auto flex min-h-[60svh] max-w-2xl items-center justify-center px-4">
        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-[var(--color-muted)]">Validando acceso…</p>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-1/2 animate-pulse-subtle bg-[var(--color-action)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[60svh] max-w-2xl items-center justify-center px-4 py-10">
        <Card className="w-full rounded-xl p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
            Acceso interno (protección visual)
          </p>
          <h2 className="mt-3 text-2xl font-black text-[var(--color-institutional)]">
            Inicia sesión para ver el panel
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            La seguridad real del admin se valida en el backend. Aquí solo controlamos la UI con un token simulado en localStorage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/login">Ir a login</Button>
            <Button href="/" variant="secondary">
              Volver al sitio público
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

