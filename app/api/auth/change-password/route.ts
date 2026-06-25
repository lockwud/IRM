import { NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/lib/auth-store";
import { verifySession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await verifySession(request.cookies.get("sip_session")?.value);
  if (!session) return NextResponse.json({ error: "Sign in again before changing your password." }, { status: 401 });

  const { currentPassword, newPassword } = await request.json() as { currentPassword?: string; newPassword?: string };
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Enter your current password and new password." }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "Use a new password containing at least eight characters." }, { status: 400 });
  if (currentPassword === newPassword) return NextResponse.json({ error: "Choose a new password that is different from your current password." }, { status: 400 });
  if (!changePassword(session.role, session.identifier, currentPassword, newPassword)) return NextResponse.json({ error: "Your current password is incorrect." }, { status: 400 });

  return NextResponse.json({ message: "Password changed successfully." });
}
