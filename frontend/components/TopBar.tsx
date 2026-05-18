"use client";

import React from "react";

export default function TopBar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 md:px-6">
      <button onClick={onToggleSidebar} className="mr-4 text-neutral-600 hover:text-neutral-900 md:hidden">
        ☰
      </button>
      <div className="flex-1 flex items-center gap-4">
        <div className="text-sm text-neutral-500">Breadcrumbs / Customers</div>
        <div className="flex-1">
          <div className="max-w-md w-full">
            <input placeholder="Search..." className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-gray-100">🔔</button>
        <div className="w-8 h-8 rounded-full bg-neutral-200" />
      </div>
    </header>
  );
}
