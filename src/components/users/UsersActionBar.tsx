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
        "w-full bg-[#14213d] rounded-2xl shadow-lg p-4",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Live Search */}
        <div className="flex-1 flex items-center bg-[#000000] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#fca311] transition">
          <Search className="w-4 h-4 text-[#e5e5e5] mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
      </div>
    </div>
  );
};
