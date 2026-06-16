"use client";

export type ThemeMode = "light" | "dark" | "system";

/**
 * Artefacto dejado de pruebas (no usado).
 * El theme real se maneja en app/layout.tsx (script) + localStorage + clase "dark" en <html>.
 */
export function useTheme() {
  throw new Error("useTheme is not used. Theme is controlled globally via layout.tsx + localStorage.");
}
