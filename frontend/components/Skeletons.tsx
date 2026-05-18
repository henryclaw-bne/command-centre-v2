"use client";

import React from "react";

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm border p-4">
      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-neutral-200 rounded w-full" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm border p-4">
      <div className="h-6 bg-neutral-200 rounded w-full mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 rounded" />
        <div className="h-4 bg-neutral-200 rounded" />
        <div className="h-4 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}
