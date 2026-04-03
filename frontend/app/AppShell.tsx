"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen flex bg-snow-bg text-snow-text">
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
          sidebarOpen ? "w-[250px]" : "w-16"
        }`}
      >
        <Sidebar collapsed={!sidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 min-h-0 bg-snow-bg p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
