// components/dashboard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { ReactNode } from "react";

export type Metric = {
  title: string;
  value: string;
  icon: ReactNode;
};

export const MetricCard = ({ metric }: { metric: Metric }) => (
  <Card className="bg-[#14213D] border border-[#1F2A3D] rounded-2xl hover:border-[#FCA311] transition">
    <CardHeader className="flex items-center gap-4">
      {metric.icon}
      <CardTitle className="text-sm font-medium text-[#FCA311] uppercase tracking-wider">
        {metric.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-semibold text-white">{metric.value}</p>
    </CardContent>
  </Card>
);
