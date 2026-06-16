"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import jsPDF from "jspdf";
import QRCode from "qrcode";

import { AdminShell } from "@/components/layout/AdminShell";
import { ToolHeader } from "@/components/admin/ToolHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { ASSETS, INSTITUTION } from "@/lib/config";
import { CONTRACT_CLAUSES, buildContractSummary, type ContractClientData, type ContractGender } from "@/lib/contract";
import { calculateMonthlyPayment, formatMXN, validateAmount, validateTerm, type TermYears } from "@/lib/finance";
import { sha256CanonicalBrowser } from "@/lib/hash-browser";

type Sexo = ContractGender;

const CURP_REGEX = /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}[A-Z]{1}[A-Z0-9]{2}[0-9A-Z]{1}[0-9]{1}$/;

function validateCurp(curpRaw: string) {
  const curp = curpRaw.trim().toUpperCase();
  const ok = curp.length === 18 && CURP_REGEX.test(curp);
  return { ok, curp };
}

function formatPhone10(digitsRaw: string) {
  const digits = digitsRaw.replace(/\D/g, "").slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

function randomFolio() {
  const year = 2026;
  const n = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `IG-${year}-${n}`;
}

function getTodayISODateLocal() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addYearsToDate(isoDate: string, years: number) {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setFullYear(d.getFullYear() + years);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function cdmxDateLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("es-MX", { year: "numeric", month: "short", day: "2-digit" }).format(d);
}

async function addQrToPdf(doc: jsPDF, qrPayload: string, x: number, y: number, sizeMm: number) {
  const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 0, width: 240 });
  doc.addImage(qrDataUrl, "PNG", x, y, sizeMm, sizeMm, undefined, "FAST");
}

function addHeaderToPdf(doc: jsPDF, header: { folio: string; generatedAt: string; sha256: string }) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const headerTop = 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Impulso Go", marginX, headerTop + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Folio: ${header.folio}`, pageWidth - marginX - 70, headerTop + 6);
  doc.text(`Generado: ${header.generatedAt}`, pageWidth - marginX - 70, headerTop + 13);
  doc.text(`SHA-256: ${header.sha256}`, pageWidth - marginX - 120, headerTop + 20);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type WizardStep = 1 | 2 | 3 | 4;

export default function ExpedientesPage() {
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("impulso_visual_auth");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { sub?: string };
      if (parsed?.sub) setUser(String(parsed.sub));
    } catch {
      // ignore
    }
  }, []);

  const [step, setStep] = useState<WizardStep>(1);

  // STEP 1
  const [fullName, setFullName] = useState("");
  const [curp, setCurp] = useState("");
  const [gender, setGender] = useState<Sexo>("Masculino");
  const [phoneRaw, setPhoneRaw] = useState(""); // digits
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [address, setAddress] = useState("");

  const { ok: curpOk, curp: curpNorm } = useMemo(() => validateCurp(curp), [curp]);
  const phoneDigits = useMemo(() => phoneRaw.replace(/\D/g, "").slice(0, 10), [phoneRaw]);
  const phoneOk = phoneDigits.length === 10;
  const addressLinesOk = useMemo(() => address.trim().split(/\n+/).filter(Boolean).length >= 3, [address]);

  // STEP 2
  const [amount, setAmount] = useState(100000);
  const [termYears, setTermYears] = useState<TermYears>(4);
  const [grantDate, setGrantDate] = useState(getTodayISODateLocal());

  const maturityDate = useMemo(() => addYearsToDate(grantDate, termYears), [grantDate, termYears]);

  const { cuota, total } = useMemo(() => {
    const { cuota: c, total: t } = calculateMonthlyPayment(amount, termYears);
    return { cuota: c, total: t };
  }, [amount, termYears]);

  const amountErr = useMemo(() => validateAmount(amount), [amount]);
  const termErr = useMemo(() => validateTerm(termYears as number), [termYears]);
  const step2Ok = !amountErr && !termErr;

  // STEP 3
  const [acceptClauses, setAcceptClauses] = useState(false);

  const contractData: ContractClientData = useMemo(
    () => ({
      fullName: fullName.trim(),
      curp: curpNorm,
      phone: phoneDigits,
      address: address.trim(),
      gender,
      amount,
      termYears,
      monthlyPayment: cuota,
      totalAtMaturity: total,
      grantDate,
      maturityDate,
    }),
    [fullName, curpNorm, phoneDigits, address, gender, amount, termYears, cuota, total, grantDate, maturityDate],
  );

  const summary = useMemo(() => buildContractSummary(contractData), [contractData]);

  // STEP 4
  const [folio, setFolio] = useState<string | null>(null);
  const [sha256, setSha256] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  // PDF state (sig placeholder)
  const [isGenerating, setIsGenerating] = useState(false);

  const step1Ok =
    fullName.trim().length >= 3 &&
    curpOk &&
    phoneOk &&
    addressLinesOk &&
    Number.isFinite(Number(String(monthlyIncome).replace(/[^0-9]/g, "")));

  async function confirmAndGenerate() {
    if (!step1Ok || !step2Ok) return;
    if (!acceptClauses) return;

    setIsGenerating(true);
    try {
      const newFolio = randomFolio();
      const generatedAt = new Date().toISOString();

      const payload = {
        folio: newFolio,
        generatedAt,
        client: {
          fullName: fullName.trim(),
          curp: curpNorm,
          phone: phoneDigits,
          address: address.trim(),
          gender,
        },
        financing: {
          amount,
          termYears,
          cuota,
          total,
          grantDate,
          maturityDate,
          annualRatePercent: INSTITUTION.annualRatePercent,
        },
        clausesAccepted: acceptClauses,
        signature: {
          type: "canvas",
          confirmed: true,
        },
      };

      const digest = await sha256CanonicalBrowser(payload);

      const qrPayload = `${newFolio}|sha256=${digest}`;
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/validar/${encodeURIComponent(newFolio)}`;

      setFolio(newFolio);
      setSha256(digest);
      setQrUrl(verificationUrl);
      setSignatureConfirmed(true);
    } finally {
      setIsGenerating(false);
    }
  }

  async function downloadPdf() {
    if (!folio || !sha256 || !signatureConfirmed) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const header = { folio, generatedAt: new Date().toISOString().slice(0, 10), sha256 };

    // Page 1: Datos
    addHeaderToPdf(doc, header);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Datos del cliente y simulación", 14, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines: Array<[string, string]> = [
      ["Cliente", summary.cliente],
      ["CURP", summary.curp],
      ["Teléfono", summary.telefono],
      ["Domicilio", summary.domicilio],
      ["Género", gender],
      ["Monto solicitado", summary.monto],
      ["Plazo", summary.plazo],
      ["Tasa", summary.tasa],
      ["Cuota mensual (aprox.)", summary.cuotaMensual],
      ["Monto final (estimado)", summary.montoFinal],
      ["Otorgamiento", cdmxDateLabel(grantDate)],
      ["Vencimiento", cdmxDateLabel(maturityDate)],
    ];

    let y = 52;
    for (const [k, v] of lines) {
      doc.text(`${k}: ${v}`, 14, y);
      y += 6;
      if (y > 270) break;
    }

    doc.addPage();

    // Page 2: Cláusulas (resumen)
    addHeaderToPdf(doc, header);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Cláusulas legales (resumen)", 14, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const clauseTexts = [
      CONTRACT_CLAUSES.declaraciones,
      CONTRACT_CLAUSES.primera,
      CONTRACT_CLAUSES.segunda,
      CONTRACT_CLAUSES.cuarta,
      CONTRACT_CLAUSES.septima,
      CONTRACT_CLAUSES.octava,
      CONTRACT_CLAUSES.novena,
      CONTRACT_CLAUSES.decima,
      CONTRACT_CLAUSES.final,
    ];

    let yy = 48;
    for (const c of clauseTexts) {
      const split = doc.splitTextToSize(c, 180);
      for (const s of split) {
        doc.text(String(s), 14, yy);
        yy += 5;
        if (yy > 270) break;
      }
      yy += 8;
      if (yy > 270) break;
    }

    doc.addPage();

    // Page 3: Firma + Evidencia
    addHeaderToPdf(doc, header);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Firma y evidencia", 14, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Confirmación de firma: ${signatureConfirmed ? "Sí" : "No"}`, 14, 60);
    doc.text("Evidencia técnica: folio + huella SHA-256 canónica (generada en navegador).", 14, 72);
    doc.text("QR de verificación (contenido institucional):", 14, 88);

    const qrPayload = `${folio}|sha256=${sha256}`;
    await addQrToPdf(doc, qrPayload, 150, 72, 18);

    doc.text(`Verificar en: ${qrUrl ?? "—"}`, 14, 110);

    doc.text("Página 3 de 3 | Impulso Go, S.A. de C.V., SOFOM, E.N.R.", 14, 285);

    doc.save(`ImpulsoGo-${folio}.pdf`);
  }

  return (
    <AdminShell user={user || "Operador"}>
      <div className="space-y-6">
        <ToolHeader
          eyebrow="Firma digital"
          title="Wizard de Firma Digital (4 pasos)"
          description="Captura datos, simula financiamiento, presenta vista previa, genera folio y huella SHA-256 y descarga PDF institucional."
        />

        {/* Stepper */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { n: 1, title: "Datos del cliente" },
            { n: 2, title: "Datos del financiamiento" },
            { n: 3, title: "Vista previa del contrato" },
            { n: 4, title: "Firma y descarga" },
          ].map((s) => {
            const isActive = step === s.n;
            const isDone = step > s.n;
            return (
              <div
                key={s.n}
                className={`rounded-lg border p-4 ${
                  isActive
                    ? "border-[var(--color-action)] bg-white"
                    : isDone
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-black text-[var(--color-institutional)]">Paso {s.n}</div>
                  {isDone ? <span className="text-xs font-black text-emerald-700">OK</span> : null}
                </div>
                <div className="mt-2 text-xs text-[var(--color-muted)]">{s.title}</div>
              </div>
            );
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-lg p-5">
              <h2 className="text-lg font-black text-[var(--color-institutional)]">Paso 1: Datos del cliente</h2>

              <div className="mt-4 grid gap-4">
                <div>
                  <Input
                    label="Nombre completo *"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Input
                    label="CURP * (18 caracteres)"
                    name="curp"
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                  />
                  {!curpOk && curp.length > 0 ? (
                    <p className="text-sm text-[var(--color-danger)]">CURP inválida.</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <p className="text-sm font-bold">Sexo *</p>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <input type="radio" name="gender" checked={gender === "Masculino"} onChange={() => setGender("Masculino")} />
                      <span className="text-sm font-semibold">Masculino</span>
                    </label>
                    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <input type="radio" name="gender" checked={gender === "Femenino"} onChange={() => setGender("Femenino")} />
                      <span className="text-sm font-semibold">Femenino</span>
                    </label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Input
                    label="Teléfono *"
                    name="phone"
                    value={formatPhone10(phoneRaw)}
                    onChange={(e) => setPhoneRaw(e.target.value)}
                  />
                  {!phoneOk && phoneDigits.length > 0 ? (
                    <p className="text-sm text-[var(--color-danger)]">Ingresa 10 dígitos.</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <Input
                    label="Ingresos mensuales *"
                    name="monthlyIncome"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="$10,000"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold">
                    Domicilio * <span className="text-[var(--color-danger)]">(3 líneas mínimo)</span>
                  </label>
                  <textarea
                    className="min-h-[110px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-action)]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, colonia\nDelegación/municipio\nEstado\nCP"
                  />
                  {!addressLinesOk && address.trim().length > 0 ? (
                    <p className="text-sm text-[var(--color-danger)]">Escribe al menos 3 líneas.</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Button type="button" onClick={() => setStep(2)} disabled={!step1Ok}>
                  Siguiente
                </Button>
              </div>
            </Card>

            <Card className="rounded-lg p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Validación</h3>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                <div className={`flex items-center justify-between gap-3 ${fullName.trim().length >= 3 ? "text-emerald-700" : ""}`}>
                  <span>Nombre</span>
                  <span className="font-bold">{fullName.trim().length >= 3 ? "OK" : "Requerido"}</span>
                </div>
                <div className={`flex items-center justify-between gap-3 ${curpOk ? "text-emerald-700" : ""}`}>
                  <span>CURP</span>
                  <span className="font-bold">{curpOk ? "OK" : "Inválida"}</span>
                </div>
                <div className={`flex items-center justify-between gap-3 ${phoneOk ? "text-emerald-700" : ""}`}>
                  <span>Teléfono</span>
                  <span className="font-bold">{phoneOk ? "OK" : "10 dígitos"}</span>
                </div>
                <div className={`flex items-center justify-between gap-3 ${addressLinesOk ? "text-emerald-700" : ""}`}>
                  <span>Domicilio</span>
                  <span className="font-bold">{addressLinesOk ? "OK" : "3+ líneas"}</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="font-bold text-[var(--color-institutional)]">Tú controlas el proceso</p>
                <p className="mt-2 text-[var(--color-muted)]">
                  Los datos se validan en el navegador. La huella SHA-256 se genera al confirmar en el paso 4.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-lg p-5">
              <h2 className="text-lg font-black text-[var(--color-institutional)]">Paso 2: Datos del financiamiento</h2>

              <div className="mt-4 grid gap-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold">Monto solicitado *</p>
                    <span className="text-sm font-black text-[var(--color-institutional)]">{formatMXN(amount)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={250000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(clamp(Number(e.target.value), 10000, 250000))}
                    className="mt-3 w-full accent-[var(--color-action)]"
                  />
                  {amountErr ? <p className="mt-2 text-sm text-[var(--color-danger)]">{amountErr}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[10000, 25000, 50000, 100000, 150000, 200000, 250000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={`rounded-lg border px-3 py-1 text-xs font-bold ${amount === v ? "border-[var(--color-action)] bg-[var(--color-surface-alt)] text-[var(--color-action)]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                        onClick={() => setAmount(v)}
                      >
                        {formatMXN(v)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold">Plazo *</label>
                  <select
                    value={termYears}
                    onChange={(e) => setTermYears(Number(e.target.value) as TermYears)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-action)]"
                  >
                    {[2, 4, 6, 8].map((t) => (
                      <option key={t} value={t}>
                        {t} años
                      </option>
                    ))}
                  </select>
                  {termErr ? <p className="text-sm text-[var(--color-danger)]">{termErr}</p> : null}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold">Tasa anual</label>
                  <div
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-[var(--color-action)]"
                    title="Tasa fija durante toda la vigencia"
                  >
                    {INSTITUTION.annualRatePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold">Fecha de otorgamiento</label>
                  <input
                    type="date"
                    value={grantDate}
                    onChange={(e) => setGrantDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-action)]"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold">Fecha estimada vencimiento</label>
                  <Input label="Vencimiento" name="maturity" value={cdmxDateLabel(maturityDate)} readOnly />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setStep(3)} disabled={!step2Ok}>
                  Siguiente
                </Button>
              </div>
            </Card>

            <Card className="rounded-lg p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Simulación</h3>
              <div className="mt-4 grid gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-[var(--color-muted)]">Cuota mensual (aprox.)</p>
                  <p className="mt-1 text-lg font-black text-[var(--color-institutional)]">{formatMXN(Math.round(calculateMonthlyPayment(amount, termYears).cuota))}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-[var(--color-muted)]">Monto final (estimado)</p>
                  <p className="mt-1 text-lg font-black text-[var(--color-institutional)]">{formatMXN(Math.round(calculateMonthlyPayment(amount, termYears).total))}</p>
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  Valores referenciales sujetos a evaluación crediticia y formalización contractual.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <Card className="rounded-lg p-5">
              <h2 className="text-lg font-black text-[var(--color-institutional)]">Paso 3: Vista previa del contrato</h2>

              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Contrato — Impulso Go</p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">Datos capturados para generar el expediente.</p>
                  </div>
                  <Image src={ASSETS.logo} alt="Impulso Go" width={60} height={60} />
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  {[
                    ["Cliente", summary.cliente],
                    ["CURP", summary.curp],
                    ["Teléfono", summary.telefono],
                    ["Domicilio", summary.domicilio],
                    ["Monto", summary.monto],
                    ["Plazo", summary.plazo],
                    ["Tasa", summary.tasa],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-3">
                      <span className="font-bold text-[var(--color-institutional)]">{k}</span>
                      <span className="text-right text-[var(--color-muted)]">{String(v)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-bold text-[var(--color-institutional)]">Cláusulas del contrato (resumen)</p>
                  <div className="mt-2 space-y-2 text-sm text-[var(--color-muted)]">
                    {[CONTRACT_CLAUSES.declaraciones, CONTRACT_CLAUSES.primera, CONTRACT_CLAUSES.cuarta, CONTRACT_CLAUSES.octava].map(
                      (t, idx) => (
                        <p key={idx}>
                          {String(t).slice(0, 180)}…
                        </p>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[var(--color-action)]"
                    checked={acceptClauses}
                    onChange={(e) => setAcceptClauses(e.target.checked)}
                  />
                  <span>
                    <p className="text-sm font-bold">He leído y acepto las cláusulas del contrato *</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">Requisito obligatorio para continuar con la firma.</p>
                  </span>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setStep(4)} disabled={!acceptClauses}>
                  Generar contrato
                </Button>
              </div>
            </Card>

            <Card className="rounded-lg p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Estado</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-[var(--color-muted)]">Paso</p>
                  <p className="mt-1 font-black text-[var(--color-institutional)]">{step}/4</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-[var(--color-muted)]">Aceptación</p>
                  <p className="mt-1 font-black text-[var(--color-institutional)]">{acceptClauses ? "Sí" : "No"}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <Card className="rounded-lg p-5">
              <h2 className="text-lg font-black text-[var(--color-institutional)]">Paso 4: Firma y descarga</h2>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Firma digital</p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 h-64 flex items-center justify-center">
                    <p className="text-sm text-[var(--color-muted)]">Canvas de firma (pendiente: integración de firma real). Confirmar para generar folio y PDF.</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="button" variant="secondary" onClick={() => setSignatureConfirmed(false)}>
                      Limpiar firma
                    </Button>
                    <Button type="button" onClick={confirmAndGenerate} disabled={isGenerating || !acceptClauses || !step1Ok || !step2Ok}>
                      {isGenerating ? "Generando..." : "Confirmar firma"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Evidencia</p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-[var(--color-muted)]">Folio</p>
                      <p className="mt-1 font-black text-[var(--color-institutional)]">{folio ?? "—"}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-[var(--color-muted)]">Fecha</p>
                      <p className="mt-1 font-black text-[var(--color-institutional)]">{new Date().toLocaleString("es-MX")}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-[var(--color-muted)]">Huella SHA-256</p>
                      <p className="mt-1 break-all font-mono text-xs text-[var(--color-muted)]">{sha256 ? `${sha256.slice(0, 22)}…` : "—"}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-[var(--color-muted)]">QR de verificación</p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{qrUrl ?? "placeholder"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="button" variant="secondary" onClick={() => setStep(3)}>
                      Volver
                    </Button>
                    <Button type="button" onClick={downloadPdf} disabled={!signatureConfirmed || !folio || !sha256}>
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-lg p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-action)]">Nota</h3>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                <p>El PDF se genera en el navegador con jsPDF usando una estructura manual de 3 páginas.</p>
                <p>El QR incluido contiene folio + SHA-256 (para verificación pública).</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

