import { DocumentosTool } from "@/components/admin/DocumentosTool";
import { ToolHeader } from "@/components/admin/ToolHeader";

export default function DocumentosPage() {
  return (
    <div className="space-y-5">
      <ToolHeader
        eyebrow="Herramienta interna"
        title="Dashboard de documentos"
        description="Captura una sola vez los datos del cliente y genera aprobación, cancelación, póliza y aviso de privacidad en formato vertical 1080 x 1350."
      />
      <DocumentosTool />
    </div>
  );
}
