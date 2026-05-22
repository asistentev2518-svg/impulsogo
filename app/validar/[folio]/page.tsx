import { PublicShell } from "@/components/layout/PublicShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function ValidatePage({
  params,
}: {
  params: Promise<{ folio: string }>;
}) {
  const { folio } = await params;

  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <h1 className="text-2xl font-bold text-[var(--color-institutional)]">
            Folio temporal
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Por política operativa, Impulso Go no guarda expedientes, INE, selfie, firma ni contrato
            en una base de datos pública o en la nube desde este sitio.
          </p>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <Badge tone="success">Sin almacenamiento en servidor</Badge>
            <p className="mt-3 text-sm">
              Folio consultado: <strong>{folio}</strong>
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              La constancia válida para el usuario es el PDF generado al finalizar la firma, junto
              con su fecha, hora y huella SHA-256 mostrada en pantalla.
            </p>
          </div>
        </Card>
      </div>
    </PublicShell>
  );
}
