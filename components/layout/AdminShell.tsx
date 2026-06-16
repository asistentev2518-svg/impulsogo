"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { formatCdmxDateTime } from "@/lib/datetime";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/admin", label: "Dashboard", meta: "Vista general", code: "01", icon: "dashboard" },
  { href: "/admin/expedientes", label: "Firma digital", meta: "Contrato y huella 72h", code: "02", icon: "signature" },
  { href: "/admin/contrato-manual", label: "Contrato manual", meta: "PNG/PDF imprimible", code: "03", icon: "document" },
  { href: "/admin/documentos", label: "Documentos", meta: "PNG vertical", code: "04", icon: "folder" },
  { href: "/admin/tablas", label: "Tablas", meta: "Simuladores", code: "05", icon: "table" },
  { href: "/admin/configuracion", label: "Configuración", meta: "Parámetros", code: "06", icon: "settings" },
];

const icons: Record<string, ReactNode> = {
  dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
  signature: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
  document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  folder: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
  table: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
};

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCdmx, setCurrentCdmx] = useState("");

  useEffect(() => {
    const update = () => setCurrentCdmx(formatCdmxDateTime());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-br from-[#f0f4f8] to-[#e8eef4]">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:bg-[var(--color-surface)] lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Image src={ASSETS.logo} alt="Impulso Go" width={40} height={40} className="transition-transform duration-300 hover:scale-105" />
            <div className="hidden sm:block">
              <p className="text-base font-black tracking-tight text-[var(--color-institutional)]">
                Centro de Operación
              </p>
              <p className="text-[11px] font-medium text-[var(--color-muted)]">
                {INSTITUTION.shortName} - Herramientas internas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-slate-200/80 bg-[var(--color-surface)] px-4 py-2 text-right text-xs text-[var(--color-muted)] shadow-sm md:block">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse-subtle" />
                <span className="font-semibold text-[var(--color-institutional)]">{user}</span>
              </div>
              <p className="mt-1 text-[var(--color-muted)]">
                CDMX: {currentCdmx || "Sincronizando..."}
              </p>
            </div>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[288px_1fr]">
        <aside className={`fixed inset-0 z-30 lg:relative lg:block ${sidebarOpen ? "block" : "hidden"}`}>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-72 overflow-y-auto border-l border-slate-200 bg-white shadow-2xl lg:static lg:h-auto lg:w-auto lg:border-l-0 lg:shadow-none">
            <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#061a44] to-[#0a2d62] p-4 text-white shadow-lg">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-200">
                  Panel privado
                </p>
                <p className="mt-2 text-sm font-bold leading-5">Centro de operación documental</p>
                <p className="mt-1.5 text-[11px] leading-5 text-white/65">
                  Acceso controlado para generar y exportar materiales oficiales.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-white/8 bg-white/5 p-2.5 backdrop-blur-sm">
                    <p className="text-white/50">Tasa anual</p>
                    <p className="text-lg font-black text-white">{INSTITUTION.annualRatePercent}%</p>
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/5 p-2.5 backdrop-blur-sm">
                    <p className="text-white/50">Plazos</p>
                    <p className="text-lg font-black text-white">{INSTITUTION.allowedTermsYears.join("/")}</p>
                  </div>
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-1 px-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-surface)] text-[var(--color-institutional)] shadow-sm"
                        : "text-slate-600 hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-institutional)] text-white shadow-md"
                        : "bg-slate-100 text-[var(--color-muted)] group-hover:bg-white group-hover:text-[var(--color-action)]"
                    }`}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icons[link.icon]}
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{link.label}</span>
                      <span className="block truncate text-[11px] text-[var(--color-muted)]">{link.meta}</span>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-[var(--color-action)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-slate-100 p-2">
              <Link
                href="/"
                className="group mb-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-[var(--color-institutional)] transition-all duration-200 hover:border-[var(--color-action)]/30 hover:bg-[var(--color-surface)] hover:shadow-sm"
              >
                <svg className="h-4 w-4 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-action)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver sitio público
              </Link>
            </div>
          </div>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
