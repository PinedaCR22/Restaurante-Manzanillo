import React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants = {
    primary:
      "bg-[#0D784A] hover:bg-[#0B6A41] text-white focus:ring-green-700",
    secondary:
      "border border-[#0D784A] text-[#0D784A] hover:bg-[#E6F4EE] focus:ring-green-700",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-600",
    ghost:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}


