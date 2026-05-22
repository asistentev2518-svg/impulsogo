import type { Metadata } from "next";
import "./globals.css";
import { INSTITUTION } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: "Impulso Go",
    template: "%s | Impulso Go",
  },
  description: INSTITUTION.legalName,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/impulso-go/logo.png", type: "image/png", sizes: "44x44" },
    ],
  },
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
