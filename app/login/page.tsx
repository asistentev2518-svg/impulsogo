"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ASSETS, INSTITUTION } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(form.get("username") ?? "").trim(),
        password: String(form.get("password") ?? "").trim(),
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "No fue posible iniciar sesión.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <PublicShell>
      <div className="flex min-h-[calc(100svh-180px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#061a44] to-[#1266D6] shadow-lg shadow-blue-900/20">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <Image
              src={ASSETS.logo}
              alt="Impulso Go"
              width={56}
              height={56}
              className="mx-auto"
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {INSTITUTION.shortName}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                Personal autorizado
              </p>
              <h1 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">
                Acceso interno
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Área exclusiva para el equipo de Impulso Go.
              </p>
            </div>
            <form className="space-y-4 p-6" onSubmit={onSubmit}>
              <Input name="username" label="Usuario" required autoComplete="username" />
              <Input
                name="password"
                label="Contraseña"
                type="password"
                required
                autoComplete="current-password"
              />
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" loading={loading}>
                {loading ? "Validando..." : "Entrar al panel"}
              </Button>
            </form>
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-center">
              <p className="text-xs text-[var(--color-muted)]">
                No existe registro público. Solo personal autorizado.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-[var(--color-muted)]">
            Al iniciar sesión, aceptas los términos de uso interno del sistema.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
