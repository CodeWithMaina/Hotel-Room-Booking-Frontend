import React from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as LucideIcons from "lucide-react";
import {
  Users,
  CheckCircle,
  XCircle,
  Heart,
  Loader2,
  Circle,
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

  const [addToWishlist, { isLoading: isWishLoading }] =
    useAddToWishlistMutation();

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
      <main className="bg-gradient-to-br from-white to-slate-100 text-[#03071E] min-h-screen">
        {/* Hero */}
        <div className="w-full h-[420px] overflow-hidden shadow-sm">
          <img
            src={room.thumbnail}
            alt={room.roomType}
            className="w-full h-full object-cover object-center rounded-b-3xl"
          />
        </div>

        {/* Main Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[#03071E] font-heading">
            {room.roomType}
          </h1>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* About Room */}
              <div>
                <h2 className="text-2xl font-semibold text-[#0B2545] mb-4">
                  About This Room
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Experience luxury in our <strong>{room.roomType}</strong> suite featuring a king-sized bed, minibar, AC, and stunning views.
                  Perfect for a peaceful stay at Blue Origin Farms.
                </p>

                <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-800" size={18} />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {room.isAvailable ? (
                      <CheckCircle className="text-green-600" size={18} />
                    ) : (
                      <XCircle className="text-red-500" size={18} />
                    )}
                    <span>{room.isAvailable ? "Available" : "Unavailable"}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-semibold text-[#0B2545] mb-4">
                  Room Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="flex items-center gap-2 bg-white border border-gray-200 p-3 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-yellow-600">
                        {getAmenityIcon(amenity.icon)}
                      </span>
                      <span className="text-sm text-gray-800 font-medium">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-2xl font-semibold text-[#0B2545] mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {room.gallery.slice(0, 6).map((img, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-gray-200 shadow-sm group"
                    >
                      <img
                        src={img}
                        alt={`Room Gallery ${index + 1}`}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8 sticky top-28 h-fit bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold text-blue-900">Start Booking</h3>
                <div className="text-4xl font-bold text-blue-800">
                  ${room.pricePerNight}
                  <span className="text-sm font-normal text-gray-500"> / night</span>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={!room.isAvailable}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold"
                >
                  Book Now
                </Button>

                <Button
                  onClick={handleAddToWishlist}
                  disabled={isWishLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  {isWishLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Heart size={18} />
                  )}
                  {isWishLoading ? "Adding..." : "Add to Wishlist"}
                </Button>
              </div>

              <div>
                <SuggestedRooms currentRoomId={roomId} />
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
