// Replace this in-memory adapter with Prisma's notification_devices table in production.
const globalStore = globalThis as typeof globalThis & { sipDeviceTokens?: Set<string> };
export const deviceTokens = globalStore.sipDeviceTokens || new Set<string>();
if (process.env.NODE_ENV !== "production") globalStore.sipDeviceTokens = deviceTokens;
