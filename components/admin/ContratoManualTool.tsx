"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ManualContractPage1,
  ManualContractPage2,
  ManualContractPage3,
} from "@/components/contract/ManualContractPages";
import {
  calculateMonthlyPayment,
  validateAmount,
  validateTerm,
  type TermYears,
} from "@/lib/finance";
import { ALLOWED_TERMS } from "@/lib/finance";
import { exportElementsToPdf } from "@/lib/pdf";
import { exportElementToPng } from "@/lib/png-export";
import { generateQrDataUrl } from "@/lib/qr";
import { INSTITUTION } from "@/lib/config";
import { formatCdmxDate } from "@/lib/datetime";

export function ContratoManualTool() {
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [form, setForm] = useState({
    fullName: "",
    curp: "",
    phone: "",
    address: "",
    amount: 10000,
    termYears: 2 as TermYears,
    grantDate: formatCdmxDate(),
    bankAccount: "",
    bankName: "",
  });
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const payment = useMemo(
    () => calculateMonthlyPayment(form.amount, form.termYears),
    [form.amount, form.termYears],
  );

  const maturityDate = useMemo(() => {
    const base = new Date();
    base.setFullYear(base.getFullYear() + form.termYears);
    return formatCdmxDate(base.toISOString());
  }, [form.termYears]);

  const contractData = {
    ...form,
    monthlyPayment: payment.cuota,
    totalAtMaturity: payment.total,
    maturityDate,
  };

  async function ensureQr() {
    if (qrDataUrl) return qrDataUrl;
    const url = await generateQrDataUrl(INSTITUTION.institutionalQrUrl);
    setQrDataUrl(url);
    return url;
  }

  async function exportPng(index: number) {
    const el = refs[index].current;
    if (!el) return;
    await exportElementToPng(el, `contrato-manual-p${index + 1}.png`, 816, 1056);
  }

  async function exportPdf() {
    const elements = refs.map((ref) => ref.current).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    await exportElementsToPdf(elements, "contrato-manual.pdf");
  }

  const amountError = validateAmount(form.amount);
  const termError = validateTerm(form.termYears);

  return (
    <div className="space-y-6">
      <Card className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre completo" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <Input label="CURP" value={form.curp} onChange={(e) => setForm({ ...form, curp: e.target.value })} />
        <Input label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Domicilio" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="Monto" type="number" step={5000} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
        <label className="text-sm">
          Plazo
          <select className="mt-2 w-full rounded-xl border px-4 py-3" value={form.termYears} onChange={(e) => setForm({ ...form, termYears: Number(e.target.value) as TermYears })}>
            {ALLOWED_TERMS.map((t) => (
              <option key={t} value={t}>{t} años</option>
            ))}
          </select>
        </label>
        <Input label="Fecha de otorgamiento" value={form.grantDate} onChange={(e) => setForm({ ...form, grantDate: e.target.value })} />
        <Input label="Cuenta a acreditar" value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} />
        <Input label="Banco" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
        {amountError || termError ? (
          <p className="text-sm text-[var(--color-danger)]">{amountError ?? termError}</p>
        ) : null}
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button onClick={() => ensureQr()}>Preparar QR</Button>
          <Button variant="secondary" onClick={() => exportPng(0)}>PNG página 1</Button>
          <Button variant="secondary" onClick={() => exportPng(1)}>PNG página 2</Button>
          <Button variant="secondary" onClick={() => exportPng(2)}>PNG página 3</Button>
          <Button variant="secondary" onClick={exportPdf}>PDF completo</Button>
          <Button variant="ghost" onClick={() => window.print()}>Imprimir</Button>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-2xl border bg-white p-4">
        <div className="space-y-6">
          <div ref={refs[0]}><ManualContractPage1 data={contractData} qrDataUrl={qrDataUrl} /></div>
          <div ref={refs[1]}><ManualContractPage2 qrDataUrl={qrDataUrl} /></div>
          <div ref={refs[2]}><ManualContractPage3 data={contractData} qrDataUrl={qrDataUrl} /></div>
        </div>
      </div>
    </div>
  );
}
