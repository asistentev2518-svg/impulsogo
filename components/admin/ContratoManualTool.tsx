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
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
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
    await ensureQr();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const pages = [page1Ref.current, page2Ref.current, page3Ref.current];
    const el = pages[index];
    if (!el) return;
    await exportElementToPng(el, `contrato-manual-p${index + 1}.png`, 816, 1056);
  }

  async function exportPdf() {
    await ensureQr();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const elements = [page1Ref.current, page2Ref.current, page3Ref.current].filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    await exportElementsToPdf(elements, "contrato-manual.pdf");
  }

  const amountError = validateAmount(form.amount);
  const termError = validateTerm(form.termYears);

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <Card className="h-max space-y-5">
        <div>
          <h2 className="font-black text-[var(--color-institutional)]">Datos del contrato</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            El formato conserva las cláusulas base y agrega datos operativos para impresión.
          </p>
        </div>
        <div className="grid gap-4">
          <Input label="Nombre completo" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="CURP" value={form.curp} onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })} />
          <Input label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Domicilio" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Input label="Monto" type="number" step={5000} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            <label className="text-sm">
              <span className="font-bold text-[var(--color-text)]">Plazo</span>
              <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3.5 outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]" value={form.termYears} onChange={(e) => setForm({ ...form, termYears: Number(e.target.value) as TermYears })}>
                {ALLOWED_TERMS.map((t) => (
                  <option key={t} value={t}>{t} años</option>
                ))}
              </select>
            </label>
          </div>
          <Input label="Fecha de otorgamiento" value={form.grantDate} onChange={(e) => setForm({ ...form, grantDate: e.target.value })} />
          <Input label="Cuenta a acreditar" value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} />
          <Input label="Banco" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-bold text-[var(--color-institutional)]">Resumen automático</p>
          <p className="mt-2 text-[var(--color-muted)]">Cuota mensual estimada: {payment.cuota.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })}</p>
          <p className="text-[var(--color-muted)]">Vencimiento estimado: {maturityDate}</p>
        </div>
        {amountError || termError ? (
          <p className="text-sm font-semibold text-[var(--color-danger)]">{amountError ?? termError}</p>
        ) : null}
        <div className="grid gap-2">
          <Button onClick={() => ensureQr()}>Preparar QR</Button>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => exportPng(0)}>Pág. 1</Button>
            <Button variant="secondary" onClick={() => exportPng(1)}>Pág. 2</Button>
            <Button variant="secondary" onClick={() => exportPng(2)}>Pág. 3</Button>
          </div>
          <Button variant="secondary" onClick={exportPdf}>Descargar PDF completo</Button>
          <Button variant="ghost" onClick={() => window.print()}>Imprimir</Button>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
        <div className="space-y-6">
          <div ref={page1Ref} className="document-shadow"><ManualContractPage1 data={contractData} qrDataUrl={qrDataUrl} /></div>
          <div ref={page2Ref} className="document-shadow"><ManualContractPage2 qrDataUrl={qrDataUrl} /></div>
          <div ref={page3Ref} className="document-shadow"><ManualContractPage3 data={contractData} qrDataUrl={qrDataUrl} /></div>
        </div>
      </div>
    </div>
  );
}
