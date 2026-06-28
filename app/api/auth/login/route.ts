import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth-store";
import { createSession, roleHome, type PortalRole } from "@/lib/session";
import { apiBase } from "@/lib/api-client";

export async function POST(request: Request) {
  const { role, identifier, password } = await request.json() as { role?: PortalRole; identifier?: string; password?: string };
  if (!role || !identifier || !password || !["student", "supervisor", "coordinator"].includes(role)) return NextResponse.json({ error: "Complete all login fields." }, { status: 400 });

  // The frontend still keeps a signed Next.js cookie so middleware can route
  // users quickly, but the source of truth is now the Express API. We keep the
  // local development store only as a fallback for old seeded demo accounts.
  let user = authenticate(role, identifier.trim(), password);
  let accessToken = "";

  if (!user) {
    const apiResponse = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, identifier: identifier.trim(), password }),
      cache: "no-store",
    }).catch(() => null);
    const apiResult = apiResponse ? await apiResponse.json().catch(() => null) : null;
    if (!apiResponse?.ok || !apiResult?.user) return NextResponse.json({ error: "The login details are incorrect for the selected portal." }, { status: 401 });
    user = { role: apiResult.user.role, identifier: apiResult.user.identifier, name: apiResult.user.name, password: "" };
    accessToken = apiResult.accessToken || apiResult.token || "";
  }

  const session = await createSession({ role: user.role, identifier: user.identifier, name: user.name });
  const response = NextResponse.json({ redirectTo: roleHome[user.role], accessToken });
  response.cookies.set("sip_session", session, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 60 * 60 });
  return response;
}
