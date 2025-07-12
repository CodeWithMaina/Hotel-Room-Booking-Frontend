import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

// Main Card container
export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "bg-[#03071E] rounded-xl border border-[#14213D]/60 px-6 py-5 text-white",
      className
    )}
  >
    {children}
  </div>
);

// Optional header row with spacing
export const CardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("mb-4 flex items-center justify-between", className)}>
    {children}
  </div>
);

// Elegant title
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <h4
    className={cn(
      "text-sm font-semibold tracking-wide uppercase text-[#FCA311]",
      className
    )}
  >
    {children}
  </h4>
);

// Content block with light text
export const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn("text-sm text-[#E5E5E5] leading-relaxed space-y-1", className)}
  >
    {children}
  </div>
);
