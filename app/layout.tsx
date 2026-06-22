import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Impulso Go | Créditos Simples, Confianza Real',
  description:
    'Impulso Go, S.A. de C.V., SOFOM, E.N.R. Financiamiento accesible de $10,000 a $250,000 con tasa fija de 7.00% anual y transparencia total.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${geist.variable} bg-bg text-text`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

