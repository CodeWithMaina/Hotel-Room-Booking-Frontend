import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", className, children, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white focus:ring-blue-500",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className, "px-6 py-3")}
      {...props}
    >
      {children}
    </button>
  );
};
