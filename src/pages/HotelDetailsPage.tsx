import { useParams } from "react-router";
import { useGetHotelFullDetailsQuery } from "../features/api/hotelsApi";
import { useGetRoomByHotelIdQuery } from "../features/api/roomsApi";
import { Loader2, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { RoomCard } from "../components/room/RoomCard";

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

   const hotel = hotelDetails?.hotel;
  const address = hotelDetails?.address;
  const amenities = hotelDetails?.amenities;
  const gallery = hotel?.gallery || [];
  const displayedRooms = hotelRoomsData?.slice(0, 4) || [];
  

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {(isLoadingHotelDetails || isLoadingHotelRoomsData) && (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      )}

      {(isErrorHotelDetails || isErrorHotelRoomsData) && (
        <div className="text-center text-red-600 py-10">
          Failed to load hotel details. Please try again later.
        </div>
      )}

      {!isLoadingHotelDetails && !isLoadingHotelRoomsData && hotel && (
        <>
          {/* Hero Image */}
          <div className="w-full h-64 md:h-[400px] overflow-hidden">
            <img
              src={hotel.thumbnail}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hotel Info Section */}
          <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">{hotel.name}</h1>
                <p className="text-gray-600">{hotel.category}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-lg font-medium">{hotel.rating}</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
              <MapPin className="w-4 h-4" />
              <span>
                {address?.street}, {address?.city}, {address?.state},{" "}
                {address?.country} - {address?.postalCode}
              </span>
            </div>

            {/* Contact */}
            <div className="mt-2 text-sm text-gray-500">
              <span>Contact: {hotel.contactPhone}</span>
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-700">{hotel.description}</p>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gallery.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Hotel gallery ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {amenities?.map((a: { amenityId: number; name: string ; }) => (
                  <div
                    key={a.amenityId}
                    className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm"
                  >
                    {a.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Owner */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Hotel Owner</h2>
              <div className="flex items-center gap-3">
                <img
                  src={hotel.owner.profileImage}
                  alt={hotel.owner.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {hotel.owner.firstName} {hotel.owner.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{hotel.owner.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="bg-white py-6 md:py-10 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Available Rooms</h2>
                {hotelRoomsData && hotelRoomsData.length > 4 && (
                  <Link 
                    to={`/hotel/${hotelId}/rooms`} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View all rooms
                  </Link>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {displayedRooms.map((room) => (
                  <RoomCard key={room.roomId} room={room} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};