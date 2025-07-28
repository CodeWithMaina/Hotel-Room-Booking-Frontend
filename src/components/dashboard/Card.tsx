// // components/ui/Card.tsx
// import type { ReactNode, FC } from "react";
// import { cn } from "../../lib/utils";

// interface CardProps {
//   className?: string;
//   children: ReactNode;
// }

// export const Card: FC<CardProps> = ({ className, children }) => (
//   <div
//     className={cn(
//       "bg-white text-base-content border border-base-content/10 rounded-2xl px-6 py-5 shadow-sm transition hover:shadow-md",
//       className
//     )}
//   >
//     {children}
//   </div>
// );

// interface CardHeaderProps {
//   className?: string;
//   children: ReactNode;
// }

// export const CardHeader: FC<CardHeaderProps> = ({ className, children }) => (
//   <div className={cn("mb-4 flex items-center justify-between", className)}>
//     {children}
//   </div>
// );

// interface CardTitleProps {
//   className?: string;
//   children: ReactNode;
// }

// export const CardTitle: FC<CardTitleProps> = ({ className, children }) => (
//   <h4
//     className={cn(
//       "text-sm font-semibold tracking-wider uppercase text-primary",
//       className
//     )}
//   >
//     {children}
//   </h4>
// );

// interface CardContentProps {
//   className?: string;
//   children: ReactNode;
// }

// export const CardContent: FC<CardContentProps> = ({ className, children }) => (
//   <div
//     className={cn("text-sm text-muted leading-relaxed space-y-1", className)}
//   >
//     {children}
//   </div>
// );


// src/components/dashboard/Card.tsx
import { type LucideIcon, AlertCircle, DollarSign, XCircle } from 'lucide-react';

type Props = {
  title: string;
  value: string | number;
  badge: string;
  badgeColor: string;
  icon: 'dollar-sign' | 'x-circle' | 'alert-circle';
  iconColor: string;
};

const icons: Record<string, LucideIcon> = {
  'dollar-sign': DollarSign,
  'x-circle': XCircle,
  'alert-circle': AlertCircle,
};

export const Card = ({ title, value, badge, badgeColor, icon, iconColor }: Props) => {
  const Icon = icons[icon];

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h4>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${badgeColor}`} />
            {badge}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
