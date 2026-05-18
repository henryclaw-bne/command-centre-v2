"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((c) => !c)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onToggleSidebar={() => setMobileOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8 bg-white min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
