import type { PortalRole } from "@/lib/session";

// Development-only in-memory auth store.
// It supports login, forgot/reset-password and in-portal password change while
// the project is still running without a production database.
type PortalUser = { role: PortalRole; identifier: string; password: string; name: string };
type AuthState = { users: PortalUser[]; resetTokens: Map<string, { identifier: string; expires: number }> };

const globalAuth = globalThis as typeof globalThis & { sipAuthState?: AuthState };
const state: AuthState = globalAuth.sipAuthState || {
  users: [
    { role: "student", identifier: "student@aamusted.edu.gh", password: "Student@123", name: "Kwame Mensah" },
    { role: "supervisor", identifier: "STA-0182", password: "Supervisor@123", name: "Dr. Samuel Ofori" },
    { role: "coordinator", identifier: "coordinator@aamusted.edu.gh", password: "Coordinator@123", name: "Emmanuel Owusu" },
  ],
  resetTokens: new Map(),
};
globalAuth.sipAuthState = state;

/** Development authentication adapter; replace with PostgreSQL and Argon2/bcrypt before launch. */
export function authenticate(role: PortalRole, identifier: string, password: string) {
  return state.users.find((user) => user.role === role && user.identifier.toLowerCase() === identifier.toLowerCase() && user.password === password) || null;
}

export function createResetToken(identifier: string) {
  const user = state.users.find((entry) => entry.identifier.toLowerCase() === identifier.toLowerCase());
  if (!user) return null;
  const token = crypto.randomUUID();
  state.resetTokens.set(token, { identifier: user.identifier, expires: Date.now() + 30 * 60 * 1000 });
  return token;
}

export function resetPassword(token: string, password: string) {
  const request = state.resetTokens.get(token);
  if (!request || request.expires < Date.now()) return false;
  const user = state.users.find((entry) => entry.identifier === request.identifier);
  if (!user) return false;
  user.password = password;
  state.resetTokens.delete(token);
  return true;
}

export function changePassword(role: PortalRole, identifier: string, currentPassword: string, nextPassword: string) {
  const user = authenticate(role, identifier, currentPassword);
  if (!user) return false;
  user.password = nextPassword;
  return true;
}
