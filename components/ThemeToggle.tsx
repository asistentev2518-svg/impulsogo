"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type ThemeMode = "light" | "dark" | "system";

const LS_KEY = "impulso_visual_theme";

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  }
  return mode;
}

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(LS_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // ignore
  }
  return "system";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, mode);
    } catch {
      // ignore
    }
    const resolved = resolveMode(mode);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [mode]);

  const label = mode === "dark" ? "Tema oscuro" : mode === "light" ? "Tema claro" : "Tema del sistema";

  const toggle = () => {
    // Cicla: system -> light -> dark -> light ... (sin perder preferencias del usuario)
    setMode((prev) => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "light";
    });
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className="flex items-center gap-2"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <span className="text-xs font-bold">{mode === "dark" ? "Dark" : mode === "light" ? "Light" : "Auto"}</span>
    </Button>
  );
}
