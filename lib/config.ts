export const INSTITUTION = {
  legalName: "Impulso Go, S.A. de C.V., SOFOM, E.N.R.",
  shortName: "Impulso Go",
  address:
    "Fresas 12, interior 10, Col. Tlacoquemécatl, C.P. 03200, Benito Juárez, Ciudad de México.",
  representative: "Perla Gutierrez",
  representativeTitle: "Apoderado Legal - Impulso Go, SOFOM E.N.R.",
  jurisdiction: "Ciudad de México",
  institutionalQrUrl: "https://impulso-go.lovable.app/",
  annualRatePercent: 7,
  penaltyPercent: 10,
  allowedTermsYears: [2, 4, 6, 8] as const,
  minAmount: 10000,
  amountIncrement: 5000,
} as const;

export const BRAND = {
  tagline: "Financiamiento formal, contrato firmado y expediente trazable.",
  subtagline:
    "Proceso documentado de extremo a extremo: validación de identidad, contrato electrónico con cláusulas completas, folio, hash y QR de verificación.",
  whatsappPhone: "525547823544",
  whatsappDisplay: "55 4782 3544",
  whatsappUrl: "https://api.whatsapp.com/send?phone=525547823544",
  sipresUrl: "https://webapps.condusef.gob.mx/SIPRES/jsp/home_publico.jsp?idins=16103",
  condusefUrl: "https://webapps.condusef.gob.mx/SIPRES/jsp/home_publico.jsp?idins=16103",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Fresas+12+Tlacoquemécatl+Benito+Juárez+Ciudad+de+México",
} as const;

export const ASSETS = {
  logo: "/assets/impulso-go/logo.png",
  condusef: "/assets/impulso-go/condusef.jpg",
  sipres: "/assets/impulso-go/sipres.png",
  confianza: "/assets/impulso-go/confianza.png",
  ubicacion: "/assets/impulso-go/ubicacion.png",
  hero1: "/assets/impulso-go/hero-1.jpeg",
  hero2: "/assets/impulso-go/hero-2.jpeg",
  hero3: "/assets/impulso-go/hero-3.jpeg",
  badge10: "/assets/impulso-go/badge-10.png",
  badge15: "/assets/impulso-go/badge-15.png",
} as const;

export const IDENTITY_CONSENT =
  "Consiento el tratamiento de mi identificación oficial e imagen facial para validación de identidad, prevención de fraude y conservación del expediente, conforme al aviso de privacidad.";

export const CONTRACT_CHECKBOXES = [
  "He leido integramente el contrato y acepto sus terminos.",
  "Reconozco que los datos proporcionados son verdaderos, completos y actualizados.",
  "Autorizo la validacion de mi identidad, INE, selfie, CURP, telefono y datos financieros.",
  "Reconozco que la firma electronica, evidencia tecnica, INE, selfie, fecha, hora, folio, dispositivo y hash forman parte integral del expediente.",
  "Declaro bajo protesta de decir verdad que soy la misma persona identificada en este contrato, en la INE adjunta y en la selfie proporcionada.",
  "Confirmo que mi firma representa mi voluntad libre, expresa e informada de obligarme conforme al contrato.",
  "Acepto que el contrato y sus anexos se conserven como mensaje de datos y puedan utilizarse como medio de prueba.",
] as const;
