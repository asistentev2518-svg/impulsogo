"use client";

export type ThemeMode = "light" | "dark" | "system";

/**
 * Artefacto dejado de pruebas (no usado).
 * El theme real se controla globalmente con:
 * - script inline en app/layout.tsx (lee localStorage/prefers-color-scheme)
 * - clase "dark" en <html>
 * - toggle en componentes/ThemeToggle.tsx (solo DOM + localStorage)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useThemeContext() {
  throw new Error("ThemeContext is not used. Theme is controlled via app/layout.tsx + ThemeToggle.");
}
