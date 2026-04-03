
import "./globals.css";
import AppShell from "./AppShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-snow-bg min-h-screen">
      <body suppressHydrationWarning className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
