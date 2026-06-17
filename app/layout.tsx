import type { Metadata } from 'next';

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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

