"use client";

import React from "react";

export default function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border text-center">
      <div className="text-xl font-semibold mb-2">Something went wrong</div>
      <div className="text-sm text-neutral-600 mb-4">{message ?? "An unexpected error occurred."}</div>
      {onRetry && (
        <div>
          <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-md">Retry</button>
        </div>
      )}
    </div>
  );
}
