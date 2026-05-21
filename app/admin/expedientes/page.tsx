import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listExpedientes } from "@/lib/expediente";

export default async function ExpedientesPage() {
  const records = await listExpedientes();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-institutional)]">Expedientes</h1>
      <Card>
        {records.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No hay expedientes guardados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[var(--color-muted)]">
                  <th className="py-2">Folio</th>
                  <th className="py-2">Cliente</th>
                  <th className="py-2">Fecha CDMX</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2">Verificar</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.folio} className="border-b border-slate-100">
                    <td className="py-3 font-medium">{record.folio}</td>
                    <td className="py-3">{record.clientNameMasked}</td>
                    <td className="py-3">{record.createdAtCdmx}</td>
                    <td className="py-3">
                      <Badge tone={record.status === "valido" ? "success" : "danger"}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/validar/${record.folio}`}
                        className="text-[var(--color-action)] hover:underline"
                      >
                        Público
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
