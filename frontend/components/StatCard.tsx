"use client";

import React from "react";

export default function StatCard({ title, metric, icon, delta }: { title: string; metric: React.ReactNode; icon?: React.ReactNode; delta?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 min-w-[160px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-neutral-500">{title}</div>
          <div className="text-2xl font-semibold mt-1">{metric}</div>
        </div>
        <div className="text-neutral-400">{icon}</div>
      </div>
      {delta && <div className="text-sm text-neutral-500 mt-2">{delta}</div>}
    </div>
  );
}
