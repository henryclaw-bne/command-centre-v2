"use client";

import React from "react";

export default function Button({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; className?: string }) {
  return (
    <button {...rest} className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 ${className}`}>
      {children}
    </button>
  );
}
