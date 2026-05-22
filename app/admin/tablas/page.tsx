import { TablasTool } from "@/components/admin/TablasTool";
import { ToolHeader } from "@/components/admin/ToolHeader";

export default function TablasPage() {
  return (
    <div className="space-y-5">
      <ToolHeader
        eyebrow="Simulación comercial"
        title="Tablas de montos"
        description="Calcula cuotas con tasa fija del 7% y exporta materiales premium para seguimiento comercial."
      />
      <TablasTool />
    </div>
  );
}
