"use client";

import { useMemo, useRef, useState } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ContractClausesPreviewContent } from "@/components/contract/ManualContractPages";
import {
  DigitalContractPage1,
  DigitalContractPage2,
  DigitalContractPage3,
} from "@/components/contract/DigitalContractExport";
import { SignaturePad } from "@/components/firma/SignaturePad";
import type { ContractGender } from "@/lib/contract";
import {
  ALLOWED_TERMS,
  calculateMonthlyPayment,
  formatMXN,
  validateAmount,
  validateTerm,
  type TermYears,
} from "@/lib/finance";
import { CONTRACT_CHECKBOXES, IDENTITY_CONSENT } from "@/lib/config";
import { sha256CanonicalBrowser } from "@/lib/hash";
import { formatCdmxDateTime, toUtcIso } from "@/lib/datetime";
import { parseUserAgent } from "@/lib/device";
import { BRAND } from "@/lib/config";
import { exportElementsToPdf } from "@/lib/pdf";
import { recordActivity } from "@/lib/activity";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type FileKey = "ineFront" | "ineBack" | "selfie";

type WizardData = {
  fullName: string;
  curp: string;
  phone: string;
  address: string;
  gender: ContractGender | "";
  monthlyIncome: string;
  bankAccount: string;
  bankName: string;
  amount: number;
  termYears: TermYears;
  consent: boolean;
  checks: boolean[];
  signature: string | null;
  confirmName: string;
  files: Record<FileKey, File | null>;
};

const fileLabels: Record<FileKey, { title: string; desc: string; capture: "user" | "environment" }> = {
  ineFront: {
    title: "INE frente",
    desc: "Fotografía clara del anverso de la identificación.",
    capture: "environment",
  },
  ineBack: {
    title: "INE reverso",
    desc: "Fotografía clara del reverso de la identificación.",
    capture: "environment",
  },
  selfie: {
    title: "Selfie sosteniendo INE",
    desc: "Rostro visible y documento legible para atribución de identidad.",
    capture: "user",
  },
};

const steps = [
  "Datos",
  "Identidad",
  "Contrato",
  "Firma",
  "Generado",
];

function validateFile(file: File | null) {
  if (!file) return "Archivo requerido.";
  if (!ACCEPTED_TYPES.includes(file.type)) return "Solo JPG, PNG o WEBP.";
  if (file.size > MAX_FILE_SIZE) return "Máximo 10 MB por archivo.";
  return null;
}

function generateLocalFolio() {
  const year = new Date().getFullYear();
  const seed = `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
  return `IG-${year}-${seed.slice(-6)}`;
}

function waitForPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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

export function FirmaWizard() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [contractScrolled, setContractScrolled] = useState(false);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<{
    folio: string;
    hash: string;
    createdAtCdmx: string;
    createdAtUtc: string;
    browser: string;
    device: string;
    userAgent: string;
  } | null>(null);
  const [data, setData] = useState<WizardData>({
    fullName: "",
    curp: "",
    phone: "",
    address: "",
    gender: "",
    monthlyIncome: "",
    bankAccount: "",
    bankName: "",
    amount: 10000,
    termYears: 2,
    consent: false,
    checks: CONTRACT_CHECKBOXES.map(() => false),
    signature: null,
    confirmName: "",
    files: { ineFront: null, ineBack: null, selfie: null },
  });

  const payment = useMemo(
    () => calculateMonthlyPayment(data.amount, data.termYears),
    [data.amount, data.termYears],
  );

  const provisionalFolio = "IG-PROVISIONAL";
  const progressPct = (step / steps.length) * 100;

  const contractData = useMemo(
    () => ({
      fullName: data.fullName,
      curp: data.curp,
      phone: data.phone,
      address: data.address,
      gender: data.gender || undefined,
      monthlyIncome: data.monthlyIncome,
      bankAccount: data.bankAccount,
      bankName: data.bankName,
      amount: data.amount,
      termYears: data.termYears,
      monthlyPayment: payment.cuota,
      totalAtMaturity: payment.total,
      folio: result?.folio ?? provisionalFolio,
      signatureDate: result?.createdAtCdmx ?? formatCdmxDateTime(),
    }),
    [data, payment.cuota, payment.total, result],
  );

  function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateFile(key: FileKey, file: File | null) {
    setData((prev) => ({ ...prev, files: { ...prev.files, [key]: file } }));
  }

  function validateStep(current: number) {
    if (current === 1) {
      if (!data.fullName.trim() || !data.curp.trim() || !data.phone.trim() || !data.address.trim()) {
        return "Complete todos los campos.";
      }
      if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ""))) {
        return "Teléfono a 10 dígitos.";
      }
      const amountError = validateAmount(data.amount);
      if (amountError) return amountError;
      const termError = validateTerm(data.termYears);
      if (termError) return termError;
      if (!data.bankAccount.trim() || !data.bankName.trim()) {
        return "Indique cuenta y banco para acreditar.";
      }
    }
    if (current === 2) {
      const errors = [
        validateFile(data.files.ineFront),
        validateFile(data.files.ineBack),
        validateFile(data.files.selfie),
      ].filter(Boolean);
      if (errors.length) return errors[0] ?? "Archivos inválidos.";
      if (!data.consent) return "Debe otorgar el consentimiento obligatorio.";
    }
    if (current === 3) {
      if (!contractScrolled) return "Debe leer el contrato hasta el final.";
      if (!data.checks.every(Boolean)) return "Marque todas las casillas obligatorias.";
    }
    if (current === 4) {
      if (!data.confirmName.trim()) return "Confirme su nombre completo.";
      if (data.confirmName.trim().toLowerCase() !== data.fullName.trim().toLowerCase()) {
        return "El nombre confirmado debe coincidir.";
      }
      if (!data.signature) return "Capture su firma digital.";
    }
    return null;
  }

  function nextStep() {
    const validation = validateStep(step);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, 5));
  }

  function prevStep() {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function finalize() {
    const validation = validateStep(4);
    if (validation) {
      setError(validation);
      return;
    }

    const createdAtCdmx = formatCdmxDateTime();
    const createdAtUtc = toUtcIso();
    const userAgent = navigator.userAgent;
    const device = parseUserAgent(userAgent);
    const acceptances = Object.fromEntries(
      CONTRACT_CHECKBOXES.map((label, index) => [
        label,
        data.checks[index] ? createdAtCdmx : "",
      ]),
    );

    const folio = generateLocalFolio();

    const hash = await sha256CanonicalBrowser({
      folio,
      cliente: data.fullName,
      firmaDigital: Boolean(data.signature),
      ineFrente: Boolean(data.files.ineFront),
      ineReverso: Boolean(data.files.ineBack),
      selfieIne: Boolean(data.files.selfie),
      aceptaciones: acceptances,
      fechaCdmx: createdAtCdmx,
      fechaUtc: createdAtUtc,
      dispositivo: device,
    });

    setResult({
      folio,
      hash,
      createdAtCdmx,
      createdAtUtc,
      browser: device.browser,
      device: device.device,
      userAgent,
    });
    recordActivity({
      kind: "contrato_digital",
      title: "Contrato digital generado",
      detail: `${folio} - ${data.fullName} - ${createdAtCdmx}`,
    });
    setStep(5);
  }

  async function downloadPdf() {
    if (!result) return;
    await document.fonts?.ready;
    await waitForPaint();
    const elements = [page1Ref.current, page2Ref.current, page3Ref.current].filter(
      Boolean,
    ) as HTMLElement[];
    await Promise.all(elements.map(waitForImages));
    await exportElementsToPdf(elements, `Contrato_ImpulsoGo_${result.folio}.pdf`);
    recordActivity({
      kind: "contrato_digital",
      title: "PDF de contrato digital descargado",
      detail: `${result.folio} - ${data.fullName}`,
    });
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">
                Firma digital
              </p>
              <h1 className="mt-2 text-3xl font-black text-[var(--color-institutional)]">
                Contrato con evidencia documental
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
                Flujo de identidad, lectura, aceptación y firma para generar folio, fecha y huella
                técnica de generación.
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <p className="font-bold text-[var(--color-institutional)]">Paso {step} de 5</p>
              <p className="text-[var(--color-muted)]">{steps[step - 1]}</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[var(--color-action)] transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[11px] font-bold text-slate-500">
            {steps.map((label, index) => (
              <span key={label} className={index + 1 <= step ? "text-[var(--color-institutional)]" : ""}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-[var(--color-danger)]">
            {error}
          </div>
        ) : null}

        <div className="mt-6">
          {step === 1 ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
              <Card className="space-y-4">
                <h2 className="font-black text-[var(--color-institutional)]">Datos del cliente</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Nombre completo" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} />
                  <Input label="CURP" value={data.curp} maxLength={18} onChange={(e) => update("curp", e.target.value.toUpperCase())} />
                  <Input label="Teléfono (10 dígitos)" value={data.phone} inputMode="numeric" onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
                  <Input label="Domicilio completo" value={data.address} onChange={(e) => update("address", e.target.value)} />
                  <label className="text-sm">
                    <span className="font-bold text-[var(--color-text)]">Sexo</span>
                    <select
                      className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3.5"
                      value={data.gender}
                      onChange={(e) => update("gender", e.target.value as ContractGender | "")}
                    >
                      <option value="">Seleccione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </label>
                  <Input label="Ingresos mensuales" value={data.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} />
                  <Input label="Monto solicitado (MXN)" type="number" step={5000} min={10000} value={data.amount} onChange={(e) => update("amount", Number(e.target.value))} />
                  <label className="text-sm">
                    <span className="font-bold text-[var(--color-text)]">Plazo en años</span>
                    <select
                      className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3.5 outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]"
                      value={data.termYears}
                      onChange={(e) => update("termYears", Number(e.target.value) as TermYears)}
                    >
                      {ALLOWED_TERMS.map((term) => (
                        <option key={term} value={term}>{term} años</option>
                      ))}
                    </select>
                  </label>
                  <Input label="Cuenta a acreditar" value={data.bankAccount} onChange={(e) => update("bankAccount", e.target.value)} />
                  <Input label="Banco" value={data.bankName} onChange={(e) => update("bankName", e.target.value)} />
                </div>
              </Card>
              <Card className="h-max !bg-[#06245C] text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Simulación</p>
                <p className="mt-5 text-4xl font-black">{formatMXN(data.amount)}</p>
                <div className="mt-6 space-y-3 text-sm text-white/78">
                  <p>Plazo: <strong className="text-white">{data.termYears} años</strong></p>
                  <p>Tasa anual ordinaria fija: <strong className="text-white">7%</strong></p>
                  <p>Cuota mensual estimada: <strong className="text-white">{formatMXN(payment.cuota)}</strong></p>
                  <p>Monto final estimado: <strong className="text-white">{formatMXN(payment.total)}</strong></p>
                </div>
              </Card>
            </div>
          ) : null}

          {step === 2 ? (
            <Card className="space-y-5">
              <div>
                <h2 className="font-black text-[var(--color-institutional)]">Validación de identidad</h2>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  Los archivos se validan por tipo y tamaño. En este MVP se mantienen solo en memoria
                  del navegador y no se guardan en localStorage.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {(["ineFront", "ineBack", "selfie"] as FileKey[]).map((key) => (
                  <label key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                    <span className="block font-black text-[var(--color-institutional)]">{fileLabels[key].title}</span>
                    <span className="mt-1 block min-h-10 text-xs leading-5 text-[var(--color-muted)]">{fileLabels[key].desc}</span>
                    <input
                      className="mt-4 block w-full text-xs"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/*"
                      capture={fileLabels[key].capture}
                      onChange={(e) => updateFile(key, e.target.files?.[0] ?? null)}
                    />
                    {data.files[key] ? (
                      <span className="mt-3 block truncate rounded-md bg-white px-3 py-2 text-xs font-bold text-[var(--color-success)]">
                        {data.files[key]?.name}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span>{IDENTITY_CONSENT}</span>
              </label>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <h2 className="font-black text-[var(--color-institutional)]">Contrato completo</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                    Debe llegar al final del contrato antes de habilitar las aceptaciones.
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface)] p-4 text-sm">
                  <p><strong>Monto:</strong> {formatMXN(data.amount)}</p>
                  <p><strong>Plazo:</strong> {data.termYears} años</p>
                  <p><strong>Cuota:</strong> {formatMXN(payment.cuota)}</p>
                  <p><strong>Folio:</strong> {provisionalFolio}</p>
                </div>
              </div>
              <div
                className="max-h-[460px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4"
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 8) {
                    setContractScrolled(true);
                  }
                }}
              >
                <ContractClausesPreviewContent />
              </div>
              {!contractScrolled ? (
                <p className="text-xs font-bold text-[var(--color-muted)]">Desplácese hasta el final para activar aceptaciones.</p>
              ) : null}
              <div className={`grid gap-2 ${contractScrolled ? "" : "pointer-events-none opacity-50"}`}>
                {CONTRACT_CHECKBOXES.map((label, index) => (
                  <label key={label} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <input
                      type="checkbox"
                      disabled={!contractScrolled}
                      checked={data.checks[index]}
                      onChange={(e) => {
                        const checks = [...data.checks];
                        checks[index] = e.target.checked;
                        update("checks", checks);
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </Card>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
              <Card className="space-y-4">
                <h2 className="font-black text-[var(--color-institutional)]">Firma digital</h2>
                <Input
                  label="Confirmación de nombre completo"
                  value={data.confirmName}
                  onChange={(e) => update("confirmName", e.target.value)}
                />
                <SignaturePad onChange={(value) => update("signature", value)} />
              </Card>
              <Card className="h-max bg-slate-50">
                <h2 className="font-black text-[var(--color-institutional)]">Confirmación final</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div><dt className="text-[var(--color-muted)]">Cliente</dt><dd className="font-bold">{data.fullName}</dd></div>
                  <div><dt className="text-[var(--color-muted)]">CURP</dt><dd className="font-bold">{data.curp}</dd></div>
                  <div><dt className="text-[var(--color-muted)]">Teléfono</dt><dd className="font-bold">{data.phone}</dd></div>
                  <div><dt className="text-[var(--color-muted)]">Monto y plazo</dt><dd className="font-bold">{formatMXN(data.amount)} - {data.termYears} años</dd></div>
                  <div><dt className="text-[var(--color-muted)]">Fecha CDMX</dt><dd className="font-bold">{formatCdmxDateTime()}</dd></div>
                </dl>
                <p className="mt-4 text-xs leading-5 text-[var(--color-muted)]">
                  La firma, INE, selfie, folio, huella técnica, dispositivo y aceptaciones integran el
                  expediente digital.
                </p>
              </Card>
            </div>
          ) : null}

          {step === 5 && result ? (
            <Card className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-success)]">
                  Contrato generado
                </p>
                <h2 className="mt-2 text-3xl font-black text-[var(--color-institutional)]">
                  Contrato listo para descarga
                </h2>
              </div>
              <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm md:grid-cols-2">
                <p><strong>Folio:</strong> {result.folio}</p>
                <p><strong>Fecha CDMX:</strong> {result.createdAtCdmx}</p>
                <p><strong>Navegador:</strong> {result.browser}</p>
                <p><strong>Dispositivo:</strong> {result.device}</p>
                <p className="break-all md:col-span-2"><strong>Huella SHA-256:</strong> {result.hash}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={downloadPdf}>Descargar PDF</Button>
                <Button
                  href={`${BRAND.whatsappUrl}&text=${encodeURIComponent(`Contrato ${result.folio} generado.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  Enviar por WhatsApp
                </Button>
              </div>
            </Card>
          ) : null}
        </div>

        <div className="mt-6 flex justify-between">
          {step > 1 && step < 5 ? (
            <Button variant="ghost" onClick={prevStep}>
              Anterior
            </Button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button onClick={nextStep}>Siguiente</Button>
          ) : step === 4 ? (
            <Button onClick={finalize}>Finalizar y generar</Button>
          ) : null}
        </div>
        <div className="pointer-events-none fixed left-0 top-0 -translate-x-[120vw]" aria-hidden="true">
          <div ref={page1Ref} style={{ width: 816, height: 1056, background: "#fff" }}>
            <DigitalContractPage1 data={contractData} />
          </div>
          <div ref={page2Ref} style={{ width: 816, height: 1056, background: "#fff" }}>
            <DigitalContractPage2 />
          </div>
          <div ref={page3Ref} style={{ width: 816, height: 1056, background: "#fff" }}>
            <DigitalContractPage3 data={contractData} signatureDataUrl={data.signature} />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
