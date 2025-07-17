// components/dashboard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { ReactNode, FC } from "react";

export type Metric = {
  title: string;
  value: string;
  icon: ReactNode;
};

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: FC<MetricCardProps> = ({ metric }) => {
  return (
    <Card className="bg-base-100 border border-base-content/10 rounded-2xl shadow-sm hover:border-primary/60 transition-all">
      <CardHeader className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          {metric.icon}
        </div>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-primary">
          {metric.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold text-base-content">
          {metric.value}
        </p>
      </CardContent>
    </Card>
  );
};
