"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const HARDCODED_USERNAME = "impulso2518";
  const HARDCODED_PASSWORD = "252627";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loading) return;

    setLoading(true);
    try {
      const u = username.trim();
      const p = password;

      // Simula latency mínima para que el loading tenga sentido
      await new Promise((r) => setTimeout(r, 250));

      if (u === HARDCODED_USERNAME && p === HARDCODED_PASSWORD) {
        localStorage.setItem(
          "impulso_auth",
          JSON.stringify({ token: "fake-jwt", username: u })
        );
        window.location.href = "/admin";
      } else {
        setError("Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-wide text-[#1E3A8A]">
              IMPULSO GO
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Inicia sesión para continuar
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              autoComplete="username"
              placeholder="Tu usuario"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                disabled={loading}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 active:bg-gray-200 disabled:opacity-60"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading}
              >
                {showPassword ? (
                  // Icono "ojo" abierto
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  // Icono "ojo" tachado
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.8 21.8 0 0 1 5.06-7.94" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.22 4.91" />
                    <path d="M1 1l22 22" />
                    <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                    <path d="M14.12 14.12a2 2 0 0 1-2.83-2.83" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white rounded-lg py-2.5 font-semibold hover:opacity-95 disabled:opacity-70 transition"
          >
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
