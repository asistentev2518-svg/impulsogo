import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Impulso Go',
  description: 'Impulso Go - En construcción',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-bg text-text">
      <body>{children}</body>
    </html>
  );
}

