"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ManualContractPage1,
  ManualContractPage2,
  ManualContractPage3,
  type EditableContractClause,
  type EditableContractSettings,
} from "@/components/contract/ManualContractPages";
import { CLAUSE_SECTIONS, CONTRACT_CLAUSES, type ContractGender } from "@/lib/contract";
import { exportElementsToPdf } from "@/lib/pdf";
import { exportElementToPng } from "@/lib/png-export";
import { generateQrDataUrl } from "@/lib/qr";
import { INSTITUTION } from "@/lib/config";
import { formatCdmxDate } from "@/lib/datetime";

const PREVIEW_SCALE = 0.56;

type ContractEditorSettings = {
  annualRatePercent: string;
  legalName: string;
  representative: string;
  representativeTitle: string;
  jurisdiction: string;
  qrUrl: string;
  declarations: string;
};

const defaultSettings: ContractEditorSettings = {
  annualRatePercent: String(INSTITUTION.annualRatePercent),
  legalName: INSTITUTION.legalName,
  representative: INSTITUTION.representative,
  representativeTitle: INSTITUTION.representativeTitle,
  jurisdiction: INSTITUTION.jurisdiction,
  qrUrl: INSTITUTION.institutionalQrUrl,
  declarations: CONTRACT_CLAUSES.declaraciones,
};

function defaultClauses(): EditableContractClause[] {
  return CLAUSE_SECTIONS.slice(1).map((section) => ({
    title: section.title,
    body: section.body,
  }));
}

function waitForPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export function ContratoManualTool() {
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [qrSource, setQrSource] = useState("");
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);
  const [clauseSearch, setClauseSearch] = useState("");
  const [settings, setSettings] = useState(defaultSettings);
  const [clauses, setClauses] = useState<EditableContractClause[]>(() => defaultClauses());
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

  const contractSettings: EditableContractSettings = useMemo(
    () => ({
      annualRatePercent: settings.annualRatePercent.replace("%", "").trim() || INSTITUTION.annualRatePercent,
      legalName: settings.legalName,
      representative: settings.representative,
      representativeTitle: settings.representativeTitle,
      declarations: settings.declarations,
    }),
    [settings],
  );

  const filteredClauses = useMemo(() => {
    const query = clauseSearch.trim().toLowerCase();
    if (!query) return clauses.map((clause, index) => ({ clause, index }));
    return clauses
      .map((clause, index) => ({ clause, index }))
      .filter(({ clause }) => {
        return (
          clause.title.toLowerCase().includes(query) ||
          clause.body.toLowerCase().includes(query)
        );
      });
  }, [clauseSearch, clauses]);

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
    const source = settings.qrUrl.trim() || INSTITUTION.institutionalQrUrl;
    if (qrDataUrl && qrSource === source) return qrDataUrl;
    const nextQr = await generateQrDataUrl(source);
    setQrDataUrl(nextQr);
    setQrSource(source);
    return nextQr;
  }

  function updateClause(index: number, patch: Partial<EditableContractClause>) {
    setClauses((current) =>
      current.map((clause, clauseIndex) =>
        clauseIndex === index ? { ...clause, ...patch } : clause,
      ),
    );
  }

  function moveClause(index: number, direction: -1 | 1) {
    setClauses((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function addClause() {
    setClauses((current) => [
      ...current,
      {
        title: `NUEVA CLÁUSULA ${current.length + 1}`,
        body: "Describe aquí la condición contractual correspondiente.",
      },
    ]);
    setClauseSearch("");
  }

  function removeClause(index: number) {
    setClauses((current) => current.filter((_, clauseIndex) => clauseIndex !== index));
  }

  function resetContractEditor() {
    setSettings(defaultSettings);
    setClauses(defaultClauses());
    setQrDataUrl(undefined);
    setQrSource("");
  }

  function pageComponent(page: number) {
    if (page === 1) {
      return (
        <ManualContractPage1
          data={contractData}
          qrDataUrl={qrDataUrl}
          settings={contractSettings}
        />
      );
    }
    if (page === 2) {
      return (
        <ManualContractPage2
          qrDataUrl={qrDataUrl}
          settings={contractSettings}
          clauses={clauses}
        />
      );
    }
    return (
      <ManualContractPage3
        data={contractData}
        qrDataUrl={qrDataUrl}
        settings={contractSettings}
        clauses={clauses}
      />
    );
  }

  async function exportPng(index: number) {
    await ensureQr();
    await document.fonts?.ready;
    await waitForPaint();
    const pages = [page1Ref.current, page2Ref.current, page3Ref.current];
    const el = pages[index];
    if (!el) return;
    await exportElementToPng(el, `contrato-manual-p${index + 1}.png`, 816, 1056);
  }

  async function exportPdf() {
    await ensureQr();
    await document.fonts?.ready;
    await waitForPaint();
    const elements = [page1Ref.current, page2Ref.current, page3Ref.current].filter(
      Boolean,
    ) as HTMLElement[];
    if (!elements.length) return;
    await exportElementsToPdf(elements, "contrato-manual.pdf");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(420px,0.95fr)_minmax(420px,1fr)]">
      <div className="space-y-5">
        <Card className="rounded-lg">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
              Datos generales
            </p>
            <h2 className="mt-2 text-xl font-black text-[var(--color-institutional)]">
              Datos generales del contrato
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Tasa anual fija"
              value={settings.annualRatePercent}
              onChange={(e) => setSettings({ ...settings, annualRatePercent: e.target.value })}
            />
            <Input
              label="Razón social"
              value={settings.legalName}
              onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
            />
            <Input
              label="Representante legal"
              value={settings.representative}
              onChange={(e) => setSettings({ ...settings, representative: e.target.value })}
            />
            <Input
              label="Cargo del representante"
              value={settings.representativeTitle}
              onChange={(e) => setSettings({ ...settings, representativeTitle: e.target.value })}
            />
            <Input
              label="Jurisdicción"
              value={settings.jurisdiction}
              onChange={(e) => setSettings({ ...settings, jurisdiction: e.target.value })}
            />
            <Input
              label="URL del código QR"
              value={settings.qrUrl}
              onChange={(e) => {
                setSettings({ ...settings, qrUrl: e.target.value });
                setQrDataUrl(undefined);
              }}
            />
          </div>
          <label className="mt-4 block text-sm">
            <span className="font-bold text-[var(--color-text)]">Declaraciones</span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20"
              value={settings.declarations}
              onChange={(event) => setSettings({ ...settings, declarations: event.target.value })}
            />
          </label>
        </Card>

        <Card className="rounded-lg">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-[var(--color-institutional)]">
                Cláusulas ({clauses.length})
              </h2>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Edita, agrega, elimina o reordena las cláusulas del contrato manual.
              </p>
            </div>
            <Button onClick={addClause} className="shrink-0 bg-[var(--color-success)] hover:bg-[#087a33]">
              Añadir cláusula
            </Button>
          </div>
          <Input
            label="Buscar cláusula"
            value={clauseSearch}
            onChange={(event) => setClauseSearch(event.target.value)}
            placeholder="Buscar por título o contenido..."
          />
          <div className="mt-4 space-y-4">
            {filteredClauses.map(({ clause, index }) => (
              <div key={`${clause.title}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Cláusula #{index + 1}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => moveClause(index, -1)}
                      disabled={index === 0}
                      className="min-h-9 px-3 py-2 text-xs"
                    >
                      Subir
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => moveClause(index, 1)}
                      disabled={index === clauses.length - 1}
                      className="min-h-9 px-3 py-2 text-xs"
                    >
                      Bajar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeClause(index)}
                      disabled={clauses.length <= 1}
                      className="min-h-9 px-3 py-2 text-xs"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <Input
                  id={`clause-title-${index}`}
                  label="Título de la cláusula"
                  value={clause.title}
                  onChange={(event) => updateClause(index, { title: event.target.value })}
                />
                <label className="mt-3 block text-sm">
                  <span className="font-bold text-[var(--color-text)]">Contenido</span>
                  <textarea
                    className="mt-2 min-h-36 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--color-action)] focus:ring-2 focus:ring-[var(--color-action)]/20"
                    value={clause.body}
                    onChange={(event) => updateClause(index, { body: event.target.value })}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={resetContractEditor}>
              Volver a la configuración original
            </Button>
            <Button type="button" variant="secondary" onClick={ensureQr}>
              Preparar QR
            </Button>
          </div>
        </Card>

        <Card className="rounded-lg">
          <div className="mb-5">
            <h2 className="text-xl font-black text-[var(--color-institutional)]">Datos del cliente</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              Precarga datos del cliente. Monto y plazo se dejan en blanco para el documento manual.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nombre completo" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <Input label="CURP" value={form.curp} onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })} />
            <label className="text-sm">
              <span className="font-bold text-[var(--color-text)]">Sexo</span>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3.5"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as ContractGender | "" })}
              >
                <option value="">-</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </label>
            <Input label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Ingresos mensuales" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} />
            <Input label="Domicilio" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input label="Fecha de otorgamiento" value={form.grantDate} onChange={(e) => setForm({ ...form, grantDate: e.target.value })} />
            <Input label="Cuenta a acreditar" value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} />
            <Input label="Banco" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="sticky top-6 rounded-lg">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-action)]">
                Vista previa
              </p>
              <h2 className="text-xl font-black text-[var(--color-institutional)]">
                Vista previa en tiempo real
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setActivePage(page)}
                  className={`h-9 rounded-lg px-3 text-xs font-black ${
                    activePage === page
                      ? "bg-[var(--color-institutional)] text-white"
                      : "bg-slate-100 text-[var(--color-text)]"
                  }`}
                >
                  P{page}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
            <div
              className="overflow-hidden rounded-md shadow-lg"
              style={{ width: 816 * PREVIEW_SCALE, height: 1056 * PREVIEW_SCALE }}
            >
              <div
                className="origin-top-left"
                style={{ transform: `scale(${PREVIEW_SCALE})`, width: 816, height: 1056 }}
              >
                {pageComponent(activePage)}
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Button variant="secondary" onClick={() => exportPng(0)}>
              PNG pág. 1
            </Button>
            <Button variant="secondary" onClick={() => exportPng(1)}>
              PNG pág. 2
            </Button>
            <Button variant="secondary" onClick={() => exportPng(2)}>
              PNG pág. 3
            </Button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Button onClick={exportPdf}>Descargar PDF completo</Button>
            <Button variant="ghost" onClick={() => window.print()}>
              Imprimir
            </Button>
          </div>
        </Card>
      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0" aria-hidden="true">
        <div ref={page1Ref}>
          <ManualContractPage1 data={contractData} qrDataUrl={qrDataUrl} settings={contractSettings} />
        </div>
        <div ref={page2Ref}>
          <ManualContractPage2 qrDataUrl={qrDataUrl} settings={contractSettings} clauses={clauses} />
        </div>
        <div ref={page3Ref}>
          <ManualContractPage3 data={contractData} qrDataUrl={qrDataUrl} settings={contractSettings} clauses={clauses} />
        </div>
      </div>
    </div>
  );
}
