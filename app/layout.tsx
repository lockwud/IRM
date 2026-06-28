import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAMUSTED SIP Portal",
  description: "Student Internship Programme Management System",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SIP Portal",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/ustedlogo.jpeg",
  },
};

export const viewport: Viewport = { themeColor: "#4f46e5", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
