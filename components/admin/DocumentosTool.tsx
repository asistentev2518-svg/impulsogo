"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ApprovalDoc } from "@/components/docs/approval-doc";
import { CancellationDoc } from "@/components/docs/cancellation-doc";
import { PolicyDoc } from "@/components/docs/policy-doc";
import { PrivacyDoc } from "@/components/docs/privacy-doc";
import { DOC_H, DOC_W } from "@/components/docs/doc-shell";
import {
  DEFAULT_MASTER,
  DOC_FILE_PREFIX,
  DOC_LABEL,
  EXECUTIVES,
  TERMS,
  derive,
  formatMoney,
  nowMx,
  rand,
  slugify,
  validateMaster,
  whatsappText,
  type DocKind,
  type MasterData,
} from "@/components/dashboard/shared";
import { BRAND } from "@/lib/config";
import { generateQrDataUrl } from "@/lib/qr";
import { exportElementToPng } from "@/lib/png-export";
import { recordActivity } from "@/lib/activity";

const STORAGE_KEY = "impulso_last_master";

const DOC_OPTIONS: { kind: DocKind; label: string; accent: string; desc: string }[] = [
  {
    kind: "aprobacion",
    label: "Aprobación",
    accent: "#0A8F3C",
    desc: "Constancia formal de expediente aprobado.",
  },
  {
    kind: "cancelacion",
    label: "Cancelación",
    accent: "#C62828",
    desc: "Notificación formal con adeudo y penalización.",
  },
  {
    kind: "poliza",
    label: "Póliza",
    accent: "#06245C",
    desc: "Caratula de proteccion crediticia.",
  },
  {
    kind: "aviso",
    label: "Aviso",
    accent: "#1266D6",
    desc: "Aviso integral de privacidad.",
  },
];

function initialMaster(): MasterData {
  return {
    ...DEFAULT_MASTER,
    folio: `FIN-2026-${rand(10000, 99999)}`,
    emittedAt: nowMx(),
  };
}

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );
}

export function DocumentosTool() {
  const [mounted, setMounted] = useState(false);
  const [master, setMaster] = useState<MasterData>({ ...DEFAULT_MASTER, emittedAt: "" });
  const [doc, setDoc] = useState<DocKind>("aprobacion");
  const [previewWidth, setPreviewWidth] = useState(540);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [restorePrompt, setRestorePrompt] = useState<{ name: string; folio: string } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const activeDocRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const derived = useMemo(() => derive(master), [master]);
  const errors = useMemo(() => validateMaster(master), [master]);
  const active = DOC_OPTIONS.find((item) => item.kind === doc) ?? DOC_OPTIONS[0];
  const scale = previewWidth / DOC_W;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let next = initialMaster();
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as MasterData;
          if (saved?.name && saved?.folio) {
            setRestorePrompt({ name: saved.name, folio: saved.folio });
          }
          next = { ...next, ...saved, emittedAt: nowMx() };
        }
      } catch {
        // localStorage is optional for this tool.
      }
      setMaster(next);
      setMounted(true);
      window.setTimeout(() => nameInputRef.current?.focus(), 80);
    }, 0);
    const interval = setInterval(() => {
      setMaster((current) => ({ ...current, emittedAt: nowMx() }));
    }, 60_000);
    return () => {
      window.clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(master));
      } catch {
        // Ignore storage failures; generation still works.
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [master, mounted]);

  useEffect(() => {
    if (!previewWrapRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPreviewWidth(Math.min(620, Math.max(280, entry.contentRect.width)));
      }
    });
    observer.observe(previewWrapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    generateQrDataUrl(BRAND.sipresUrl).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isMod = event.ctrlKey || event.metaKey;
      if (!isMod) return;
      if (event.key === "Enter") {
        event.preventDefault();
        void handleDownload();
      } else if (event.key === "1") {
        event.preventDefault();
        setDoc("aprobacion");
      } else if (event.key === "2") {
        event.preventDefault();
        setDoc("cancelacion");
      } else if (event.key === "3") {
        event.preventDefault();
        setDoc("poliza");
      } else if (event.key === "4") {
        event.preventDefault();
        setDoc("aviso");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, master, errors]);

  function update<K extends keyof MasterData>(key: K, value: MasterData[K]) {
    setMaster((current) => ({ ...current, [key]: value }));
  }

  function restoreLast() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMaster({ ...initialMaster(), ...JSON.parse(raw), emittedAt: nowMx() });
        setStatus("Ultimo cliente restaurado.");
      }
    } catch {
      setStatus("No se pudo restaurar el ultimo cliente.");
    }
    setRestorePrompt(null);
  }

  function clearForm() {
    if (
      (master.name || master.amount > 0) &&
      !window.confirm("¿Limpiar el formulario? Se perderan los datos capturados.")
    ) {
      return;
    }
    setMaster({
      ...initialMaster(),
      name: "",
      amount: 0,
      commission: 0,
      account: "",
    });
    setStatus("Formulario limpiado.");
  }

  function resetDemo() {
    setMaster(initialMaster());
    setStatus("Datos demo restablecidos.");
  }

  async function handleDownload() {
    if (errors.length > 0) {
      setStatus(errors[0]);
      return;
    }
    if (!activeDocRef.current) return;
    setExporting(true);
      setStatus("Generando PNG...");
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await waitForImages(activeDocRef.current);
      await exportElementToPng(
        activeDocRef.current,
        `${DOC_FILE_PREFIX[doc]}-${master.folio}-${slugify(master.name)}.png`,
        DOC_W,
        DOC_H,
      );
      setStatus(`PNG generado: ${DOC_LABEL[doc]}.`);
      recordActivity({
        kind: "documento",
        title: `${DOC_LABEL[doc]} descargado`,
        detail: `${master.folio} - ${master.name} - ${DOC_W}x${DOC_H}px`,
      });
    } catch {
      setStatus("No se pudo generar el PNG. Intenta de nuevo.");
    } finally {
      setExporting(false);
    }
  }

  async function handleCopyWhatsapp() {
    try {
      await navigator.clipboard.writeText(whatsappText(doc, master));
      setStatus("Texto copiado para WhatsApp.");
    } catch {
      setStatus("No se pudo copiar el texto.");
    }
  }

  function renderDoc() {
    switch (doc) {
      case "aprobacion":
        return <ApprovalDoc ref={activeDocRef} master={master} qrDataUrl={qrDataUrl} />;
      case "cancelacion":
        return <CancellationDoc ref={activeDocRef} master={master} qrDataUrl={qrDataUrl} />;
      case "poliza":
        return <PolicyDoc ref={activeDocRef} master={master} qrDataUrl={qrDataUrl} />;
      case "aviso":
        return <PrivacyDoc ref={activeDocRef} master={master} qrDataUrl={qrDataUrl} />;
    }
  }

  if (!mounted) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
          Generador interno
        </p>
        <h2 className="mt-2 text-xl font-black text-[var(--color-institutional)]">
          Cargando dashboard de documentos...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-lg border border-slate-200 bg-[#f5f7fa] shadow-sm">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
              Generador interno
            </p>
            <h2 className="mt-1 text-xl font-black text-[var(--color-institutional)]">
              Documentos operativos Impulso Go
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Captura una vez, revisa el documento y exporta PNG vertical listo para WhatsApp.
            </p>
          </div>
          <ol className="hidden items-center gap-1 text-xs font-bold text-[var(--color-muted)] md:flex">
            {["Captura datos", "Selecciona documento", "Revisa vista previa", "Descarga PNG"].map(
              (step, index) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-institutional)] text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ),
            )}
          </ol>
        </div>
      </header>

      <div className="grid gap-6 px-5 py-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="space-y-5">
          {restorePrompt ? (
            <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-action)] bg-[#eef6ff] p-3 text-sm sm:flex-row sm:items-center">
              <div className="flex-1">
                Recuperar ultimo cliente: <strong>{restorePrompt.name}</strong>{" "}
                <span className="font-mono text-xs text-[var(--color-muted)]">({restorePrompt.folio})</span>
              </div>
              <Button type="button" onClick={restoreLast} className="min-h-9 px-3 py-2">
                Restaurar
              </Button>
              <Button type="button" variant="ghost" onClick={() => setRestorePrompt(null)} className="min-h-9 px-3 py-2">
                Descartar
              </Button>
            </div>
          ) : null}

          <Panel>
            <div className="mb-5">
              <h3 className="text-lg font-black text-[var(--color-institutional)]">
                Datos del cliente y crédito
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                Atajos: Ctrl+Enter descarga. Ctrl+1/2/3/4 cambia documento.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre completo del cliente" hint="Nombre tal como aparecera en el documento." full>
                <input
                  ref={nameInputRef}
                  className={inputClass}
                  value={master.name}
                  maxLength={80}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Ej. Maria Fernanda Lopez"
                />
              </Field>
              <Field label="Monto del crédito aprobado" hint={`Se mostrará como ${formatMoney(master.amount || 0)}`}>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  value={master.amount}
                  onChange={(event) => update("amount", Math.max(0, Number(event.target.value)))}
                />
              </Field>
              <Field label="Comision por apertura" hint={`Se mostrara como ${formatMoney(master.commission || 0)}`}>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  value={master.commission}
                  onChange={(event) => update("commission", Math.max(0, Number(event.target.value)))}
                />
              </Field>
              <Field label="Ultimos 4 digitos de cuenta" hint="Solo se muestran enmascarados.">
                <input
                  className={`${inputClass} tracking-widest`}
                  value={master.account}
                  maxLength={4}
                  onChange={(event) => update("account", event.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4575"
                />
              </Field>
              <Field label="Plazo del crédito">
                <select
                  className={inputClass}
                  value={master.termYears}
                  onChange={(event) => update("termYears", Number(event.target.value))}
                >
                  {TERMS.map((term) => (
                    <option key={term} value={term}>{term} anos</option>
                  ))}
                </select>
              </Field>
              <Field label="Ejecutivo asignado">
                <select
                  className={inputClass}
                  value={master.executive}
                  onChange={(event) => update("executive", event.target.value)}
                >
                  {EXECUTIVES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Ciudad / sucursal">
                <input className={inputClass} value={master.city} onChange={(event) => update("city", event.target.value)} />
              </Field>
              <Field label="Folio de expediente" hint="Generado automaticamente, editable.">
                <input
                  className={`${inputClass} font-mono`}
                  value={master.folio}
                  onChange={(event) => update("folio", event.target.value.toUpperCase())}
                />
              </Field>
              <Field label="Folio CONDUSEF / SIPRES">
                <input
                  className={`${inputClass} font-mono`}
                  value={master.folioCondusef}
                  onChange={(event) => update("folioCondusef", event.target.value)}
                />
              </Field>
              <Field label="Fecha y hora (CDMX)" hint="Actualizado automaticamente.">
                <input className={`${inputClass} font-mono`} value={master.emittedAt} readOnly />
              </Field>
            </div>
          </Panel>

          <Panel>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[var(--color-muted)]">
              Calculos automaticos
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Chip label="Tasa anual" value={`${derived.annualRatePct.toFixed(2)}%`} />
              <Chip label="Pago mensual" value={formatMoney(derived.monthly)} />
              <Chip label="Total estimado" value={formatMoney(derived.totalToPay)} />
              <Chip label="Penalizacion 10%" value={formatMoney(derived.penalty)} tone="danger" />
              <Chip label="Adeudo cancelación" value={formatMoney(derived.totalDue)} tone="danger" />
              <Chip label="Cuenta" value={derived.accountMasked} mono />
              <Chip label="No. póliza" value={derived.policyNumber} mono />
              <Chip label="Vigencia hasta" value={derived.validTo} />
              <Chip label="Iniciales asesor" value={derived.initials} />
            </div>
          </Panel>

          {errors.length ? (
            <div className="rounded-lg border border-[var(--color-danger)] bg-red-50 p-4">
              <p className="text-sm font-black text-[var(--color-danger)]">Faltan datos por completar</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-text)]">
                {errors.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="space-y-5">
          <Panel>
            <h3 className="text-lg font-black text-[var(--color-institutional)]">Documento a generar</h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">Solo se descargara el documento seleccionado.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {DOC_OPTIONS.map((option) => {
                const selected = doc === option.kind;
                return (
                  <button
                    key={option.kind}
                    type="button"
                    onClick={() => setDoc(option.kind)}
                    className="rounded-lg border px-3 py-3 text-left text-sm font-bold transition"
                    style={{
                      borderColor: selected ? option.accent : "#e2e8f0",
                      boxShadow: selected ? `0 0 0 2px ${option.accent} inset, 0 4px 12px rgba(11,42,91,0.06)` : "none",
                      color: selected ? option.accent : "var(--color-text)",
                      background: "white",
                    }}
                  >
                    <span className="block">{option.label}</span>
                    <span className="mt-1 block text-xs font-medium leading-5 text-[var(--color-muted)]">{option.desc}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm">
              Documento seleccionado: <strong style={{ color: active.accent }}>{active.label}</strong>
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-black text-[var(--color-institutional)]">Vista previa</h3>
              <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-[var(--color-muted)]">
                {DOC_W}x{DOC_H}px - WhatsApp
              </span>
            </div>
            <div ref={previewWrapRef} className="flex w-full justify-center overflow-auto">
              <div
                style={{
                  width: previewWidth,
                  height: previewWidth * (DOC_H / DOC_W),
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: `0 0 0 2px ${active.accent}33, 0 12px 32px -8px rgba(11,42,91,0.18)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transformOrigin: "top left",
                    transform: `scale(${scale})`,
                    width: DOC_W,
                    height: DOC_H,
                  }}
                >
                  {renderDoc()}
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="space-y-3">
            <Button
              type="button"
              onClick={handleDownload}
              disabled={exporting || errors.length > 0}
              className="w-full"
              style={{ background: active.accent }}
            >
              {exporting ? "Generando..." : `Descargar PNG - ${active.label}`}
            </Button>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button type="button" variant="secondary" onClick={handleCopyWhatsapp} className="px-3">
                Copiar WhatsApp
              </Button>
              <Button type="button" variant="ghost" onClick={clearForm} className="px-3">
                Limpiar
              </Button>
              <Button type="button" variant="ghost" onClick={resetDemo} className="px-3">
                Demo
              </Button>
            </div>
            {status ? <p className="text-center text-sm font-bold text-[var(--color-muted)]">{status}</p> : null}
          </Panel>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20";

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-black text-[var(--color-text)]">{label}</span>
      {children}
      {hint ? <span className="block text-[10px] leading-4 text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

function Chip({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "danger";
}) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${tone === "danger" ? "border-red-100 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </div>
      <div className={`mt-0.5 text-sm font-black ${mono ? "font-mono" : ""} ${tone === "danger" ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>
        {value}
      </div>
    </div>
  );
}
