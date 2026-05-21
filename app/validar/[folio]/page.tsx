import { PublicShell } from "@/components/layout/PublicShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getExpediente } from "@/lib/expediente";

export default async function ValidatePage({
  params,
}: {
  params: Promise<{ folio: string }>;
}) {
  const { folio } = await params;
  const record = await getExpediente(folio);

  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <h1 className="text-2xl font-bold text-[var(--color-institutional)]">
            Verificación de documento
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Consulta pública de integridad documental por folio.
          </p>

          {!record ? (
            <div className="mt-6">
              <Badge tone="danger">No encontrado</Badge>
              <p className="mt-3 text-sm">
                No se localizó un expediente con el folio {folio}. Verifique el código QR o folio
                impreso en el documento.
              </p>
            </div>
          ) : (
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Folio</dt>
                <dd className="font-semibold">{record.folio}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Tipo</dt>
                <dd>{record.tipo === "contrato_digital" ? "Contrato digital" : "Contrato manual"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Fecha</dt>
                <dd>{record.createdAtCdmx}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Cliente</dt>
                <dd>{record.clientNameMasked}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Hash SHA-256</dt>
                <dd className="break-all text-xs">{record.hash}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Estado</dt>
                <dd>
                  <Badge tone={record.status === "valido" ? "success" : "danger"}>
                    {record.status}
                  </Badge>
                </dd>
              </div>
            </dl>
          )}

          <p className="mt-6 text-xs text-[var(--color-muted)]">
            Por seguridad, esta consulta no expone INE, selfie, teléfono completo ni domicilio.
          </p>
        </Card>
      </div>
    </PublicShell>
  );
}
