import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { formatCdmxDateTime } from "@/lib/datetime";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/expedientes", label: "Expedientes" },
  { href: "/admin/contrato-manual", label: "Contrato manual" },
  { href: "/admin/documentos", label: "Documentos" },
  { href: "/admin/tablas", label: "Tablas" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: string;
}) {
  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src={ASSETS.logo} alt="Impulso Go" width={40} height={40} />
            <div>
              <p className="font-semibold text-[var(--color-institutional)]">Panel interno</p>
              <p className="text-xs text-[var(--color-muted)]">{INSTITUTION.shortName}</p>
            </div>
          </div>
          <div className="text-right text-xs text-[var(--color-muted)]">
            <p>Usuario: {user}</p>
            <p>CDMX: {formatCdmxDateTime()}</p>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <LogoutButton />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
