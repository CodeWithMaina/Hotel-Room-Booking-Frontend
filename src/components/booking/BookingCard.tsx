import {
  CalendarDays,
  Pencil,
  Trash2,
  DollarSign,
  BedDouble,
  Clock,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";

type Booking = {
  bookingId?: number;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  room: {
    roomType: string;
    capacity: number;
    pricePerNight: number;
    thumbnail: string;
    hotelId: number;
    roomId: number;
    isAvailable: boolean;
    createdAt: string;
  };
  onCancel: () => void;
  onDelete: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  userType: string;
};

export const BookingCard = ({
  bookingStatus,
  checkInDate,
  checkOutDate,
  totalAmount,
  room,
  onCancel,
  onDelete,
  onClick,
  userType,
}: Booking) => {
  const nights = differenceInCalendarDays(
    new Date(checkOutDate),
    new Date(checkInDate)
  );
  const formattedCheckIn = format(new Date(checkInDate), "dd MMM yyyy");
  const formattedCheckOut = format(new Date(checkOutDate), "dd MMM yyyy");

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((userType === "admin" || userType === "owner") && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      className={`group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm w-full max-w-sm md:max-w-[340px] font-sans ${
        userType === "admin" || userType === "owner"
          ? "cursor-pointer"
          : "cursor-default"
      }`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={room.thumbnail}
          alt={room.roomType}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
          ${room.pricePerNight} / night
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 text-slate-800">
        <h2 className="text-lg font-semibold tracking-tight">
          {room.roomType}
        </h2>

        <div className="text-sm space-y-1">
          <p className="flex items-center gap-2 text-slate-500">
            <BedDouble size={16} /> Capacity: {room.capacity}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} />
            {formattedCheckIn} → {formattedCheckOut}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} />
            {nights} night{nights > 1 && "s"}
          </p>
          <p className="flex items-center gap-2 font-semibold text-blue-700">
            <DollarSign size={16} /> ${totalAmount}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-block text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide ${
            bookingStatus === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : bookingStatus === "Confirmed"
              ? "bg-green-100 text-green-800"
              : bookingStatus === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {bookingStatus}
        </span>

        {userType === "user" && (
          <div className="pt-4 flex flex-wrap gap-2 justify-between">
            {bookingStatus === "Pending" && (
              <button
                onClick={onCancel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <Pencil size={16} /> Cancel
              </button>
            )}

            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
