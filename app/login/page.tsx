"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

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
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
        <Card className="rounded-lg border-slate-200 shadow-lg shadow-blue-950/5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
            Personal autorizado
          </p>
          <h1 className="mt-3 text-2xl font-black text-[var(--color-institutional)]">
            Acceso interno
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Área exclusiva para el equipo de Impulso Go. No existe registro público.
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input name="username" label="Usuario" required autoComplete="username" />
            <Input
              name="password"
              label="Contraseña"
              type="password"
              required
              autoComplete="current-password"
            />
            {error ? <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Validando..." : "Entrar"}
            </Button>
          </form>
        </Card>
      </div>
    </PublicShell>
  );
}
