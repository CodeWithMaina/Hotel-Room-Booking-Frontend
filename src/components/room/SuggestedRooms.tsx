import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetRoomsQuery } from "../../features/api/roomsApi";

interface SuggestedRoomsProps {
  currentRoomId: number;
}

export const SuggestedRooms: React.FC<SuggestedRoomsProps> = ({
  currentRoomId,
}) => {
  const navigate = useNavigate();

  const {
    data: rooms,
    isLoading,
    isError,
  } = useGetRoomsQuery(); // Replace with actual hook name if different

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-slate-50 rounded-lg shadow animate-pulse overflow-hidden">
      <div className="h-32 bg-slate-200 w-full" />
      <div className="p-3">
        <div className="h-4 bg-slate-300 rounded w-3/4" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          You might also like
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !rooms) {
    return (
      <div className="flex items-center text-red-600 gap-2">
        <AlertTriangle size={20} />
        <span>Failed to load suggestions</span>
      </div>
    );
  }

  const filtered = rooms.filter((room: { roomId: number }) => room.roomId !== currentRoomId);
  const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        You might also like
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {shuffled.map((room: { roomId: number; roomType: string; thumbnail: string }) => (
          <div
            key={room.roomId}
            onClick={() => navigate(`/room/${room.roomId}`)}
            className="bg-slate-50 rounded-lg shadow hover:shadow-md transition overflow-hidden cursor-pointer"
          >
            <img
              src={room.thumbnail}
              alt={room.roomType}
              className="h-32 w-full object-cover"
            />
            <div className="p-3">
              <h4 className="font-semibold text-gray-700 text-sm">
                {room.roomType}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
