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
      <head>
        {/* Theme (no React context/provider): applies 'dark' class based on localStorage/system */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const key = "impulso_visual_theme";
    const stored = window.localStorage.getItem(key);
    const mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
    document.documentElement.classList.toggle("dark", resolved === "dark");
  } catch (e) {}
})()`,
          }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
