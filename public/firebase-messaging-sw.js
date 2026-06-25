/* Firebase Messaging service worker. Values are injected through the query
   string by the app so no private server credentials ever reach the browser. */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const params = new URL(self.location).searchParams;
// Increment this version whenever the offline shell changes so activate removes stale responses.
const CACHE = "aamusted-sip-v2";
const APP_SHELL = ["/manifest.webmanifest", "/icon.svg"];
const config = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
};

if (config.apiKey && !firebase.apps.length) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification || {};
    self.registration.showNotification(notification.title || "SIP Portal update", {
      body: notification.body || "You have a new notification.",
      icon: "/icon.svg",
      badge: "/icon.svg",
      data: { url: payload.data?.url || "/" },
      tag: payload.data?.type || "sip-update",
    });
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  // Next.js assets contain a build hash. Caching them across deployments can pair old HTML with a
  // missing CSS filename, so these immutable files are always handled directly by the browser/CDN.
  if (requestUrl.pathname.startsWith("/_next/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Never persist redirects, 404 pages or server errors as offline responses.
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => new URL(client.url).pathname === destination);
      return existing ? existing.focus() : clients.openWindow(destination);
    })
  );
});
