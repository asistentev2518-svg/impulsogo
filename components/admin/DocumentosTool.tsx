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
  advisorInitials,
  calculateCancellationDebt,
  calculateMonthlyPayment,
  calculatePenalty,
  formatMXN,
  maskAccount,
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

export function DocumentosTool() {
  const [docType, setDocType] = useState<DocType>("aprobacion");
  const [form, setForm] = useState({ ...demo });
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
      policyNumber: `POL-${form.expedienteFolio}`,
      policyValidUntil: "31/12/2028",
      advisorInitials: advisorInitials(form.executive),
      cdmxDateTime: formatCdmxDateTime(),
    };
  }, [form]);

  const data: InternalDocData = { ...form, ...computed };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm(JSON.parse(saved) as typeof form);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const whatsappText = `Impulso Go\nCliente: ${form.clientName}\nMonto: ${formatMXN(form.approvedAmount)}\nPlazo: ${form.termYears} años\nCuota estimada: ${formatMXN(computed.monthlyPayment)}\nFolio: ${form.expedienteFolio}`;

  async function downloadPng() {
    if (!previewRef.current) return;
    await exportElementToPng(
      previewRef.current.firstElementChild as HTMLElement,
      `${docType}-${form.expedienteFolio}.png`,
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
    <div className="space-y-6">
      <Card className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre completo" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
        <Input label="Monto aprobado" type="number" value={form.approvedAmount} onChange={(e) => setForm({ ...form, approvedAmount: Number(e.target.value) })} />
        <Input label="Comisión apertura" type="number" value={form.openingCommission} onChange={(e) => setForm({ ...form, openingCommission: Number(e.target.value) })} />
        <Input label="Últimos 4 dígitos cuenta" value={form.accountLastFour} onChange={(e) => setForm({ ...form, accountLastFour: e.target.value })} />
        <Input label="Plazo (años)" type="number" value={form.termYears} onChange={(e) => setForm({ ...form, termYears: Number(e.target.value) as TermYears })} />
        <Input label="Ejecutivo" value={form.executive} onChange={(e) => setForm({ ...form, executive: e.target.value })} />
        <Input label="Ciudad/sucursal" value={form.branchCity} onChange={(e) => setForm({ ...form, branchCity: e.target.value })} />
        <Input label="Folio expediente" value={form.expedienteFolio} onChange={(e) => setForm({ ...form, expedienteFolio: e.target.value })} />
        <Input label="Folio CONDUSEF/SIPRES" value={form.condusefFolio} onChange={(e) => setForm({ ...form, condusefFolio: e.target.value })} />
        <p className="text-sm text-[var(--color-muted)]">Fecha CDMX: {computed.cdmxDateTime}</p>
      </Card>

      <div className="flex flex-wrap gap-2">
        {(["aprobacion", "cancelacion", "poliza", "privacidad"] as DocType[]).map((type) => (
          <Button key={type} variant={docType === type ? "primary" : "secondary"} onClick={() => setDocType(type)}>
            {type}
          </Button>
        ))}
        <Button variant="ghost" onClick={() => setForm({ ...demo })}>Restaurar demo</Button>
        <Button variant="ghost" onClick={() => setForm({ ...demo, clientName: "", expedienteFolio: "" })}>Limpiar</Button>
        <Button onClick={downloadPng}>Descargar PNG</Button>
        <Button
          variant="secondary"
          onClick={() => navigator.clipboard.writeText(whatsappText)}
        >
          Copiar texto WhatsApp
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-slate-100 p-4">
        <div ref={previewRef} className="origin-top-left scale-[0.35] md:scale-50">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
