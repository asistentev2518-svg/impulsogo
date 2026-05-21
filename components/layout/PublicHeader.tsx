import Image from "next/image";
import Link from "next/link";
import { ASSETS, BRAND } from "@/lib/config";
import { Button } from "@/components/ui/Button";

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src={ASSETS.logo} alt="Impulso Go" width={48} height={48} />
          <div>
            <p className="text-sm font-bold text-[var(--color-institutional)]">Impulso Go</p>
            <p className="text-xs text-[var(--color-muted)]">SOFOM, E.N.R.</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-3 md:flex">
          <Button href="/firma-contrato" variant="primary">
            Iniciar proceso de firma
          </Button>
          <Button href={BRAND.whatsappUrl} variant="secondary">
            WhatsApp
          </Button>
        </nav>
      </div>
    </header>
  );
}
