export const INSTITUTION = {
  legalName: "Impulso Go, S.A. de C.V., SOFOM, E.N.R.",
  shortName: "Impulso Go",
  address:
    "Fresas 12, interior 10, Col. Tlacoquemécatl, C.P. 03200, Benito Juárez, Ciudad de México.",
  representative: "Claudia Tellez Hernandez",
  representativeTitle: "Presidenta",
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
  whatsappUrl: "https://wa.me/525512345678",
  sipresUrl: "https://webapps.condusef.gob.mx/SIPRES/jsp/home_publico.jsp",
  condusefUrl: "https://www.gob.mx/condusef",
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
  "He leído y acepto los términos del presente contrato.",
  "Reconozco que los datos proporcionados son verdaderos y completos.",
  "Reconozco que la firma electrónica, INE, selfie y evidencia técnica forman parte integral del expediente.",
  "Confirmo que esta firma representa mi voluntad de obligarme conforme al contrato.",
] as const;
