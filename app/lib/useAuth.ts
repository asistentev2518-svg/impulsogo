'use client';

import { useCallback, useEffect, useState } from 'react';

type StoredAuth = {
  token: string;
  username: string;
  timestamp: number;
};

const LS_KEY = 'impulso_auth';
const EXPIRATION_MS = 24 * 60 * 60 * 1000;

export function login(username: string, password: string) {
  if (username !== 'impulso2518' || password !== '252627') {
    throw new Error('Credenciales incorrectas');
  }

  const timestamp = Date.now();
  const payload: StoredAuth = {
    token: `fake-jwt-${timestamp}`,
    username,
    timestamp,
  };

  window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
}

export function logout() {
  window.localStorage.removeItem(LS_KEY);
  window.location.reload();
}

export function checkAuth(): { isAuthenticated: boolean; user?: StoredAuth } {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return { isAuthenticated: false };

    const parsed = JSON.parse(raw) as StoredAuth;
    const expired = typeof parsed?.timestamp !== 'number' || Date.now() - parsed.timestamp > EXPIRATION_MS;

    if (expired) return { isAuthenticated: false };
    if (!parsed?.username || !parsed?.token) return { isAuthenticated: false };

    return { isAuthenticated: true, user: parsed };
  } catch {
    return { isAuthenticated: false };
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredAuth | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const res = checkAuth();
      setIsAuthenticated(res.isAuthenticated);
      setUser(res.user);
      setLoading(false);
    };

    run();
  }, []);

  const doLogin = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      login(username, password);
      const res = checkAuth();
      setIsAuthenticated(res.isAuthenticated);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    login: doLogin,
    logout,
    loading,
  };
}
