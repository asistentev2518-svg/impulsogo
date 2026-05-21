export function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  let browser = "Desconocido";
  let device = "Escritorio";

  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/")) browser = "Safari";

  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    device = "Móvil";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    device = "Tablet";
  }

  return { browser, device, userAgent };
}

export function getClientDeviceFromHeaders(userAgent: string | null) {
  return parseUserAgent(userAgent ?? "unknown");
}
