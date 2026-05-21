import { ContratoManualTool } from "@/components/admin/ContratoManualTool";

export default function ContratoManualPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-institutional)]">Contrato manual</h1>
      <ContratoManualTool />
    </div>
  );
}
