import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/admin/ToolHeader";
import { listExpedientes } from "@/lib/expediente";

export default async function ExpedientesPage() {
  const records = await listExpedientes();

  return (
    <div className="space-y-6">
      <ToolHeader
        eyebrow="Validación documental"
        title="Expedientes generados"
        description="Consulta folios, hashes y estados públicos sin exponer INE, selfie, teléfono completo ni domicilio."
      />
      <Card className="overflow-hidden p-0">
        {records.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-[var(--color-muted)]">No hay expedientes guardados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Fecha CDMX</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Verificar</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.folio} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-bold text-[var(--color-institutional)]">{record.folio}</td>
                    <td className="px-4 py-3">{record.clientNameMasked}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{record.createdAtCdmx}</td>
                    <td className="px-4 py-3">
                      <Badge tone={record.status === "valido" ? "success" : "danger"}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/validar/${record.folio}`}
                        className="font-bold text-[var(--color-action)] hover:underline"
                      >
                        Página pública
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
