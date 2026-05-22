import Image from "next/image";
import type { ReactNode } from "react";
import { VerificationLogos } from "@/components/ui/VerificationLogos";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { IconCheck, IconDocument, IconLock } from "./icons";

export function ContractPageShell({
  page,
  totalPages = 3,
  pageTitle,
  qrDataUrl,
  qrCaption = "Escanea para validar la autenticidad de este documento.",
  pageLabel,
  legalName = INSTITUTION.legalName,
  children,
}: {
  page: number;
  totalPages?: number;
  pageTitle: string;
  qrDataUrl?: string;
  qrCaption?: string;
  pageLabel?: string;
  legalName?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[1056px] w-[816px] flex-col bg-white p-8 text-[#172033]">
      <header className="shrink-0">
        <div className="flex items-start justify-between">
          <div className="w-[88px]" />
          <div className="flex-1 text-center">
            <Image src={ASSETS.logo} alt="Impulso Go" width={78} height={78} className="mx-auto" priority />
            <p className="mt-1 text-[11px] font-black text-[#06245C]">{legalName}</p>
          </div>
          <div className="flex w-[88px] flex-col items-end">
            {qrDataUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR" width={68} height={68} className="rounded-sm" />
                <p className="mt-1 max-w-[88px] text-right text-[7px] leading-tight text-slate-500">{qrCaption}</p>
              </>
            ) : (
              <div className="h-[68px] w-[68px] rounded border border-dashed border-slate-300 bg-slate-50" />
            )}
          </div>
        </div>
        <div className="my-2 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="h-2 w-2 rounded-full bg-[#06245C]" />
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <h1 className="text-center text-[12.5px] font-black uppercase leading-tight tracking-wide text-[#06245C]">
          {pageTitle}
        </h1>
        <p className="text-center text-[8.5px] italic text-slate-500">Documento generado electrónicamente</p>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden py-2">{children}</main>

      <footer className="shrink-0 border-t border-slate-200 pt-2.5">
        <div className="grid grid-cols-3 gap-2 text-[7.5px] leading-snug text-slate-600">
          <div className="flex items-start gap-1">
            <IconCheck className="mt-0.5 h-3 w-3 shrink-0 text-[#06245C]" />
            <span>Empresa registrada y autorizada ante la CONDUSEF.</span>
          </div>
          <div className="flex items-start gap-1">
            <IconLock className="mt-0.5 h-3 w-3 shrink-0 text-[#06245C]" />
            <span>Tus datos están protegidos bajo los más altos estándares de seguridad.</span>
          </div>
          <div className="flex items-start gap-1">
            <IconDocument className="mt-0.5 h-3 w-3 shrink-0 text-[#06245C]" />
            <span>Documento generado electrónicamente con plena validez jurídica.</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VerificationLogos variant="contract" />
          </div>
          <p className="text-[8.5px] font-bold text-slate-500">
            {pageLabel ?? `Página ${page} de ${totalPages}`}
          </p>
        </div>
      </footer>
    </div>
  );
}
