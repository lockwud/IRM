import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function adminApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Firebase Admin is not configured.");
  return getApps()[0] || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export async function sendPush(token: string, title: string, body: string, url = "/") {
  return getMessaging(adminApp()).send({
    token,
    notification: { title, body },
    data: { url },
    webpush: { fcmOptions: { link: url }, notification: { icon: "/icon.svg" } },
  });
}
