import Image from "next/image";
import Link from "next/link";
import { ASSETS, BRAND } from "@/lib/config";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "#verificacion", label: "Respaldo" },
  { href: "#simulador", label: "Simulador" },
  { href: "#proceso", label: "Proceso" },
  { href: "#casos", label: "Casos" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#faq", label: "FAQ" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src={ASSETS.logo} alt="Impulso Go" width={46} height={46} priority />
          <div>
            <p className="text-sm font-black tracking-tight text-[var(--color-institutional)]">
              Impulso Go
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
              SOFOM, E.N.R.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--color-action)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={BRAND.whatsappUrl} className="hidden md:inline-flex">
            WhatsApp
          </Button>
          <Button href={BRAND.sipresUrl} variant="ghost" className="hidden xl:inline-flex">
            SIPRES
          </Button>
        </div>
      </div>
    </header>
  );
}
