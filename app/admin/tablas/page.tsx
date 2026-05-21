import { TablasTool } from "@/components/admin/TablasTool";

export default function TablasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-institutional)]">Tablas de montos</h1>
      <TablasTool />
    </div>
  );
}
