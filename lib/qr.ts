"use client";

import QRCode from "qrcode";

export async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 220,
    color: { dark: "#06245C", light: "#FFFFFF" },
  });
}

export function buildValidationUrl(folio: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  return `${base}/validar/${folio}`;
}
