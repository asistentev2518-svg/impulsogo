export function buildExpedienteHashPayload(input: {
  folio: string;
  fullName: string;
  curp: string;
  phone: string;
  address: string;
  amount: number;
  termYears: number;
  acceptances: Record<string, string>;
  device: { browser: string; device: string; userAgent: string };
  createdAtCdmx: string;
  createdAtUtc: string;
}) {
  return {
    folio: input.folio,
    cliente: input.fullName,
    curp: input.curp,
    telefono: input.phone,
    domicilio: input.address,
    monto: input.amount,
    plazoAnios: input.termYears,
    aceptaciones: input.acceptances,
    dispositivo: input.device,
    fechaCdmx: input.createdAtCdmx,
    fechaUtc: input.createdAtUtc,
    evidencia: {
      ineFrente: true,
      ineReverso: true,
      selfieIne: true,
      firmaDigital: true,
    },
  };
}
