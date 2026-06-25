import { NextResponse, type NextRequest } from "next/server";
import { roleHome, verifySession, type PortalRole } from "@/lib/session";

const protectedRoutes: Record<string, PortalRole> = { "/student": "student", "/supervisor": "supervisor", "/coordinator": "coordinator" };

export async function middleware(request: NextRequest) {
  const session = await verifySession(request.cookies.get("sip_session")?.value);
  const pathname = request.nextUrl.pathname;
  if (pathname === "/") return NextResponse.redirect(new URL(session ? roleHome[session.role] : "/login", request.url));
  if (pathname === "/login" && session) return NextResponse.redirect(new URL(roleHome[session.role], request.url));
  const entry = Object.entries(protectedRoutes).find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!entry) return NextResponse.next();
  // Preserve the requested URL while rendering only that portal's fixed login form.
  if (!session) return NextResponse.rewrite(new URL(`/login?role=${entry[1]}`, request.url));
  if (session.role !== entry[1]) return NextResponse.redirect(new URL(roleHome[session.role], request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/", "/login", "/student/:path*", "/supervisor/:path*", "/coordinator/:path*"] };
