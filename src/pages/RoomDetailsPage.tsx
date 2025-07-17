import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { isValidElementType } from "react-is";
import * as LucideIcons from "lucide-react";
import {
  Users,
  CheckCircle,
  XCircle,
  Heart,
  Loader2,
} from "lucide-react";

import Navbar from "../components/NavBar";
import { Button } from "../components/Button";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { SuggestedRooms } from "../components/room/SuggestedRooms";
import { useGetRoomWithAmenitiesQuery } from "../features/api";
import { useAddToWishlistMutation } from "../features/api/wishlistApi";
import type { RootState } from "../app/store";
import type { TRoomWithAmenities } from "../types/roomsTypes";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { isFetchBaseQueryError, isSerializedError } from "../utils/typeGuard";

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

  const handleBooking = () => {
    navigate(`/user/checkout/${roomId}`);
  };

  const handleAddToWishlist = async () => {
  if (!userId) {
    toast.error("You need to log in to add to wishlist");
    return;
  }

  try {
    await addToWishlist({ userId: Number(userId), roomId }).unwrap();
    toast.success("Room added to wishlist!");
  } catch (error) {
    if (isFetchBaseQueryError(error)) {
      const apiError = error as FetchBaseQueryError;

      const message =
        typeof apiError.data === "object" &&
        apiError.data !== null &&
        "message" in apiError.data
          ? (apiError.data as { message: string }).message
          : "Failed to add to wishlist";

      toast.error(message);
    } else if (isSerializedError(error)) {
      const serialized = error as SerializedError;
      toast.error(serialized.message || "Something went wrong.");
    } else {
      toast.error("Unexpected error occurred.");
    }
  }
};


  const getAmenityIcon = (iconName: string): React.JSX.Element => {
    const IconCandidate = LucideIcons[iconName as keyof typeof LucideIcons];
    if (isValidElementType(IconCandidate)) {
      const Icon = IconCandidate as React.ElementType;
      return <Icon size={20} />;
    }
    return <LucideIcons.Circle size={20} />;
  };

  if (isRoomLoading) return <Loading />;
  if (isRoomError || !roomDetails) return <Error />;

  const { room, amenities }: TRoomWithAmenities = roomDetails;

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen mt-16 px-6 py-8">
        <h1 className="text-center text-3xl font-bold text-blue-700 mb-8">
          {room.roomType}
        </h1>

        <section className="flex flex-col lg:flex-row gap-10">
          {/* === Main Content === */}
          <div className="flex-1 space-y-6">
            {/* Room Image */}
            <img
              src={room.thumbnail}
              alt={`${room.roomType} Thumbnail`}
              className="w-full h-64 object-cover rounded-xl shadow-md"
            />

            {/* Description + Actions */}
            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                About this place
              </h2>

              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Description */}
                <div className="flex-1 text-gray-600">
                  <p className="mb-4 leading-relaxed">
                    Escape to the serene luxury of the{" "}
                    <strong>{room.roomType}</strong> at Blue Origin Farms.
                    Nestled over crystal waters, enjoy a king-sized bed,
                    minibar, air conditioning, and modern entertainment.
                  </p>

                  <div className="flex flex-wrap gap-4 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Users className="text-blue-600" size={18} />
                      <span>{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.isAvailable ? (
                        <CheckCircle className="text-green-600" size={18} />
                      ) : (
                        <XCircle className="text-red-600" size={18} />
                      )}
                      <span>
                        {room.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking + Wishlist */}
                <aside className="w-full md:w-1/3 bg-slate-100 p-6 rounded-xl shadow flex flex-col gap-4 items-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Start Booking
                  </h3>
                  <p className="text-blue-600 font-bold text-xl">
                    ${room.pricePerNight}
                    <span className="text-gray-500 font-medium text-sm ml-1">
                      /night
                    </span>
                  </p>

                  <Button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!room.isAvailable}
                  >
                    Book Now
                  </Button>

                  <Button
                    onClick={handleAddToWishlist}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    disabled={isWishLoading}
                  >
                    {isWishLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Heart size={18} />
                    )}
                    {isWishLoading ? "Adding..." : "Add to Wishlist"}
                  </Button>
                </aside>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Room Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
                {amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center gap-2">
                    <span className="text-blue-600">
                      {getAmenityIcon(amenity.icon)}
                    </span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === Sidebar: Suggested Rooms === */}
          <aside className="lg:w-80 flex-shrink-0 space-y-4">
            <SuggestedRooms currentRoomId={roomId} />
          </aside>
        </section>
      </main>
    </>
  );
};
