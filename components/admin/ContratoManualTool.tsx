"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ManualContractPage1,
  ManualContractPage2,
  ManualContractPage3,
} from "@/components/contract/ManualContractPages";
import type { ContractGender } from "@/lib/contract";
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
    gender: "" as ContractGender | "",
    monthlyIncome: "",
    grantDate: formatCdmxDate(),
    bankAccount: "",
    bankName: "",
  });

  const contractData = {
    fullName: form.fullName,
    curp: form.curp,
    phone: form.phone,
    address: form.address,
    gender: form.gender || undefined,
    monthlyIncome: form.monthlyIncome,
    grantDate: form.grantDate,
    bankAccount: form.bankAccount,
    bankName: form.bankName,
    amount: 0,
    termYears: 2 as const,
    monthlyPayment: 0,
    totalAtMaturity: 0,
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
    const elements = [page1Ref.current, page2Ref.current, page3Ref.current].filter(
      Boolean,
    ) as HTMLElement[];
    if (!elements.length) return;
    await exportElementsToPdf(elements, "contrato-manual.pdf");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[400px_1fr]">
      <Card className="h-max space-y-5">
        <div>
          <h2 className="font-black text-[var(--color-institutional)]">Datos del contrato</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            Precarga datos del cliente. <strong>Monto y plazo</strong> los completa el cliente en el
            documento impreso.
          </p>
        </div>
        <div className="grid gap-4">
          <Input
            label="Nombre completo"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="CURP"
            value={form.curp}
            onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })}
          />
          <label className="text-sm">
            <span className="font-bold text-[var(--color-text)]">Sexo</span>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3.5"
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value as ContractGender | "" })
              }
            >
              <option value="">—</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </label>
          <Input
            label="Teléfono"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Ingresos mensuales"
            value={form.monthlyIncome}
            onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
          />
          <Input
            label="Domicilio"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="Fecha de otorgamiento"
            value={form.grantDate}
            onChange={(e) => setForm({ ...form, grantDate: e.target.value })}
          />
          <Input
            label="Cuenta a acreditar"
            value={form.bankAccount}
            onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
          />
          <Input label="Banco" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Button onClick={() => ensureQr()}>Preparar QR</Button>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => exportPng(0)}>
              Pág. 1
            </Button>
            <Button variant="secondary" onClick={() => exportPng(1)}>
              Pág. 2
            </Button>
            <Button variant="secondary" onClick={() => exportPng(2)}>
              Pág. 3
            </Button>
          </div>
          <Button variant="secondary" onClick={exportPdf}>
            Descargar PDF completo
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            Imprimir
          </Button>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
        <div className="origin-top-left scale-[0.42] space-y-6 sm:scale-[0.5]">
          <div ref={page1Ref} className="shadow-lg">
            <ManualContractPage1 data={contractData} qrDataUrl={qrDataUrl} />
          </div>
          <div ref={page2Ref} className="shadow-lg">
            <ManualContractPage2 qrDataUrl={qrDataUrl} />
          </div>
          <div ref={page3Ref} className="shadow-lg">
            <ManualContractPage3 data={contractData} qrDataUrl={qrDataUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
