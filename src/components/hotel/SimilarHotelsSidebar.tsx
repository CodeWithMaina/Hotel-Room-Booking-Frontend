import React from "react";
import { useGetHotelsQuery } from "../../features/api";
import { Loader2, AlertTriangle } from "lucide-react";

interface SimilarHotelsSidebarProps {
  currentHotelId: number;
}

export const SimilarHotelsSidebar: React.FC<SimilarHotelsSidebarProps> = ({
  currentHotelId,
}) => {
  const {
    data: allHotels,
    isLoading,
    isError,
  } = useGetHotelsQuery();

  // Filter out the current hotel and randomize others
  const getRandomizedHotels = () => {
    if (!allHotels) return [];
    const filtered = allHotels.filter(
      (hotel: { hotelId: number }) => hotel.hotelId !== currentHotelId
    );
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 5); // Limit to 5 similar hotels
  };

  const otherHotels = getRandomizedHotels();

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow h-fit flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow h-fit flex items-center text-red-600">
        <AlertTriangle className="mr-2" />
        Failed to load similar hotels.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow h-fit">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        Similar Hotels
      </h2>
      <ul className="space-y-4">
        {otherHotels.map((hotel: { hotelId: number; name: string; thumbnail?: string; }) => (
          <li
            key={hotel.hotelId}
            className="flex gap-3 items-center hover:text-blue-700 cursor-pointer transition"
          >
            <img
              src={hotel.thumbnail}
              alt={hotel.name}
              className="w-12 h-12 rounded object-cover"
            />
            <span>{hotel.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
