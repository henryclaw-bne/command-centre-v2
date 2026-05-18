"use client";

import React from "react";

export default function SlideOver({ open, onClose, children }: { open: boolean; onClose: () => void; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="ml-auto w-full max-w-md h-full bg-white shadow-xl overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="font-semibold">Details</div>
          <button onClick={onClose} className="text-neutral-600">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
