import { BedDouble, DollarSign, Users, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router";

export interface TRoom {
  roomId: number;
  hotelId: number;
  roomType: string;
  pricePerNight: string;
  capacity: number;
  isAvailable: boolean;
  createdAt: string;
}

interface RoomCardProps {
  room: TRoom;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {

    const navigate = useNavigate();
  return (
    <div className="bg-slate-100 p-4 rounded-xl shadow-sm"  onClick={() => navigate(`/room/${room.roomId}`)}>
      <img
        src="https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt={room.roomType}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
        <BedDouble className="w-4 h-4 text-blue-600" /> {room.roomType}
      </h3>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-blue-600" /> ${room.pricePerNight} / night
      </p>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-600" /> Capacity: {room.capacity} guests
      </p>
      <p
        className={`text-sm font-medium flex items-center gap-2 mt-2 ${
          room.isAvailable ? "text-green-600" : "text-red-600"
        }`}
      >
        {room.isAvailable ? (
          <><CheckCircle className="w-4 h-4" /> Available</>
        ) : (
          <><XCircle className="w-4 h-4" /> Unavailable</>
        )}
      </p>
    </div>
  );
};
