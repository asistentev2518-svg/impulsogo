"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { useAuth } from "@/app/hooks/useAuth";
import { Card } from "@/components/ui/Card";

const LS_FAILED = "impulso_visual_login_failed";
const LS_LOCK_UNTIL = "impulso_visual_login_lock_until";

function getFailedAttempts(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(LS_FAILED);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function setFailedAttempts(n: number) {
  window.localStorage.setItem(LS_FAILED, String(n));
}

function getLockUntil(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(LS_LOCK_UNTIL);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function setLockUntil(ts: number) {
  window.localStorage.setItem(LS_LOCK_UNTIL, String(ts));
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [lockUntil, setLockUntilState] = useState(0);
  const [nowTs, setNowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => {
      setNowTs(Date.now());
    }, 250);

    return () => {
      window.clearInterval(t);
    };
  }, []);

  useEffect(() => {
    // Cargamos el lock solo en el montaje (microtask para evitar el warning del lint rule).
    queueMicrotask(() => {
      setLockUntilState(getLockUntil());
    });
  }, []);

  const lockRemainingMs = Math.max(0, lockUntil - nowTs);
  const lockRemainingSec = Math.ceil(lockRemainingMs / 1000);
  const isLocked = lockRemainingMs > 0;

  const [showForgot, setShowForgot] = useState(false);
  const [forgotValue, setForgotValue] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isLocked) {
      setError(`Cuenta bloqueada visualmente ${lockRemainingSec}s. Intenta después.`);
      return;
    }

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();

    if (!username || !password) {
      setError("Ingresa usuario y contraseña.");
      return;
    }

    setLoading(true);

    // Protección visual (NO cambia backend real): el login simulado considera
    // cualquier password no vacío como OK.
    const ok = password.length >= 1;

    await new Promise((r) => setTimeout(r, 350));

    if (!ok) {
      const prev = getFailedAttempts();
      const nextFailed = prev + 1;
      setFailedAttempts(nextFailed);

      if (nextFailed >= 3) {
        const until = Date.now() + 30_000;
        setLockUntil(until);
        setLockUntilState(until);
        setError("Demasiados intentos. Bloqueo visual por 30s.");
      } else {
        setError(`Intento fallido. ${3 - nextFailed} intento(s) restantes.`);
      }

      setLoading(false);
      return;
    }

    // login visual OK => limpiar contadores y setear token simulado
    setFailedAttempts(0);
    setLockUntil(0);
    setLockUntilState(0);

    await login(username);
    router.push(next);
    router.refresh();
  }

  const lockBanner = useMemo(() => {
    if (!isLocked) return null;
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-[var(--color-action)]">
          Cuenta bloqueada visualmente: intenta en {lockRemainingSec}s.
        </p>
      </div>
    );
  }, [isLocked, lockRemainingSec]);

  return (
    <PublicShell>
      <div className="flex min-h-[calc(100svh-180px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#061a44] to-[#1266D6] shadow-lg shadow-blue-900/20">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <Image src={ASSETS.logo} alt="Impulso Go" width={56} height={56} className="mx-auto" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {INSTITUTION.shortName}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                Personal autorizado
              </p>
              <h1 className="mt-2 text-2xl font-black text-[var(--color-institutional)]">Acceso interno</h1>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Área exclusiva para el equipo de Impulso Go.</p>
            </div>

            <div className="px-6 pt-5">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[var(--color-institutional)] shadow-sm transition hover:bg-[var(--color-surface)] hover:border-[var(--color-action)]"
                onClick={() => window.history.back()}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Retroceder
              </button>
            </div>

            <form className="space-y-4 p-6 pt-4" onSubmit={onSubmit}>
              {lockBanner}

              <Input name="username" label="Usuario" required autoComplete="username" />

              <div className="space-y-2">
                <Input
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="-mt-1 inline-flex items-center gap-2 text-xs font-bold text-[var(--color-action)] hover:underline"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" loading={loading} disabled={isLocked}>
                {loading ? "Validando..." : isLocked ? "Bloqueado" : "Entrar al panel"}
              </Button>

              <button
                type="button"
                className="mx-auto block text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-action)]"
                onClick={() => setShowForgot(true)}
              >
                ¿Olvidé mi contraseña?
              </button>
            </form>


          </div>

          <p className="text-center text-xs text-[var(--color-muted)]">
            Al iniciar sesión, aceptas los términos de uso interno del sistema.
          </p>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Recuperación</p>
                <h2 className="mt-2 text-xl font-black text-[var(--color-institutional)]">Olvidé mi contraseña</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Este flujo es solo UX. Para restablecimiento real, gestiona la cuenta con el equipo de administración.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                onClick={() => setShowForgot(false)}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <Input
                name="forgot"
                label="Usuario o correo"
                value={forgotValue}
                onChange={(e) => setForgotValue(e.target.value)}
              />
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setShowForgot(false);
                  setForgotValue("");
                }}
              >
                Enviar instrucción
              </Button>
              <p className="text-xs text-[var(--color-muted)]">No se realiza solicitud al backend en este modal.</p>
            </div>
          </Card>
        </div>
      )}
    </PublicShell>
  );
}

