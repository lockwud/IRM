import { NextResponse } from "next/server";
import { createResetToken } from "@/lib/auth-store";

export async function POST(request: Request) {
  const { identifier } = await request.json() as { identifier?: string };
  if (!identifier) return NextResponse.json({ error: "Enter your email or staff ID." }, { status: 400 });
  const token = createResetToken(identifier.trim());
  // Always return success to prevent account enumeration. Development exposes the link because email is not configured.
  return NextResponse.json({ message: "If the account exists, password-reset instructions have been prepared.", resetUrl: token && process.env.NODE_ENV !== "production" ? `/reset-password?token=${token}` : undefined });
}
