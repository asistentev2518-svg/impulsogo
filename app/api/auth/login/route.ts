import { NextResponse } from "next/server";
import { validateAdminCredentials } from "@/lib/auth";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { checkRateLimit, clearAttempts, registerFailedAttempt } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.message }, { status: 429 });
  }

  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  const result = validateAdminCredentials(username, password);
  if (!result.ok) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  clearAttempts(ip);
  const token = await createSessionToken(username);
  const response = NextResponse.json({ ok: true, user: username });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
