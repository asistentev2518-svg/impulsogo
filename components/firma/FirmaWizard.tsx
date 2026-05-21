"use client";

import { useMemo, useRef, useState } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ContractDocument } from "@/components/contract/ContractDocument";
import { SignaturePad } from "@/components/firma/SignaturePad";
import {
  ALLOWED_TERMS,
  calculateMonthlyPayment,
  formatMXN,
  validateAmount,
  validateTerm,
  type TermYears,
} from "@/lib/finance";
import { CONTRACT_CHECKBOXES, IDENTITY_CONSENT } from "@/lib/config";
import { CLAUSE_SECTIONS } from "@/lib/contract";
import { exportElementToPdf } from "@/lib/pdf";
import { generateQrDataUrl, buildValidationUrl } from "@/lib/qr";
import { sha256CanonicalBrowser } from "@/lib/hash";
import { formatCdmxDateTime, toUtcIso } from "@/lib/datetime";
import { parseUserAgent } from "@/lib/device";
import { BRAND } from "@/lib/config";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type FileKey = "ineFront" | "ineBack" | "selfie";

type WizardData = {
  fullName: string;
  curp: string;
  phone: string;
  address: string;
  amount: number;
  termYears: TermYears;
  consent: boolean;
  checks: boolean[];
  signature: string | null;
  confirmName: string;
  files: Record<FileKey, File | null>;
};

function validateFile(file: File | null) {
  if (!file) return "Archivo requerido.";
  if (!ACCEPTED_TYPES.includes(file.type)) return "Solo JPG, PNG o WEBP.";
  if (file.size > MAX_FILE_SIZE) return "Máximo 10 MB por archivo.";
  return null;
}

export function FirmaWizard() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [contractScrolled, setContractScrolled] = useState(false);
  const [result, setResult] = useState<{
    folio: string;
    hash: string;
    qrUrl: string;
    qrDataUrl: string;
    createdAtCdmx: string;
  } | null>(null);
  const contractRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<WizardData>({
    fullName: "",
    curp: "",
    phone: "",
    address: "",
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
    const device = parseUserAgent(navigator.userAgent);
    const acceptances = Object.fromEntries(
      CONTRACT_CHECKBOXES.map((label, index) => [
        label,
        data.checks[index] ? createdAtCdmx : "",
      ]),
    );

    const response = await fetch("/api/expedientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.fullName,
        curp: data.curp,
        phone: data.phone,
        address: data.address,
        amount: data.amount,
        termYears: data.termYears,
        acceptances,
      }),
    });

    if (!response.ok) {
      setError("No fue posible registrar el expediente.");
      return;
    }

    const payload = (await response.json()) as {
      record: { folio: string; hash: string };
    };

    const hash = await sha256CanonicalBrowser({
      folio: payload.record.folio,
      cliente: data.fullName,
      firma: true,
      ine: true,
      selfie: true,
      fecha: createdAtCdmx,
    });

    const qrUrl = buildValidationUrl(payload.record.folio);
    const qrDataUrl = await generateQrDataUrl(qrUrl);

    setResult({
      folio: payload.record.folio,
      hash: payload.record.hash || hash,
      qrUrl,
      qrDataUrl,
      createdAtCdmx,
    });
    setStep(5);
  }

  async function downloadPdf() {
    if (!contractRef.current || !result) return;
    await exportElementToPdf(contractRef.current, `contrato-${result.folio}.pdf`);
  }

  const contractData = {
    fullName: data.fullName,
    curp: data.curp,
    phone: data.phone,
    address: data.address,
    amount: data.amount,
    termYears: data.termYears,
    monthlyPayment: payment.cuota,
    totalAtMaturity: payment.total,
    folio: result?.folio ?? provisionalFolio,
  };

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--color-institutional)]">
            Firma de contrato digital
          </h1>
          <p className="text-sm text-[var(--color-muted)]">Paso {step} de 5</p>
        </div>

        {error ? <p className="mb-4 text-sm text-[var(--color-danger)]">{error}</p> : null}

        {step === 1 ? (
          <Card className="space-y-4">
            <Input
              label="Nombre completo"
              value={data.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
            <Input
              label="CURP"
              value={data.curp}
              onChange={(e) => update("curp", e.target.value.toUpperCase())}
            />
            <Input
              label="Teléfono (10 dígitos)"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <Input
              label="Domicilio completo"
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <Input
              label="Monto solicitado (MXN)"
              type="number"
              step={5000}
              min={10000}
              value={data.amount}
              onChange={(e) => update("amount", Number(e.target.value))}
            />
            <label className="text-sm font-medium">
              Plazo en años
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                value={data.termYears}
                onChange={(e) => update("termYears", Number(e.target.value) as TermYears)}
              >
                {ALLOWED_TERMS.map((term) => (
                  <option key={term} value={term}>
                    {term} años
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-xl bg-[var(--color-surface)] p-4 text-sm">
              <p>Tasa anual ordinaria fija: 7%</p>
              <p className="mt-1 font-semibold text-[var(--color-success)]">
                Cuota mensual estimada: {formatMXN(payment.cuota)}
              </p>
              <p>Monto final estimado: {formatMXN(payment.total)}</p>
            </div>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="space-y-4">
            {(["ineFront", "ineBack", "selfie"] as FileKey[]).map((key) => (
              <label key={key} className="block text-sm">
                <span className="font-medium">
                  {key === "ineFront"
                    ? "INE frente"
                    : key === "ineBack"
                      ? "INE reverso"
                      : "Selfie sosteniendo INE"}
                </span>
                <input
                  className="mt-2 block w-full text-sm"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/*"
                  capture={key === "selfie" ? "user" : "environment"}
                  onChange={(e) => updateFile(key, e.target.files?.[0] ?? null)}
                />
              </label>
            ))}
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              <span>{IDENTITY_CONSENT}</span>
            </label>
            <p className="text-xs text-[var(--color-muted)]">
              MVP: los archivos se mantienen solo en memoria del navegador para generar el PDF. No
              se almacenan en localStorage ni en servidor.
            </p>
          </Card>
        ) : null}

        {step === 3 ? (
          <Card>
            <div
              className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-200 p-4"
              onScroll={(e) => {
                const target = e.currentTarget;
                if (target.scrollTop + target.clientHeight >= target.scrollHeight - 8) {
                  setContractScrolled(true);
                }
              }}
            >
              {CLAUSE_SECTIONS.map((section) => (
                <div key={section.title} className="mb-4 text-sm">
                  <h3 className="font-bold text-[var(--color-institutional)]">{section.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-[var(--color-muted)]">{section.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {CONTRACT_CHECKBOXES.map((label, index) => (
                <label key={label} className="flex items-start gap-2 text-sm">
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
          <Card className="space-y-4">
            <Input
              label="Confirmación de nombre completo"
              value={data.confirmName}
              onChange={(e) => update("confirmName", e.target.value)}
            />
            <SignaturePad onChange={(value) => update("signature", value)} />
            <div className="rounded-xl bg-[var(--color-surface)] p-4 text-sm">
              <p>
                La firma, INE, selfie, folio, hash, dispositivo y aceptaciones integran el
                expediente digital.
              </p>
              <p className="mt-2">
                {data.fullName} · {formatMXN(data.amount)} · {data.termYears} años · 7% ·{" "}
                {formatCdmxDateTime()}
              </p>
            </div>
          </Card>
        ) : null}

        {step === 5 && result ? (
          <Card className="space-y-4">
            <p className="font-semibold text-[var(--color-success)]">Contrato generado</p>
            <p>Folio: {result.folio}</p>
            <p className="break-all text-xs">Hash: {result.hash}</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadPdf}>Descargar PDF</Button>
              <Button
                href={`${BRAND.whatsappUrl}?text=${encodeURIComponent(`Contrato ${result.folio} generado.`)}`}
                variant="secondary"
              >
                Enviar por WhatsApp
              </Button>
              <Button href={`/validar/${result.folio}`} variant="ghost">
                Verificar folio
              </Button>
            </div>
          </Card>
        ) : null}

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

        <div className="pointer-events-none fixed -left-[9999px] top-0">
          <div ref={contractRef}>
            <ContractDocument
              data={contractData}
              qrDataUrl={result?.qrDataUrl}
              showEvidence
              evidence={
                result
                  ? {
                      folio: result.folio,
                      hash: result.hash,
                      createdAtCdmx: result.createdAtCdmx,
                      browser: parseUserAgent(navigator.userAgent).browser,
                      device: parseUserAgent(navigator.userAgent).device,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
