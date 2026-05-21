import { DocumentosTool } from "@/components/admin/DocumentosTool";

export default function DocumentosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-institutional)]">Documentos internos</h1>
      <DocumentosTool />
    </div>
  );
}
