import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAMUSTED SIP Portal",
  description: "Student Internship Programme Management System",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#4f46e5" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
