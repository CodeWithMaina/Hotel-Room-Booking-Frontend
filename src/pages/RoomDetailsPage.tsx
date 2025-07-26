// ✅ Full updated RoomDetailsPage code

import React from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as LucideIcons from "lucide-react";
import {
  Users,
  Heart,
  Loader2,
  Circle,
  Star,
  MapPin,
  Bath,
  BedDouble,
} from "lucide-react";

import Navbar from "../components/common/NavBar";
import { Loading } from "../components/common/Loading";
import { Error } from "../components/common/Error";
import { SuggestedRooms } from "../components/room/SuggestedRooms";
import { useGetRoomWithAmenitiesQuery } from "../features/api";
import { useAddToWishlistMutation } from "../features/api/wishlistApi";
import { parseRTKError } from "../utils/parseRTKError";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/ui/Button";

import type { RootState } from "../app/store";
import type { TRoomWithAmenities } from "../types/roomsTypes";
import { isValidElementType } from "react-is";

export const RoomDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    data: roomDetails,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomWithAmenitiesQuery(roomId, {
    skip: isNaN(roomId),
    refetchOnMountOrArgChange: true,
  });

  const [addToWishlist, { isLoading: isWishLoading }] = useAddToWishlistMutation();

  const handleBooking = () => navigate(`/user/checkout/${roomId}`);

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast.error("You need to log in to add to wishlist");
      return;
    }
    try {
      await addToWishlist({ userId: Number(userId), roomId }).unwrap();
      toast.success("Room added to wishlist!");
    } catch (error) {
      const message = parseRTKError(error, "Failed to add to wishlist");
      toast.error(message);
    }
  };

  const getAmenityIcon = (iconName: string): React.JSX.Element => {
    const IconCandidate = LucideIcons[iconName as keyof typeof LucideIcons];
    return isValidElementType(IconCandidate)
      ? React.createElement(IconCandidate as React.ElementType, { size: 20 })
      : <Circle size={20} />;
  };

  if (isRoomLoading) return <Loading />;
  if (isRoomError || !roomDetails) return <Error />;

  const { room, amenities }: TRoomWithAmenities = roomDetails;

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="relative">
          <div className="w-full h-[60vh] sm:h-[70vh] overflow-hidden">
            <img src={room.thumbnail} alt={room.roomType.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-6 left-6 max-w-[80%]">
            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900">{room.roomType.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Blue Origin Farms</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${room.isAvailable ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${room.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {room.isAvailable ? 'Available Now' : 'Unavailable'}
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Overview</h2>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={18} />
                        <span>{room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BedDouble size={18} />
                        <span>{room.roomType.name.includes("King") ? "King Bed" : "Bed"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath size={18} />
                        <span>Private Bath</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">${room.pricePerNight}</div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{room.description}</p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <div key={amenity.amenityId} className="group flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all">
                      <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                        {getAmenityIcon(amenity.icon)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{amenity.name}</div>
                        <div className="text-xs text-gray-500">{amenity.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {room.gallery.slice(0, 6).map((img, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] cursor-pointer">
                      <img src={img} alt={`Room Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-1">${room.pricePerNight}</div>
                    <div className="text-gray-500">per night</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleBooking} disabled={!room.isAvailable} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-200 shadow-md hover:shadow-lg">
                      {room.isAvailable ? 'Book Now' : 'Currently Unavailable'}
                    </Button>
                    <Button onClick={handleAddToWishlist} disabled={isWishLoading} className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2 transition-all duration-200">
                      {isWishLoading ? (<><Loader2 className="animate-spin" size={18} />Adding...</>) : (<><Heart size={18} />Save to Wishlist</>)}
                    </Button>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center text-sm text-gray-500 mb-4">Free cancellation up to 24 hours before check-in</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Rooms</h3>
                  <SuggestedRooms currentRoomId={roomId} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
