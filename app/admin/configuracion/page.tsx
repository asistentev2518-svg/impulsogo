import { ConfiguracionTool } from "@/components/admin/ConfiguracionTool";
import { ToolHeader } from "@/components/admin/ToolHeader";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-5">
      <ToolHeader
        eyebrow="Parámetros"
        title="Configuración institucional"
        description="Centraliza enlaces, teléfonos y notas legales no sensibles para mantener la plataforma coherente."
      />
      <ConfiguracionTool />
    </div>
  );
}
