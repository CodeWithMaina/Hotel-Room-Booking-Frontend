import { useGetTicketsQuery } from "../../features/api";
import { UserRound, Filter, RotateCcw } from "lucide-react";

interface Props {
  filters: { user: string; status: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ user: string; status: string }>
  >;
}

export const TicketFilters = ({ filters, setFilters }: Props) => {
  const { data: tickets } = useGetTicketsQuery();

  const userNames = Array.from(
    new Set(
      tickets?.map(
        (ticket) => `${ticket.user?.firstName} ${ticket.user?.lastName}`
      ) || []
    )
  );

  const resetFilters = () =>
    setFilters({
      user: "",
      status: "",
    });

  return (
    <div className="w-full bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-3 rounded-lg shadow mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
        {/* Title */}
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="text-blue-600" size={20} />
          <h2 className="text-base font-semibold">Filters</h2>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* User Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <label className="text-sm text-gray-700 flex items-center gap-1">
              <UserRound className="text-blue-600" size={16} />
              <span>User</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-sm input-bordered bg-white text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600 w-48"
              value={filters.user}
              onChange={(e) =>
                setFilters((f) => ({ ...f, user: e.target.value }))
              }
              list="userNames"
            />
            <datalist id="userNames">
              {userNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <label className="text-sm text-gray-700">Status</label>
            <select
              className="select select-sm select-bordered bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 w-40"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="btn btn-sm text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
