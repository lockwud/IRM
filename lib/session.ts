export type PortalRole = "student" | "supervisor" | "coordinator";
export type SessionPayload = { role: PortalRole; identifier: string; name: string; exp: number };

// Lightweight signed session helpers.
// The cookie payload is HMAC-protected so middleware and API routes can trust
// the role without requiring a database lookup on every request.
const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signingKey() {
  const secret = process.env.SESSION_SECRET || "development-only-change-this-session-secret";
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Creates an eight-hour tamper-evident session that can be verified by Edge middleware. */
export async function createSession(payload: Omit<SessionPayload, "exp">) {
  const complete: SessionPayload = { ...payload, exp: Date.now() + 8 * 60 * 60 * 1000 };
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(complete)));
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), encoder.encode(body));
  return `${body}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

/** Verifies both the HMAC signature and expiry before trusting a role from the cookie. */
export async function verifySession(value?: string): Promise<SessionPayload | null> {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;
  const valid = await crypto.subtle.verify("HMAC", await signingKey(), base64UrlToBytes(signature), encoder.encode(body));
  if (!valid) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload;
    return payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}

export const roleHome: Record<PortalRole, string> = { student: "/student", supervisor: "/supervisor", coordinator: "/coordinator" };
