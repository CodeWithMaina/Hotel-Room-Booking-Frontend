import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button } from "../Button";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../../app/store";
import { useGetBookingsByUserIdQuery } from "../../features/api/bookingsApi";
import { useGetRoomsQuery } from "../../features/api/roomsApi";
import type { TBooking } from "../../types/bookingsTypes";
import type { TRoom } from "../../types/roomsTypes";
import { LoadingSpinner } from "../loadingSpinner";

export const BookingCard = () => {
  const {userId} = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: bookingData,
    isLoading: bookingLoading,
    isError: bookingError,
  } = useGetBookingsByUserIdQuery(
    { userId: id, limit: 100, status: ["Pending", "Confirmed"] },
    { skip: !id }
  );

  const {
    data: rooms,
    isLoading: roomsLoading,
    isError: roomsError,
  } = useGetRoomsQuery();

  const upcomingBooking: TBooking | null = useMemo(() => {
    if (!bookingData?.data?.length) return null;

    const upcoming = bookingData.data
      .filter((b) => new Date(b.checkInDate) > new Date())
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());

    return upcoming[0] || null;
  }, [bookingData]);

  const randomRoom: TRoom | null = useMemo(() => {
    if (!rooms?.length) return null;

    const availableRooms = rooms.filter((room) => room.isAvailable);
    const randomIndex = Math.floor(Math.random() * availableRooms.length);

    return availableRooms[randomIndex] || null;
  }, [rooms]);

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Booking cancelled successfully.");
        // Trigger API cancel mutation here if needed
      }
    });
  };

  if (bookingLoading || roomsLoading) return <LoadingSpinner />;
  if (bookingError || roomsError) {
    return (
      <div className="p-6 rounded-xl bg-red-100 text-red-800 shadow-md">
        <p className="font-semibold">Oops! Something went wrong loading your data.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 via-blue-100 to-blue-200 border border-blue-300/30 shadow-lg rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Image */}
        <div className="w-full sm:w-[260px] h-[180px] overflow-hidden rounded-xl shadow-md">
          <img
            src={
              upcomingBooking
                ? "https://source.unsplash.com/featured/?resort,hotel"
                : randomRoom?.thumbnail
            }
            alt="Room Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 text-blue-900">
          {/* Title + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-xl font-semibold">
              {upcomingBooking
                ? "Your Upcoming Stay"
                : "Discover a Top Luxury Room"}
            </h3>

            {upcomingBooking && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-700 border-blue-500 hover:bg-blue-100"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Modify
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleCancel}
                  className="bg-blue-700 text-white hover:bg-blue-800"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Info Row */}
          {upcomingBooking ? (
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{new Date(upcomingBooking.checkInDate).toDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{upcomingBooking.room.roomType}</span>
              </div>
            </div>
          ) : randomRoom ? (
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span className="font-medium">{randomRoom.roomType}</span>
                <span className="font-semibold text-blue-900">
                  ${Number(randomRoom.pricePerNight).toFixed(2)} / night
                </span>
              </div>
              <p className="text-xs text-blue-700 italic">
                Rooms are limited – don’t miss out.
              </p>
            </div>
          ) : (
            <p className="text-blue-800 text-sm">No rooms available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};
