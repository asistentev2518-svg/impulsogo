type AttemptState = {
  count: number;
  blockedUntil?: number;
};

const attempts = new Map<string, AttemptState>();
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const state = attempts.get(key) ?? { count: 0 };

  if (state.blockedUntil && state.blockedUntil > now) {
    const minutes = Math.ceil((state.blockedUntil - now) / 60000);
    return { allowed: false, message: `Demasiados intentos. Intente en ${minutes} min.` };
  }

  if (state.blockedUntil && state.blockedUntil <= now) {
    attempts.set(key, { count: 0 });
  }

  return { allowed: true };
}

export function registerFailedAttempt(key: string) {
  const state = attempts.get(key) ?? { count: 0 };
  const count = state.count + 1;
  if (count >= MAX_ATTEMPTS) {
    attempts.set(key, { count, blockedUntil: Date.now() + BLOCK_MS });
    return;
  }
  attempts.set(key, { count });
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
