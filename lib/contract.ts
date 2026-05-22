import { INSTITUTION } from "./config";
import { formatMXN, type TermYears } from "./finance";

export type ContractGender = "Masculino" | "Femenino";

export interface ContractClientData {
  fullName: string;
  curp: string;
  phone: string;
  address: string;
  amount?: number;
  termYears?: TermYears;
  monthlyPayment?: number;
  totalAtMaturity?: number;
  gender?: ContractGender;
  monthlyIncome?: string;
  grantDate?: string;
  maturityDate?: string;
  bankAccount?: string;
  bankName?: string;
  folio?: string;
  signatureDate?: string;
}

export const CONTRACT_CLAUSES = {
  declaraciones: `EL CLIENTE declara bajo protesta de decir verdad que la información proporcionada es verídica, completa y actualizada; que actúa por voluntad propia; que cuenta con capacidad legal; que conoce el alcance financiero y legal del contrato; y que reconoce que la operación se celebra mediante medios electrónicos.

IMPULSO GO declara que es una Sociedad Financiera de Objeto Múltiple, Entidad No Regulada, con registro verificable en SIPRES / CONDUSEF y domicilio en Ciudad de México.`,
  primera: `EL CLIENTE se obliga a pagar a IMPULSO GO las cantidades que se deriven del presente financiamiento conforme al plazo, periodicidad, monto, tasa y demás condiciones establecidas en la solicitud y carátula del contrato.

En caso de incumplimiento en cualquier pago, IMPULSO GO podrá cobrar intereses moratorios sobre el monto vencido y podrá declarar el vencimiento anticipado del contrato, exigiendo el pago total del adeudo, intereses, comisiones, gastos y accesorios que correspondan.

Los pagos deberán realizarse en las fechas y por los medios que IMPULSO GO indique. Todo pago recibido se aplicará primero a intereses, posteriormente a comisiones, gastos y accesorios, y finalmente a capital.`,
  segunda: `Para todos los efectos legales derivados de este contrato, EL CLIENTE señala como su domicilio el indicado en la solicitud.

Asimismo, autoriza expresamente a IMPULSO GO a enviar cualquier aviso, comunicación, notificación, estado de cuenta, requerimiento o información relacionada con este contrato mediante llamadas telefónicas, SMS, WhatsApp, correo electrónico y cualquier otro medio físico o electrónico registrado.

EL CLIENTE reconoce como válidas y suficientes dichas comunicaciones, siempre que sean enviadas a los datos de contacto proporcionados por él.`,
  tercera: `EL CLIENTE autoriza expresamente a IMPULSO GO para consultar, solicitar, obtener, usar, compartir, procesar y considerar su información crediticia ante las Sociedades de Información Crediticia que estime necesarias, al inicio, durante la vigencia y al término de este contrato.

En caso de incumplimiento, atraso o falta de pago, IMPULSO GO podrá reportar dicho comportamiento a las Sociedades de Información Crediticia correspondientes, lo cual puede afectar su historial crediticio.`,
  cuarta: `EL CLIENTE reconoce y acepta que el financiamiento se calcula con una tasa anual fija del 7%, conforme al monto solicitado, plazo elegido y condiciones establecidas en la carátula del contrato.

Las comisiones, gastos administrativos, pólizas, penalizaciones, gastos de cobranza, intereses moratorios y demás accesorios aplicables son conceptos independientes del monto aprobado y deberán informarse al CLIENTE de forma previa, clara y separada.

EL CLIENTE reconoce que dichos conceptos no forman parte del capital solicitado ni deberán sumarse o restarse del monto aprobado, salvo que exista una instrucción expresa y documentada por escrito.`,
  quinta: `EL CLIENTE autoriza a IMPULSO GO para verificar su identidad, información, documentos y referencias a través de medios físicos, electrónicos y digitales, incluyendo plataformas internas, bases de datos, burós de crédito, consultas públicas, instituciones financieras y proveedores de información.

EL CLIENTE acepta que la firma autógrafa, electrónica, digital o cualquier otro mecanismo de aceptación utilizado en este contrato, así como mensajes de texto, WhatsApp, correos electrónicos y llamadas telefónicas, tendrán plena validez jurídica y serán suficientes para acreditar su voluntad, instrucciones y consentimiento.

La información y evidencia generada a través de medios electrónicos, ópticos, magnéticos o de cualquier otra tecnología será admisible y tendrá valor probatorio conforme a la legislación aplicable.`,
  sexta: `EL CLIENTE se obliga a pagar a IMPULSO GO las comisiones, gastos administrativos, costos operativos, gastos de cobranza, intereses ordinarios, intereses moratorios y demás accesorios que se generen conforme al presente contrato.

Las comisiones, gastos administrativos o penalizaciones son conceptos independientes del monto aprobado del financiamiento y no deberán sumarse ni restarse del capital solicitado, salvo que así se indique expresamente en la carátula del contrato.

En caso de atraso, incumplimiento o vencimiento del contrato, podrán generarse intereses moratorios, gastos de cobranza y demás accesorios conforme a las condiciones pactadas.`,
  septima: `EL CLIENTE podrá solicitar la cancelación del presente contrato antes del desembolso del financiamiento.

En este caso, reconoce y acepta que, una vez firmado el contrato, deberá cubrir una penalización equivalente al 10% del monto solicitado, por concepto de gastos administrativos, operativos, de análisis, validación, gestión y recursos utilizados hasta ese momento.

La penalización por cancelación es independiente del monto aprobado y no constituye pago de capital.`,
  octava: `EL CLIENTE declara bajo protesta de decir verdad que es la misma persona identificada en el presente contrato, en la CURP proporcionada, en la identificación oficial adjunta y en la selfie incorporada al expediente.

EL CLIENTE reconoce que la firma electrónica plasmada en este contrato, junto con su nombre, CURP, teléfono, domicilio, INE por ambos lados, selfie, fecha, hora, folio, dispositivo, navegador, dirección IP cuando esté disponible, huella técnica de generación y aceptaciones registradas, constituyen elementos suficientes de atribución de identidad, voluntad y consentimiento.

EL CLIENTE renuncia a desconocer la firma, el proceso de aceptación o la autenticidad del expediente cuando dichos elementos coincidan con la evidencia conservada por IMPULSO GO, salvo prueba plena en contrario.`,
  novena: `Las partes acuerdan que el presente contrato, sus anexos, archivos adjuntos, aceptaciones, evidencia técnica, huella técnica, folio y constancias digitales podrán conservarse como mensaje de datos para consulta posterior.

El expediente electrónico será considerado íntegro cuando pueda vincularse razonablemente con el folio, fecha, hora, datos del cliente, archivos de identidad, firma y registros técnicos generados durante el proceso.

Dicho expediente podrá utilizarse como medio de prueba ante autoridades, tribunales, entidades administrativas, sociedades de información crediticia o cualquier instancia competente.`,
  decima: `EL CLIENTE manifiesta que ha leído íntegramente el presente contrato, comprendiendo su contenido, alcance y consecuencias legales y financieras, por lo que lo acepta de manera libre, voluntaria e informada, sin error, dolo, mala fe o vicio alguno del consentimiento.

Este contrato se rige e interpreta conforme a las leyes de los Estados Unidos Mexicanos. Para la solución de cualquier controversia derivada del presente contrato, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de domicilio presente o futuro.`,
  final: `DECLARACIÓN FINAL DE ACEPTACIÓN: EL CLIENTE reconoce que la firma del presente contrato refleja su voluntad de obligarse en los términos aquí establecidos. Este documento, así como sus anexos, constituye la totalidad del acuerdo entre las partes y sustituye cualquier acuerdo previo, ya sea verbal o escrito.`,
} as const;

export const CLAUSE_SECTIONS = [
  { title: "DECLARACIONES", body: CONTRACT_CLAUSES.declaraciones },
  { title: "PRIMERA. PAGOS", body: CONTRACT_CLAUSES.primera },
  { title: "SEGUNDA. DOMICILIOS Y MEDIOS DE CONTACTO", body: CONTRACT_CLAUSES.segunda },
  { title: "TERCERA. INFORMACIÓN CREDITICIA", body: CONTRACT_CLAUSES.tercera },
  { title: "CUARTA. TASA, COSTOS Y CONDICIONES DEL FINANCIAMIENTO", body: CONTRACT_CLAUSES.cuarta },
  { title: "QUINTA. VERIFICACIÓN Y VALIDACIÓN DIGITAL", body: CONTRACT_CLAUSES.quinta },
  { title: "SEXTA. COMISIONES, GASTOS E INTERESES POR INCUMPLIMIENTO", body: CONTRACT_CLAUSES.sexta },
  { title: "SÉPTIMA. CANCELACIÓN DEL CONTRATO Y PENALIZACIÓN", body: CONTRACT_CLAUSES.septima },
  { title: "OCTAVA. IDENTIDAD, FIRMA Y NO REPUDIO", body: CONTRACT_CLAUSES.octava },
  { title: "NOVENA. CONSERVACIÓN, INTEGRIDAD Y EVIDENCIA ELECTRÓNICA", body: CONTRACT_CLAUSES.novena },
  { title: "DÉCIMA. ACEPTACIÓN, LEGISLACIÓN Y JURISDICCIÓN", body: CONTRACT_CLAUSES.decima },
] as const;

export function buildContractSummary(data: ContractClientData) {
  return {
    empresa: INSTITUTION.legalName,
    cliente: data.fullName,
    curp: data.curp,
    telefono: data.phone,
    domicilio: data.address,
    monto: data.amount != null ? formatMXN(data.amount) : "-",
    plazo: data.termYears != null ? `${data.termYears} años` : "-",
    tasa: `${INSTITUTION.annualRatePercent}% anual ordinaria fija`,
    cuotaMensual: data.monthlyPayment != null ? formatMXN(data.monthlyPayment) : "-",
    montoFinal: data.totalAtMaturity != null ? formatMXN(data.totalAtMaturity) : "-",
    representante: `${INSTITUTION.representative} - ${INSTITUTION.representativeTitle}`,
    jurisdiccion: INSTITUTION.jurisdiction,
    folio: data.folio ?? "Provisional",
  };
}
