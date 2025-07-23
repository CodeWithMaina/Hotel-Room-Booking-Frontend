import React from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as LucideIcons from "lucide-react";
import { Users, CheckCircle, XCircle, Heart, Loader2 } from "lucide-react";

import Navbar from "../components/common/NavBar";
import { Loading } from "../components/common/Loading";
import { Error } from "../components/common/Error";
import { SuggestedRooms } from "../components/room/SuggestedRooms";
import { useGetRoomWithAmenitiesQuery } from "../features/api";
import { useAddToWishlistMutation } from "../features/api/wishlistApi";
import { parseRTKError } from "../utils/parseRTKError"; // ✅ Use your provided utility here

import type { RootState } from "../app/store";
import type { TRoomWithAmenities } from "../types/roomsTypes";
import { Button } from "../components/ui/Button";
import { isValidElementType } from "react-is";
import { Footer } from "../components/common/Footer";

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
      : <LucideIcons.Circle size={20} />;
  };

  if (isRoomLoading) return <Loading />;
  if (isRoomError || !roomDetails) return <Error />;

  const { room, amenities }: TRoomWithAmenities = roomDetails;

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen font-body text-gray-800">
        <div className="w-full h-[420px] overflow-hidden">
          <img
            src={room.thumbnail}
            alt={`${room.roomType} Thumbnail`}
            className="w-full h-full object-cover object-center rounded-b-3xl shadow-md"
          />
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
          <h1 className="text-4xl sm:text-5xl font-heading text-blue-900 text-center font-bold">
            {room.roomType}
          </h1>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-800">About This Room</h2>
                <p className="text-gray-600 leading-relaxed">
                  Experience luxury in our <strong>{room.roomType}</strong> suite featuring a king-sized bed, minibar, AC, and stunning views. 
                  Perfect for a peaceful stay at Blue Origin Farms.
                </p>
                <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-700" size={18} />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {room.isAvailable ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : (
                      <XCircle className="text-red-400" size={18} />
                    )}
                    <span>{room.isAvailable ? "Available" : "Unavailable"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Room Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow transition"
                    >
                      <span className="text-yellow-500">{getAmenityIcon(amenity.icon)}</span>
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {room.gallery.slice(0, 3).map((img, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-gray-200 shadow-sm group"
                    >
                      <img
                        src={img}
                        alt={`Room Gallery ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-800">Start Booking</h3>
                <p className="text-3xl text-blue-700 font-bold">
                  ${room.pricePerNight}
                  <span className="text-sm text-gray-500"> /night</span>
                </p>

                <Button
                  onClick={handleBooking}
                  disabled={!room.isAvailable}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
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

              <SuggestedRooms currentRoomId={roomId} />
            </aside>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
};
