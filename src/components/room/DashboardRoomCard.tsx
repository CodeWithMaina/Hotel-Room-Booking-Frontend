import { DollarSign, Users, CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

type Room = {
  roomId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  isAvailable: boolean;
  thumbnail: string;
};

export const DashboardRoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/admin/room/${room.roomType}/${room.roomId}`)}
      className="bg-[#14213D] rounded-2xl overflow-hidden shadow-md text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-[#FCA311] animate-fadeIn"
    >
      <div className="overflow-hidden">
        <img
          src={room.thumbnail}
          alt={room.roomType}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold">{room.roomType}</h3>

        <div className="flex items-center gap-2 text-[#FCA311]">
          <DollarSign size={16} />
          <span className="text-sm">${room.pricePerNight} / night</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Users size={16} />
          <span>Capacity: {room.capacity} guests</span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm ${
            room.isAvailable ? "text-green-400" : "text-red-400"
          }`}
        >
          {room.isAvailable ? <CheckCircle size={16} /> : <XCircle size={16} />}
          <span>{room.isAvailable ? "Available" : "Not Available"}</span>
        </div>
      </div>
    </div>
  );
};
