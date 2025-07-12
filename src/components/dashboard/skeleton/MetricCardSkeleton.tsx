// components/dashboard/MetricCardSkeleton.tsx
export const MetricCardSkeleton = () => (
  <div className="bg-[#14213D] border border-[#1F2A3D] rounded-2xl p-4 animate-pulse space-y-3">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#1F2A3D]" />
      <div className="h-4 w-1/3 bg-[#1F2A3D] rounded" />
    </div>
    <div className="h-6 w-1/4 bg-[#1F2A3D] rounded" />
  </div>
);
