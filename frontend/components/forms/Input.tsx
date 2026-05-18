"use client";

import React from "react";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full border rounded-md px-3 py-2 text-sm" {...props} />;
}
