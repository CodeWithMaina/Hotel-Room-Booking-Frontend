
import {
  BedDouble,
  DollarSign,
  Users
} from "lucide-react";
import { useNavigate } from "react-router";
import type { TRoom } from "../../types/roomsTypes";

interface RoomCardProps {
  room: TRoom;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition cursor-pointer"
      onClick={() => navigate(`/room/${room.roomId}`)}
    >
      <div className="relative">
        <img
          src={room.thumbnail}
          alt={room.roomType}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
            room.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {room.isAvailable ? "Available" : "Booked"}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-blue-600" /> {room.roomType}
        </h3>

        <div className="flex items-center justify-between text-gray-600">
          <p className="flex items-center gap-1 text-sm">
            <Users className="w-4 h-4 text-blue-600" /> {room.capacity} Guests
          </p>
          <p className="flex items-center gap-1 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-blue-600" /> $
            {room.pricePerNight}
          </p>
        </div>

        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
