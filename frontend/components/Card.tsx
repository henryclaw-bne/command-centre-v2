"use client";

import React from "react";

export default function Card({ title, children, footer }: { title?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {title && <div className="px-4 py-3 border-b text-sm font-medium">{title}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 border-t">{footer}</div>}
    </div>
  );
}
