import { useParams } from "react-router-dom";
import {
  useGetHotelFullDetailsQuery,
  useGetRoomByHotelIdQuery,
} from "../features/api";
import {
  Wifi,
  Bath,
  Dumbbell,
  Utensils,
  Sparkles,
  ParkingCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { JSX } from "react";
import { Loading } from "./Loading";
import type { TRoom } from "../types/roomsTypes";
import { RoomCard } from "../components/room/RoomCard";
import Navbar from "../components/NavBar";

const amenityIcons: Record<string, JSX.Element> = {
  wifi: <Wifi className="w-5 h-5 text-blue-600" />,
  pool: <Bath className="w-5 h-5 text-blue-600" />,
  fitness_center: <Dumbbell className="w-5 h-5 text-blue-600" />,
  restaurant: <Utensils className="w-5 h-5 text-blue-600" />,
  spa: <Sparkles className="w-5 h-5 text-blue-600" />,
  local_parking: <ParkingCircle className="w-5 h-5 text-blue-600" />,
};

export const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const hotelId = Number(id);

  const {
    data: hotelDetails,
    isLoading: isLoadingHotelDetails,
    isError: isErrorHotelDetails,
  } = useGetHotelFullDetailsQuery(hotelId);

  const {
    data: hotelRoomsData,
    isLoading: isLoadingHotelRoomsData,
    isError: isErrorHotelRoomsData,
  } = useGetRoomByHotelIdQuery(hotelId);

  console.log(hotelRoomsData);
  if (isLoadingHotelDetails || isLoadingHotelRoomsData) return <Loading />;

  if (
    isErrorHotelDetails ||
    !hotelDetails ||
    isErrorHotelRoomsData ||
    !hotelRoomsData
  ) {
    toast.error("Failed to load hotel details");
    return (
      <div className="text-center text-gray-700">Something went wrong.</div>
    );
  }

  const { hotel, address, amenities } = hotelDetails;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-10 bg-gradient-to-b from-slate-100 to-slate-200 text-gray-700 p-4 md:p-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Main Hotel Details */}
          <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow">
            {/* Hotel Image */}
            <img
              src={`https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt={hotel.name}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />

            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              {hotel.name}
            </h1>
            <p className="text-gray-500 mb-1">Category: {hotel.category}</p>
            <p className="text-gray-500 mb-1">Rating: {hotel.rating}</p>
            <p className="text-gray-500 mb-1">Phone: {hotel.contactPhone}</p>
            <p className="text-gray-500 mb-4">
              Address: {address.street}, {address.city}, {address.state},{" "}
              {address.country}, {address.postalCode}
            </p>

            {/* Amenities */}
            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity.amenityId} className="flex items-start gap-3">
                  <div>
                    {typeof amenity.icon === "string" &&
                    amenityIcons[amenity.icon] ? (
                      amenityIcons[amenity.icon]
                    ) : (
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{amenity.name}</p>
                    <p className="text-gray-500 text-sm">
                      {amenity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rooms Section */}
            <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-2">
              Available Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(hotelRoomsData) &&
                hotelRoomsData.map((room: TRoom) => (
                  <RoomCard
                    key={room.roomId}
                    room={{
                      ...room,
                      pricePerNight: String(room.pricePerNight),
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Sidebar: Similar Hotels */}
          <div className="bg-white p-4 rounded-2xl shadow h-fit">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Similar Hotels
            </h2>
            <ul className="space-y-4">
              {["Hotel Luxe Haven", "The Royal Inn", "Platinum Suites"].map(
                (name) => (
                  <li
                    key={name}
                    className="flex gap-3 items-center hover:text-blue-700 cursor-pointer transition"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                      alt={name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <span>{name}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
