import { ConfiguracionTool } from "@/components/admin/ConfiguracionTool";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-institutional)]">Configuración</h1>
      <ConfiguracionTool />
    </div>
  );
}
