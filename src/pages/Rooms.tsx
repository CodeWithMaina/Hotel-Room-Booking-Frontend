import NavBar from "../components/NavBar";
import { RoomCard } from "../components/room/RoomCard";
import { useGetRoomsQuery } from "../features/api";
import type { TRoom } from "../types/roomsTypes";
import { useState, useMemo } from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";

export const Rooms = () => {
  const { data: rooms = [], isLoading, isError } = useGetRoomsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => !showAvailableOnly || room.isAvailable)
      .filter(room =>
        room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === 'asc'
          ? a.pricePerNight - b.pricePerNight
          : b.pricePerNight - a.pricePerNight
      );
  }, [rooms, searchTerm, showAvailableOnly, sortOrder]);

  if (isLoading) return <p className="p-4 text-center">Loading rooms...</p>;
  if (isError) return <p className="p-4 text-center text-red-600">Failed to load rooms.</p>;

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <header className="container mt-15 mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-6 gap-4">
        <div className="flex items-center w-full md:w-1/3 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-2 text-gray-700"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={e => setShowAvailableOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700 text-sm">Available Only</span>
          </label>

          <button
            onClick={() =>
              setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
            }
            className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {sortOrder === 'asc' ? (
              <><SortAsc className="w-4 h-4 mr-1" /> Price Low</>
            ) : (
              <><SortDesc className="w-4 h-4 mr-1" /> Price High</>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room: TRoom) => (
            <RoomCard key={room.roomId} room={{ ...room, pricePerNight: Number(room.pricePerNight) }} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No rooms match your criteria.
          </p>
        )}
      </main>
    </div>
  );
};