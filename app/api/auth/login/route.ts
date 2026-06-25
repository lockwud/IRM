import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth-store";
import { createSession, roleHome, type PortalRole } from "@/lib/session";

export async function POST(request: Request) {
  const { role, identifier, password } = await request.json() as { role?: PortalRole; identifier?: string; password?: string };
  if (!role || !identifier || !password || !["student", "supervisor", "coordinator"].includes(role)) return NextResponse.json({ error: "Complete all login fields." }, { status: 400 });
  const user = authenticate(role, identifier.trim(), password);
  if (!user) return NextResponse.json({ error: "The login details are incorrect for the selected portal." }, { status: 401 });
  const session = await createSession({ role: user.role, identifier: user.identifier, name: user.name });
  const response = NextResponse.json({ redirectTo: roleHome[user.role] });
  response.cookies.set("sip_session", session, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 60 * 60 });
  return response;
}
