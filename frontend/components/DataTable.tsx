"use client";

import React from "react";

export default function DataTable({
  title,
  header,
  children,
}: {
  title?: string;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
      {title && <div className="px-4 py-3 border-b text-sm font-medium">{title}</div>}
      <table className="w-full min-w-[600px] divide-y divide-gray-200">
        <thead className="bg-gray-50 text-left text-sm text-neutral-600">
          {header}
        </thead>
        <tbody className="bg-white text-sm text-neutral-700">{children}</tbody>
      </table>
    </div>
  );
}
