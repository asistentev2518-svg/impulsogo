import { ContratoManualTool } from "@/components/admin/ContratoManualTool";
import { ToolHeader } from "@/components/admin/ToolHeader";

export default function ContratoManualPage() {
  return (
    <div className="space-y-5">
      <ToolHeader
        eyebrow="Contrato imprimible"
        title="Generador de contrato manual"
        description="Produce tres páginas listas para PDF, impresión o descarga individual en PNG, con QR institucional y datos completos del financiamiento."
      />
      <ContratoManualTool />
    </div>
  );
}
