import {
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import type { TRoomType } from "../../types/roomsTypes";

type Room = {
  roomId: number;
  roomType: TRoomType;
  pricePerNight: number;
  capacity: number;
  isAvailable: boolean;
  thumbnail: string;
};

export const DashboardRoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const navigate = useNavigate();

  const roomTypeName = room.roomType?.name || "StayCloud Room";
  const thumbnail = room.thumbnail || "";
  const price = parseFloat(room.pricePerNight?.toString() || "0").toFixed(2);
  const capacity = room.capacity || 1;

  return (
    <div
      onClick={() => navigate(`/admin/room/${roomTypeName}/${room.roomId}`)}
      className="bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-sm text-base-content cursor-pointer transform transition duration-300 hover:shadow-md hover:ring-2 hover:ring-primary animate-fade-in"
    >
      <div className="overflow-hidden">
        <img
          src={thumbnail}
          alt={roomTypeName}
          className="w-full h-48 object-cover rounded-t-xl transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-room-image.jpg";
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-xl font-heading font-semibold text-primary">
          {roomTypeName}
        </h3>

        <div className="flex items-center gap-2 text-primary font-medium">
          <DollarSign size={18} />
          <span>${price} / night</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted">
          <Users size={16} />
          <span>
            Capacity: {capacity} {capacity === 1 ? "guest" : "guests"}
          </span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            room.isAvailable ? "text-success" : "text-error"
          }`}
        >
          {room.isAvailable ? (
            <CheckCircle size={16} />
          ) : (
            <XCircle size={16} />
          )}
          <span>{room.isAvailable ? "Available" : "Not Available"}</span>
        </div>
      </div>
    </div>
  );
};
