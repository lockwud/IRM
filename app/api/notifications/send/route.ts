import { NextResponse } from "next/server";
import { deviceTokens } from "@/lib/device-store";
import { sendPush } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  if (!process.env.NOTIFICATION_API_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.NOTIFICATION_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, body, url } = (await request.json()) as { title?: string; body?: string; url?: string };
  if (!title || !body) return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  const results = await Promise.allSettled([...deviceTokens].map((token) => sendPush(token, title, body, url)));
  return NextResponse.json({ sent: results.filter((result) => result.status === "fulfilled").length, total: results.length });
}
