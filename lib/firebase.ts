import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage, type MessagePayload } from "firebase/messaging";
import { registerNotificationDevice } from "@/lib/api-client";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const firebaseIsConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function serviceWorkerUrl() {
  const query = new URLSearchParams(firebaseConfig).toString();
  return `/firebase-messaging-sw.js?${query}`;
}

export async function registerPwaServiceWorker() {
  if (!("serviceWorker" in navigator)) return undefined;
  return navigator.serviceWorker.register(serviceWorkerUrl());
}

/**
 * Development builds generate new hashed CSS/JavaScript filenames frequently. An older service
 * worker can keep HTML that points at files removed by the next build, leaving the page unstyled.
 * Local development therefore removes registrations and PWA caches; production keeps full PWA use.
 */
export async function clearDevelopmentServiceWorkers() {
  if (process.env.NODE_ENV === "production" || !("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("aamusted-sip-")).map((key) => caches.delete(key)));
  }
}

export async function enablePushNotifications() {
  if (!firebaseIsConfigured) throw new Error("Firebase is not configured yet.");
  if (!(await isSupported())) throw new Error("Push notifications are not supported in this browser.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission was not granted.");

  const registration = await registerPwaServiceWorker();
  if (!registration) throw new Error("Service workers are not supported in this browser.");
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error("Firebase did not return a device token.");

  const registered = await registerNotificationDevice({ token, platform: "web" });
  if (!registered?.registered) throw new Error("Could not register this device.");
  return token;
}

export async function listenForForegroundMessages(callback: (message: MessagePayload) => void) {
  if (!firebaseIsConfigured || !(await isSupported())) return () => undefined;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return onMessage(getMessaging(app), callback);
}
