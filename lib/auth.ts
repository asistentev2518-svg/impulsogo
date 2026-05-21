export function validateAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.IMPULSO_ADMIN_USER;
  const expectedPassword = process.env.IMPULSO_ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return { ok: false, error: "Credenciales de administrador no configuradas." };
  }

  const userMatch = username === expectedUser;
  const passMatch = password === expectedPassword;

  if (!userMatch || !passMatch) {
    return { ok: false, error: "Usuario o contraseña incorrectos." };
  }

  return { ok: true as const };
}
