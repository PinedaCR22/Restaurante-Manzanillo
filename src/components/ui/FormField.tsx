import React from "react";
import { cn } from "../../lib/utils"; // o "../lib/utils" según tu ruta

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({ label, children, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

// 🎨 Clases reutilizables para inputs/selects/textarea
export const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none transition";

export const selectClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none transition";

export const textAreaClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none h-20 focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none transition";
