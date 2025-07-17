import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface UsersActionBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const UsersActionBar: React.FC<UsersActionBarProps> = ({
  onSearch,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full bg-base-100 border border-base-300 rounded-2xl shadow-sm p-4",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center bg-base-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition">
          <Search className="w-4 h-4 text-muted mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-transparent outline-none text-sm text-base-content placeholder:text-muted"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
