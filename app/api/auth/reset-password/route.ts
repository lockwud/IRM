import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth-store";

export async function POST(request: Request) {
  const { token, password } = await request.json() as { token?: string; password?: string };
  if (!token || !password || password.length < 8) return NextResponse.json({ error: "Use a password containing at least eight characters." }, { status: 400 });
  if (!resetPassword(token, password)) return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  return NextResponse.json({ message: "Your password was changed successfully." });
}
