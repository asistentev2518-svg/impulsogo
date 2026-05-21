export function sanitizeText(value: string, maxLength = 500) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function maskName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "***";
  if (parts.length === 1) {
    const name = parts[0];
    return `${name.slice(0, 2)}***`;
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first.slice(0, 1)}*** ${last.slice(0, 1)}***${last.slice(-1)}`;
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `******${digits.slice(-4)}`;
}
