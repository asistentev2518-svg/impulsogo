import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { formatCdmxDateTime } from "@/lib/datetime";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard", meta: "Vista general", code: "01" },
  { href: "/admin/expedientes", label: "Expedientes", meta: "Folios y validación", code: "02" },
  { href: "/admin/contrato-manual", label: "Contrato manual", meta: "PNG/PDF imprimible", code: "03" },
  { href: "/admin/documentos", label: "Documentos", meta: "WhatsApp operativo", code: "04" },
  { href: "/admin/tablas", label: "Tablas", meta: "Simuladores", code: "05" },
  { href: "/admin/configuracion", label: "Configuración", meta: "Parámetros", code: "06" },
];

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: string;
}) {
  return (
    <div className="min-h-full bg-[#f4f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src={ASSETS.logo} alt="Impulso Go" width={44} height={44} />
            <div>
              <p className="text-base font-black tracking-tight text-[var(--color-institutional)]">
                Operación Impulso Go
              </p>
              <p className="text-xs font-medium text-[var(--color-muted)]">
                {INSTITUTION.shortName} - Herramientas internas
              </p>
            </div>
          </div>
          <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-right text-xs text-[var(--color-muted)] sm:block">
            <p>
              Usuario: <span className="font-semibold text-[var(--color-institutional)]">{user}</span>
            </p>
            <p>CDMX: {formatCdmxDateTime()}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[292px_1fr]">
        <aside className="h-max rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 rounded-lg bg-[#061a44] p-4 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-200">
              Panel privado
            </p>
            <p className="mt-2 text-sm font-bold leading-5">Centro de operación documental</p>
            <p className="mt-2 text-xs leading-5 text-white/65">
              Acceso controlado para generar, validar y exportar materiales oficiales.
            </p>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group grid grid-cols-[32px_1fr] gap-3 rounded-md px-3 py-3 transition hover:bg-[var(--color-surface)]"
              >
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-[11px] font-black text-[var(--color-action)] group-hover:bg-white">
                  {link.code}
                </span>
                <span>
                  <span className="block text-sm font-bold text-[var(--color-text)]">{link.label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-muted)]">{link.meta}</span>
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <LogoutButton />
          </div>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
