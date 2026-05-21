export function validateAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.IMPULSO_ADMIN_USER ?? "impulso2518";
  const expectedPassword = process.env.IMPULSO_ADMIN_PASSWORD ?? "252627";

  const userMatch = username.trim() === expectedUser.trim();
  const passMatch = password.trim() === expectedPassword.trim();

  if (!userMatch || !passMatch) {
    return { ok: false, error: "Usuario o contraseña incorrectos." };
  }

  return { ok: true as const };
}
