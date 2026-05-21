import Image from "next/image";
import Link from "next/link";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-[var(--color-institutional)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <Image src={ASSETS.logo} alt="Impulso Go" width={56} height={56} className="mb-3" />
          <p className="text-sm font-semibold">{INSTITUTION.legalName}</p>
          <p className="mt-2 text-sm text-white/80">{INSTITUTION.address}</p>
        </div>
        <div className="space-y-2 text-sm">
          <Link href={BRAND.sipresUrl} className="block hover:underline">
            Consultar registro en SIPRES
          </Link>
          <Link href={BRAND.condusefUrl} className="block hover:underline">
            Verificar en CONDUSEF
          </Link>
          <Link href={BRAND.mapsUrl} className="block hover:underline">
            Ubicación en Google Maps
          </Link>
          <Link href="/aviso-de-privacidad" className="block hover:underline">
            Aviso de privacidad
          </Link>
          <Link href="/terminos-y-condiciones" className="block hover:underline">
            Términos y condiciones
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <Image src={ASSETS.condusef} alt="CONDUSEF" width={72} height={32} />
            <Image src={ASSETS.sipres} alt="SIPRES" width={72} height={32} />
          </div>
          <Link
            href="/login"
            className="text-xs text-white/60 hover:text-white"
            aria-label="Acceso interno"
          >
            Acceso interno
          </Link>
        </div>
      </div>
    </footer>
  );
}
