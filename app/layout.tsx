import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { INSTITUTION } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
