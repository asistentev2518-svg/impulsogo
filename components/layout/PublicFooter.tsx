import Image from "next/image";
import Link from "next/link";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-[#061a44] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src={ASSETS.logo} alt="Impulso Go" width={58} height={58} />
            <div>
              <p className="text-sm font-bold">{INSTITUTION.legalName}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">
                Financiamiento documentado
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">{INSTITUTION.address}</p>
          <p className="mt-3 max-w-md text-xs leading-5 text-white/55">
            La consulta del registro en SIPRES verifica la entidad y no implica aprobación de
            operaciones por parte de CONDUSEF.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <Link href={BRAND.sipresUrl} className="block text-white/80 hover:text-white">
            Consultar registro en SIPRES
          </Link>
          <Link href={BRAND.condusefUrl} className="block text-white/80 hover:text-white">
            Verificar en CONDUSEF
          </Link>
          <Link href={BRAND.mapsUrl} className="block text-white/80 hover:text-white">
            Ubicación en Google Maps
          </Link>
          <Link href="/aviso-de-privacidad" className="block text-white/80 hover:text-white">
            Aviso de privacidad
          </Link>
          <Link href="/terminos-y-condiciones" className="block text-white/80 hover:text-white">
            Términos y condiciones
          </Link>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="rounded-lg bg-white p-3">
            <div className="flex items-center gap-4">
              <Image src={ASSETS.condusef} alt="CONDUSEF" width={86} height={38} />
              <Image src={ASSETS.sipres} alt="SIPRES" width={92} height={38} />
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs text-white/35 transition hover:text-white/80"
            aria-label="Acceso interno"
          >
            Acceso interno
          </Link>
        </div>
      </div>
    </footer>
  );
}
