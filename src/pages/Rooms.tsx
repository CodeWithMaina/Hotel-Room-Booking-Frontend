import NavBar from "../components/NavBar";
import { useGetRoomsQuery } from "../features/api";
import type { TRoom } from "../types/roomsTypes";
import { useState, useMemo } from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { RoomCard } from "../components/room/RoomCard";

export const Rooms = () => {
  const { data: rooms = [], isLoading, isError } = useGetRoomsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => !showAvailableOnly || room.isAvailable)
      .filter((room) =>
        room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.pricePerNight - b.pricePerNight
          : b.pricePerNight - a.pricePerNight
      );
  }, [rooms, searchTerm, showAvailableOnly, sortOrder]);

  if (isLoading)
    return (
      <p className="p-6 text-center text-[#14213d] text-lg font-medium">
        Loading rooms...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-center text-red-600 text-lg font-semibold">
        Failed to load rooms.
      </p>
    );

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <NavBar />

      <header className="container mx-auto mt-15 pt-5 px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Search Bar */}
        <div className="flex mb-5 items-center w-full md:w-1/3 bg-[#e5e5e5] rounded-lg px-3 py-2 shadow-sm">
          <Search className="w-5 h-5 text-[#03071e]" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-2 text-[#14213d] placeholder:text-[#6b7280]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="h-4 w-4 text-[#fca311] border-[#14213d] rounded focus:ring-[#fca311]"
            />
            <span className="text-[#14213d] text-sm font-medium">
              Available Only
            </span>
          </label>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center gap-1 bg-[#fca311] text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-[#e59500] transition"
          >
            {sortOrder === "asc" ? (
              <>
                <SortAsc className="w-4 h-4" />
                <span>Price Low</span>
              </>
            ) : (
              <>
                <SortDesc className="w-4 h-4" />
                <span>Price High</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Room Cards */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room: TRoom) => (
            <RoomCard
              key={room.roomId}
              room={{
                ...room,
                pricePerNight: Number(room.pricePerNight),
              }}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <p className="text-center text-[#6b7280] mt-10 text-base">
            No rooms match your criteria.
          </p>
        )}
      </main>
    </div>
  );
};
