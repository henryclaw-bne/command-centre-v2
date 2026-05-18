"use client";

import React from "react";

export default function PageHeader({ title, description, primary, secondary }: { title: string; description?: string; primary?: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-neutral-600 mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-2">{secondary}{primary}</div>
    </div>
  );
}
