import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = 18, color = "text-white" }: { size?: number; color?: string }) => {
  return (
    <div className="animate-spin">
      <Loader2 className={`${color}`} size={size} />
    </div>
  );
};
