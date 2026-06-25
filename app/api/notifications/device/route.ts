import { NextResponse } from "next/server";
import { deviceTokens } from "@/lib/device-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string };
  if (!body.token || body.token.length < 20) {
    return NextResponse.json({ error: "A valid FCM token is required." }, { status: 400 });
  }
  deviceTokens.add(body.token);
  return NextResponse.json({ registered: true });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { token?: string };
  if (body.token) deviceTokens.delete(body.token);
  return NextResponse.json({ removed: true });
}
