'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/useAuth';

export default function LoginPage() {
  const { login: doLogin, loading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!lockUntil) return;
    if (Date.now() >= lockUntil) return;

    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [lockUntil]);

  const locked = useMemo(() => {
    if (!lockUntil) return false;
    return Date.now() < lockUntil;
  }, [lockUntil, now]);

  const remainingSeconds = useMemo(() => {
    if (!lockUntil) return 0;
    return Math.max(0, Math.ceil((lockUntil - now) / 1000));
  }, [lockUntil, now]);

  const validate = () => {
    if (!username.trim() || !password) return 'Campos no pueden estar vacíos';
    if (username.trim().length < 5) return 'Campos inválidos';
    if (password.length < 6) return 'Campos inválidos';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (locked) return;

    const v = validate();
    if (v) {
      setError('Credenciales incorrectas');
      return;
    }

    try {
      await doLogin(username.trim(), password);
      setAttempts(0);
      setLockUntil(null);
      window.location.href = '/admin';
    } catch {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setLockUntil(Date.now() + 30_000);
      }
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl font-extrabold tracking-wide text-[#1E3A8A]">IMPULSO GO</div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              placeholder="Tu usuario"
              autoComplete="username"
              disabled={locked}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>

            <div className="mt-1 flex items-center gap-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                placeholder="Tu contraseña"
                autoComplete="current-password"
                disabled={locked}
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                disabled={locked}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          {locked ? (
            <div className="text-sm text-gray-700">
              Cuenta regresiva: <span className="font-semibold">{remainingSeconds}s</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={locked || authLoading}
            className="w-full rounded-lg bg-[#1E3A8A] text-white py-2.5 font-semibold hover:bg-[#16336d] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {locked ? 'Bloqueado' : authLoading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

