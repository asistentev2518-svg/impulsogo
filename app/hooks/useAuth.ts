"use client";

import { useCallback, useEffect, useState } from "react";

type AuthState = {
  user: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
};

type StoredToken = {
  v: 1;
  sub: string; // username
  exp: number; // ms epoch
};

const LS_KEY = "impulso_visual_auth";

function now() {
  return Date.now();
}

function decodeToken(raw: string): StoredToken | null {
  try {
    const parsed = JSON.parse(raw) as StoredToken;
    if (!parsed || parsed.v !== 1) return null;
    if (!parsed.sub || typeof parsed.sub !== "string") return null;
    if (!parsed.exp || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function isTokenValid(token: StoredToken | null) {
  if (!token) return false;
  return token.exp >= now();
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(LS_KEY);
    const token = raw ? decodeToken(raw) : null;
    const valid = isTokenValid(token);

    // Evitamos actualizar estado con múltiples setState.
    // Computamos todo y hacemos un update en un microtask.
    queueMicrotask(() => {
      setUser(valid && token ? token.sub : null);
      setIsAuthenticated(valid);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (username: string) => {
    const clean = String(username ?? "").trim();
    if (!clean) return;

    const token: StoredToken = {
      v: 1,
      sub: clean,
      exp: now() + 8 * 60 * 60 * 1000, // 8h
    };

    window.localStorage.setItem(LS_KEY, JSON.stringify(token));
    setUser(clean);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    window.localStorage.removeItem(LS_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isAuthenticated, isLoading, login, logout };
}

