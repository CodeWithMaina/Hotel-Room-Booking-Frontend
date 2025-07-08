
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
          src="https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0"
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
          onClick={() => navigate(`/booking/${room.roomId}`)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// import {
//   BedDouble,
//   DollarSign,
//   Users,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router";

// export interface TRoom {
//   roomId: number;
//   hotelId: number;
//   roomType: string;
//   pricePerNight: string;
//   capacity: number;
//   isAvailable: boolean;
//   createdAt: string;
// }

// interface RoomCardProps {
//   room: TRoom;
// }

// export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
//   const navigate = useNavigate();
//   return (
//     <div
//       className="bg-white hover:shadow-lg transition-shadow duration-300 p-4 rounded-xl shadow-sm cursor-pointer"
//       onClick={() => navigate(`/room/${room.roomId}`)}
//     >
//       <img
//         src="https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         alt={room.roomType}
//         className="w-full h-40 object-cover rounded mb-3"
//       />
//       <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
//         <BedDouble className="w-4 h-4 text-blue-600" /> {room.roomType}
//       </h3>
//       <p className="text-sm text-gray-500 flex items-center gap-2">
//         <DollarSign className="w-4 h-4 text-blue-600" /> ${room.pricePerNight} /
//         night
//       </p>
//       <p className="text-sm text-gray-500 flex items-center gap-2">
//         <Users className="w-4 h-4 text-blue-600" /> Capacity: {room.capacity}{" "}
//         guests
//       </p>
//       <p
//         className={`text-sm font-medium flex items-center gap-2 mt-2 ${
//           room.isAvailable ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         {room.isAvailable ? (
//           <>
//             <CheckCircle className="w-4 h-4" /> Available
//           </>
//         ) : (
//           <>
//             <XCircle className="w-4 h-4" /> Unavailable
//           </>
//         )}
//       </p>
//     </div>
//   );
// };
