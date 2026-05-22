const DEFAULT_ADMIN_USER = "impulso2518";
const DEFAULT_ADMIN_PASSWORD = "252627";

function cleanCredential(value?: string) {
  return (value ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

function credentialCandidates(envValues: Array<string | undefined>, fallback: string) {
  const values = [...envValues.map(cleanCredential), fallback].filter(Boolean);
  return Array.from(new Set(values));
}

export function validateAdminCredentials(username: string, password: string) {
  const submittedUser = cleanCredential(username).toLowerCase();
  const submittedPassword = cleanCredential(password);

  const allowedUsers = credentialCandidates(
    [process.env.IMPULSO_ADMIN_USER, process.env.ADMIN_USER],
    DEFAULT_ADMIN_USER,
  ).map((value) => value.toLowerCase());
  const allowedPasswords = credentialCandidates(
    [process.env.IMPULSO_ADMIN_PASSWORD, process.env.ADMIN_PASSWORD],
    DEFAULT_ADMIN_PASSWORD,
  );

  const userMatch = allowedUsers.includes(submittedUser);
  const passMatch = allowedPasswords.includes(submittedPassword);

  if (!userMatch || !passMatch) {
    return { ok: false, error: "Usuario o contraseña incorrectos." };
  }

  return { ok: true as const };
}
