"use client";

import { ReactNode } from "react";

export default function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "success";
  children: ReactNode;
}) {
  const colors: Record<string, string> = {
    info: "border-blue-400 bg-blue-50",
    warning: "border-yellow-400 bg-yellow-50",
    success: "border-green-400 bg-green-50",
  };
  return (
    <div className={`not-prose my-4 rounded-md border p-4 ${colors[type] ?? colors.info}`}>
      {children}
    </div>
  );
}
