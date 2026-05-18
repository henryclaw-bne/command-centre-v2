"use client";

import React from "react";

export default function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-600">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">📄</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm mb-3">{description}</p>}
      {action}
    </div>
  );
}
