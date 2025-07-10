import { Search, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

interface UsersActionBarProps {
  onSearch: (query: string) => void;
  onAddUser: () => void;
  className?: string;
}

export const UsersActionBar: React.FC<UsersActionBarProps> = ({
  onSearch,
  onAddUser,
  className,
}) => {
  return (
    <div className={cn("w-full bg-white rounded-xl shadow-sm p-3", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Live Search */}
        <div className="flex-1 flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-transparent outline-none text-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Add User Button */}
        <button
          onClick={onAddUser}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>
    </div>
  );
};
