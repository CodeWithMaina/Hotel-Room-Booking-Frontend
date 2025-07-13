import { MapPin, Phone, Star } from "lucide-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { THotel } from "../../types/hotelsTypes";

interface HotelCardProps {
  hotel: THotel;
}

export const DashboardHotelCard: FC<HotelCardProps> = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300"
      onClick={() => navigate(`/admin/hotels/${hotel.name}/${hotel.hotelId}`)}
    >
      <img
        src={hotel.thumbnail}
        alt={hotel.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-600">{hotel.name}</h2>
        <p className="text-gray-500">{hotel.category} Hotel</p>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-700">
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {hotel.location}
          </span>
          <span className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" /> {hotel.rating}
          </span>
        </div>
        <p className="mt-2 text-gray-500 text-sm flex items-center gap-2">
          <Phone size={14} /> {hotel.contactPhone}
        </p>
      </div>
    </div>
  );
};