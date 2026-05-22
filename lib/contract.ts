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
  declaraciones: `EL CLIENTE declara bajo protesta de decir verdad que la informacion proporcionada es veridica, completa y actualizada; que actua por voluntad propia; que cuenta con capacidad legal; que conoce el alcance financiero y legal del contrato; y que reconoce que la operacion se celebra mediante medios electronicos.

IMPULSO GO declara que es una Sociedad Financiera de Objeto Multiple, Entidad No Regulada, con registro verificable en SIPRES / CONDUSEF y domicilio en Ciudad de Mexico.`,
  primera: `EL CLIENTE se obliga a pagar a IMPULSO GO las cantidades que se deriven del presente financiamiento conforme al plazo, periodicidad, monto, tasa y demas condiciones establecidas en la solicitud y caratula del contrato.

En caso de incumplimiento en cualquier pago, IMPULSO GO podra cobrar intereses moratorios sobre el monto vencido y podra declarar el vencimiento anticipado del contrato, exigiendo el pago total del adeudo, intereses, comisiones, gastos y accesorios que correspondan.

Los pagos deberan realizarse en las fechas y por los medios que IMPULSO GO indique. Todo pago recibido se aplicara primero a intereses, posteriormente a comisiones, gastos y accesorios, y finalmente a capital.`,
  segunda: `Para todos los efectos legales derivados de este contrato, EL CLIENTE senala como su domicilio el indicado en la solicitud.

Asimismo, autoriza expresamente a IMPULSO GO a enviar cualquier aviso, comunicacion, notificacion, estado de cuenta, requerimiento o informacion relacionada con este contrato mediante llamadas telefonicas, SMS, WhatsApp, correo electronico y cualquier otro medio fisico o electronico registrado.

EL CLIENTE reconoce como validas y suficientes dichas comunicaciones, siempre que sean enviadas a los datos de contacto proporcionados por el.`,
  tercera: `EL CLIENTE autoriza expresamente a IMPULSO GO para consultar, solicitar, obtener, usar, compartir, procesar y considerar su informacion crediticia ante las Sociedades de Informacion Crediticia que estime necesarias, al inicio, durante la vigencia y al termino de este contrato.

En caso de incumplimiento, atraso o falta de pago, IMPULSO GO podra reportar dicho comportamiento a las Sociedades de Informacion Crediticia correspondientes, lo cual puede afectar su historial crediticio.`,
  cuarta: `EL CLIENTE reconoce y acepta que el financiamiento se calcula con una tasa anual fija del 7%, conforme al monto solicitado, plazo elegido y condiciones establecidas en la caratula del contrato.

Las comisiones, gastos administrativos, polizas, penalizaciones, gastos de cobranza, intereses moratorios y demas accesorios aplicables son conceptos independientes del monto aprobado y deberan informarse al CLIENTE de forma previa, clara y separada.

EL CLIENTE reconoce que dichos conceptos no forman parte del capital solicitado ni deberan sumarse o restarse del monto aprobado, salvo que exista una instruccion expresa y documentada por escrito.`,
  quinta: `EL CLIENTE autoriza a IMPULSO GO para verificar su identidad, informacion, documentos y referencias a traves de medios fisicos, electronicos y digitales, incluyendo plataformas internas, bases de datos, buros de credito, consultas publicas, instituciones financieras y proveedores de informacion.

EL CLIENTE acepta que la firma autografa, electronica, digital o cualquier otro mecanismo de aceptacion utilizado en este contrato, asi como mensajes de texto, WhatsApp, correos electronicos y llamadas telefonicas, tendran plena validez juridica y seran suficientes para acreditar su voluntad, instrucciones y consentimiento.

La informacion y evidencia generada a traves de medios electronicos, opticos, magneticos o de cualquier otra tecnologia sera admisible y tendra valor probatorio conforme a la legislacion aplicable.`,
  sexta: `EL CLIENTE se obliga a pagar a IMPULSO GO las comisiones, gastos administrativos, costos operativos, gastos de cobranza, intereses ordinarios, intereses moratorios y demas accesorios que se generen conforme al presente contrato.

Las comisiones, gastos administrativos o penalizaciones son conceptos independientes del monto aprobado del financiamiento y no deberan sumarse ni restarse del capital solicitado, salvo que asi se indique expresamente en la caratula del contrato.

En caso de atraso, incumplimiento o vencimiento del contrato, podran generarse intereses moratorios, gastos de cobranza y demas accesorios conforme a las condiciones pactadas.`,
  septima: `EL CLIENTE podra solicitar la cancelacion del presente contrato antes del desembolso del financiamiento.

En este caso, reconoce y acepta que, una vez firmado el contrato, debera cubrir una penalizacion equivalente al 10% del monto solicitado, por concepto de gastos administrativos, operativos, de analisis, validacion, gestion y recursos utilizados hasta ese momento.

La penalizacion por cancelacion es independiente del monto aprobado y no constituye pago de capital.`,
  octava: `EL CLIENTE declara bajo protesta de decir verdad que es la misma persona identificada en el presente contrato, en la CURP proporcionada, en la identificacion oficial adjunta y en la selfie incorporada al expediente.

EL CLIENTE reconoce que la firma electronica plasmada en este contrato, junto con su nombre, CURP, telefono, domicilio, INE por ambos lados, selfie, fecha, hora, folio, dispositivo, navegador, direccion IP cuando este disponible, hash del expediente y aceptaciones registradas, constituyen elementos suficientes de atribucion de identidad, voluntad y consentimiento.

EL CLIENTE renuncia a desconocer la firma, el proceso de aceptacion o la autenticidad del expediente cuando dichos elementos coincidan con la evidencia conservada por IMPULSO GO, salvo prueba plena en contrario.`,
  novena: `Las partes acuerdan que el presente contrato, sus anexos, archivos adjuntos, aceptaciones, evidencia tecnica, hash, folio y constancias digitales podran conservarse como mensaje de datos para consulta posterior.

El expediente electronico sera considerado integro cuando pueda vincularse razonablemente con el folio, fecha, hora, datos del cliente, archivos de identidad, firma y registros tecnicos generados durante el proceso.

Dicho expediente podra utilizarse como medio de prueba ante autoridades, tribunales, entidades administrativas, sociedades de informacion crediticia o cualquier instancia competente.`,
  decima: `EL CLIENTE manifiesta que ha leido integramente el presente contrato, comprendiendo su contenido, alcance y consecuencias legales y financieras, por lo que lo acepta de manera libre, voluntaria e informada, sin error, dolo, mala fe o vicio alguno del consentimiento.

Este contrato se rige e interpreta conforme a las leyes de los Estados Unidos Mexicanos. Para la solucion de cualquier controversia derivada del presente contrato, las partes se someten expresamente a la jurisdiccion de los tribunales competentes de la Ciudad de Mexico, renunciando a cualquier otro fuero que pudiera corresponderles por razon de domicilio presente o futuro.`,
  final: `DECLARACION FINAL DE ACEPTACION: EL CLIENTE reconoce que la firma del presente contrato refleja su voluntad de obligarse en los terminos aqui establecidos. Este documento, asi como sus anexos, constituye la totalidad del acuerdo entre las partes y sustituye cualquier acuerdo previo, ya sea verbal o escrito.`,
} as const;

export const CLAUSE_SECTIONS = [
  { title: "DECLARACIONES", body: CONTRACT_CLAUSES.declaraciones },
  { title: "PRIMERA. PAGOS", body: CONTRACT_CLAUSES.primera },
  { title: "SEGUNDA. DOMICILIOS Y MEDIOS DE CONTACTO", body: CONTRACT_CLAUSES.segunda },
  { title: "TERCERA. INFORMACION CREDITICIA", body: CONTRACT_CLAUSES.tercera },
  { title: "CUARTA. TASA, COSTOS Y CONDICIONES DEL FINANCIAMIENTO", body: CONTRACT_CLAUSES.cuarta },
  { title: "QUINTA. VERIFICACION Y VALIDACION DIGITAL", body: CONTRACT_CLAUSES.quinta },
  { title: "SEXTA. COMISIONES, GASTOS E INTERESES POR INCUMPLIMIENTO", body: CONTRACT_CLAUSES.sexta },
  { title: "SEPTIMA. CANCELACION DEL CONTRATO Y PENALIZACION", body: CONTRACT_CLAUSES.septima },
  { title: "OCTAVA. IDENTIDAD, FIRMA Y NO REPUDIO", body: CONTRACT_CLAUSES.octava },
  { title: "NOVENA. CONSERVACION, INTEGRIDAD Y EVIDENCIA ELECTRONICA", body: CONTRACT_CLAUSES.novena },
  { title: "DECIMA. ACEPTACION, LEGISLACION Y JURISDICCION", body: CONTRACT_CLAUSES.decima },
] as const;

export function buildContractSummary(data: ContractClientData) {
  return {
    empresa: INSTITUTION.legalName,
    cliente: data.fullName,
    curp: data.curp,
    telefono: data.phone,
    domicilio: data.address,
    monto: data.amount != null ? formatMXN(data.amount) : "-",
    plazo: data.termYears != null ? `${data.termYears} anos` : "-",
    tasa: `${INSTITUTION.annualRatePercent}% anual ordinaria fija`,
    cuotaMensual: data.monthlyPayment != null ? formatMXN(data.monthlyPayment) : "-",
    montoFinal: data.totalAtMaturity != null ? formatMXN(data.totalAtMaturity) : "-",
    representante: `${INSTITUTION.representative} - ${INSTITUTION.representativeTitle}`,
    jurisdiccion: INSTITUTION.jurisdiction,
    folio: data.folio ?? "Provisional",
  };
}
