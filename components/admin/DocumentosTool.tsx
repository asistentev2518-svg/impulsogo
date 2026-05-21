"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ApprovalTemplate,
  CancellationTemplate,
  PolicyTemplate,
  PrivacyNoticeTemplate,
  type InternalDocData,
} from "@/components/documents/DocumentTemplates";
import {
  ALLOWED_TERMS,
  advisorInitials,
  calculateCancellationDebt,
  calculateMonthlyPayment,
  calculatePenalty,
  formatMXN,
  maskAccount,
  validateAmount,
  type TermYears,
} from "@/lib/finance";
import { formatCdmxDateTime } from "@/lib/datetime";
import { exportElementToPng } from "@/lib/png-export";

const STORAGE_KEY = "impulso:lastClient";

const demo = {
  clientName: "Juan Pérez García",
  approvedAmount: 25000,
  openingCommission: 1500,
  accountLastFour: "4321",
  termYears: 4 as TermYears,
  executive: "María López",
  branchCity: "Ciudad de México",
  expedienteFolio: "IG-2026-000001",
  condusefFolio: "SIPRES-REF-001",
};

type DocType = "aprobacion" | "cancelacion" | "poliza" | "privacidad";

const docs: Record<DocType, { label: string; desc: string }> = {
  aprobacion: {
    label: "Aprobación",
    desc: "Resumen comercial serio con monto, cuota, plazo y expediente.",
  },
  cancelacion: {
    label: "Cancelación",
    desc: "Advertencia fuerte con penalización, adeudo y consecuencias.",
  },
  poliza: {
    label: "Póliza",
    desc: "Seguro obligatorio vinculado al saldo del financiamiento.",
  },
  privacidad: {
    label: "Privacidad",
    desc: "Uso de datos personales para expediente y validación.",
  },
};
const PREVIEW_SCALE = 0.42;

function loadInitialForm() {
  if (typeof window === "undefined") return { ...demo };
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...demo, ...JSON.parse(saved) } : { ...demo };
  } catch {
    return { ...demo };
  }
}

export function DocumentosTool() {
  const [docType, setDocType] = useState<DocType>("aprobacion");
  const [form, setForm] = useState(loadInitialForm);
  const previewRef = useRef<HTMLDivElement>(null);

  const computed = useMemo(() => {
    const { cuota, total } = calculateMonthlyPayment(form.approvedAmount, form.termYears);
    const penalty = calculatePenalty(form.approvedAmount);
    return {
      monthlyPayment: cuota,
      totalPayment: total,
      penalty,
      cancellationDebt: calculateCancellationDebt(form.approvedAmount),
      maskedAccount: maskAccount(form.accountLastFour),
      policyNumber: `POL-${form.expedienteFolio || "SIN-FOLIO"}`,
      policyValidUntil: "31/12/2028",
      advisorInitials: advisorInitials(form.executive),
      cdmxDateTime: formatCdmxDateTime(),
    };
  }, [form]);

  const data: InternalDocData = { ...form, ...computed };
  const amountError = validateAmount(form.approvedAmount);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const whatsappText = `Impulso Go
Cliente: ${form.clientName}
Monto: ${formatMXN(form.approvedAmount)}
Plazo: ${form.termYears} años
Cuota estimada: ${formatMXN(computed.monthlyPayment)}
Folio: ${form.expedienteFolio}`;

  async function downloadPng() {
    if (!previewRef.current) return;
    await exportElementToPng(
      previewRef.current.firstElementChild as HTMLElement,
      `${docType}-${form.expedienteFolio || "sin-folio"}.png`,
      1080,
      1350,
    );
  }

  function renderTemplate() {
    if (docType === "aprobacion") return <ApprovalTemplate data={data} />;
    if (docType === "cancelacion") return <CancellationTemplate data={data} />;
    if (docType === "poliza") return <PolicyTemplate data={data} />;
    return <PrivacyNoticeTemplate data={data} />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <div>
            <h2 className="font-black text-[var(--color-institutional)]">Datos base</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              La información alimenta todos los formatos y cálculos.
            </p>
          </div>
          <Input label="Nombre completo" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Input label="Monto aprobado" type="number" value={form.approvedAmount} onChange={(e) => setForm({ ...form, approvedAmount: Number(e.target.value) })} />
            <Input label="Comisión apertura" type="number" value={form.openingCommission} onChange={(e) => setForm({ ...form, openingCommission: Number(e.target.value) })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Últimos 4 dígitos" value={form.accountLastFour} maxLength={4} onChange={(e) => setForm({ ...form, accountLastFour: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
            <label className="text-sm">
              <span className="font-bold text-[var(--color-text)]">Plazo</span>
              <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3.5 outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]" value={form.termYears} onChange={(e) => setForm({ ...form, termYears: Number(e.target.value) as TermYears })}>
                {ALLOWED_TERMS.map((term) => (
                  <option key={term} value={term}>{term} años</option>
                ))}
              </select>
            </label>
          </div>
          <Input label="Ejecutivo asignado" value={form.executive} onChange={(e) => setForm({ ...form, executive: e.target.value })} />
          <Input label="Ciudad/sucursal" value={form.branchCity} onChange={(e) => setForm({ ...form, branchCity: e.target.value })} />
          <Input label="Folio expediente" value={form.expedienteFolio} onChange={(e) => setForm({ ...form, expedienteFolio: e.target.value.toUpperCase() })} />
          <Input label="Folio CONDUSEF/SIPRES" value={form.condusefFolio} onChange={(e) => setForm({ ...form, condusefFolio: e.target.value })} />
          {amountError ? <p className="text-sm font-semibold text-[var(--color-danger)]">{amountError}</p> : null}
        </Card>

        <Card className="space-y-3 bg-slate-50">
          <h2 className="font-black text-[var(--color-institutional)]">Cálculos automáticos</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[var(--color-muted)]">Pago mensual</p>
              <p className="font-black text-[var(--color-success)]">{formatMXN(computed.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)]">Total estimado</p>
              <p className="font-black">{formatMXN(computed.totalPayment)}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)]">Penalización 10%</p>
              <p className="font-black text-[var(--color-danger)]">{formatMXN(computed.penalty)}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)]">Cuenta</p>
              <p className="font-black">{computed.maskedAccount}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="space-y-4">
          <div className="grid gap-2 md:grid-cols-4">
            {(Object.keys(docs) as DocType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDocType(type)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  docType === type
                    ? "border-[var(--color-action)] bg-[var(--color-surface)]"
                    : "border-slate-200 bg-white hover:border-[var(--color-action)]/40"
                }`}
              >
                <span className="block text-sm font-black text-[var(--color-institutional)]">{docs[type].label}</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--color-muted)]">{docs[type].desc}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setForm({ ...demo })}>Restaurar demo</Button>
            <Button variant="ghost" onClick={() => setForm({ ...demo, clientName: "", expedienteFolio: "" })}>Limpiar</Button>
            <Button onClick={downloadPng}>Descargar PNG</Button>
            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(whatsappText)}>
              Copiar texto WhatsApp
            </Button>
          </div>
        </Card>

        <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
          <div
            className="overflow-hidden"
            style={{ width: 1080 * PREVIEW_SCALE, height: 1350 * PREVIEW_SCALE }}
          >
            <div
              ref={previewRef}
              className="origin-top-left"
              style={{ transform: `scale(${PREVIEW_SCALE})`, width: 1080, height: 1350 }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
