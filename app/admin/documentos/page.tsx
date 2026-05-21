import { DocumentosTool } from "@/components/admin/DocumentosTool";
import { ToolHeader } from "@/components/admin/ToolHeader";

export default function DocumentosPage() {
  return (
    <div className="space-y-5">
      <ToolHeader
        eyebrow="Herramienta interna"
        title="Documentos para WhatsApp"
        description="Captura una sola vez los datos del cliente y genera aprobaciones, cancelaciones, pólizas y avisos en formato vertical 1080 x 1350."
      />
      <DocumentosTool />
    </div>
  );
}
