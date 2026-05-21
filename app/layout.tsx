import type { Metadata } from "next";
import "./globals.css";
import { INSTITUTION } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: "Impulso Go",
    template: "%s | Impulso Go",
  },
  description: INSTITUTION.legalName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
