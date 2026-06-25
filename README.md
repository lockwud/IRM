# AAMUSTED SIP Portal

A responsive Next.js 14 PWA foundation for AAMUSTED's Student Internship Programme. It includes a Venture-inspired coordinator dashboard, installable app manifest, offline shell caching, and Firebase Cloud Messaging (FCM) for web push notifications.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm run typecheck` and `npm run build` for verification.

## Portal access

Open the required portal directly. When signed out, the same URL displays only that role's login form; after authentication it displays that role's dashboard. Each signed session is restricted to one portal:

- Student `/student`: `student@aamusted.edu.gh` / `Student@123`
- Supervisor `/supervisor`: `STA-0182` / `Supervisor@123`
- Coordinator `/coordinator`: `coordinator@aamusted.edu.gh` / `Coordinator@123`

Students, supervisors and coordinators cannot open one another's protected routes. The development password-reset flow displays a reset link after account lookup; production should email that link through the configured mail provider. Set a strong `SESSION_SECRET` in `.env.local` before running the application.

## Enable Firebase Cloud Messaging

1. Create or select a Firebase project and add a Web app.
2. In Firebase Console, open **Project settings → Cloud Messaging** and create a Web Push certificate (VAPID key).
3. Copy `.env.example` to `.env.local` and add the Web app values, VAPID key, Firebase Admin service-account values, and a strong `NOTIFICATION_API_SECRET`.
4. Restart the development server, then select the bell in the header and allow browser notifications.

The browser registers its FCM device token through `POST /api/notifications/device`. An authenticated backend workflow can dispatch a push through `POST /api/notifications/send`:

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Authorization: Bearer $NOTIFICATION_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"Visit scheduled","body":"Your supervisor will visit on 2 July at 10:00 AM.","url":"/"}'
```

The current device store is intentionally an in-memory development adapter. Before deployment, persist tokens by user and device in PostgreSQL/Prisma, remove invalid tokens after FCM delivery failures, and call the sender from placement, lesson-note, visit, deadline, and completion workflows.
