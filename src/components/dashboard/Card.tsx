import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("bg-white rounded-xl shadow p-4", className)}>{children}</div>
);

export const CardHeader = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("mb-2 flex items-center justify-between", className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string; children: ReactNode }) => (
  <h4 className={cn("text-base font-semibold", className)}>{children}</h4>
);

export const CardContent = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("text-gray-700", className)}>{children}</div>
);
