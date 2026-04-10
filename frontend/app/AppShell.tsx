"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen flex bg-irm-bg text-irm-text">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
          sidebarOpen ? "w-[260px]" : "w-[64px]"
        }`}
      >
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 bg-irm-bg p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

