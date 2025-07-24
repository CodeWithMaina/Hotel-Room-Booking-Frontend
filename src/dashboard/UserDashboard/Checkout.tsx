import { Link, useParams } from "react-router";
import {
  useCreateBookingMutation,
  useGetRoomByIdQuery,
} from "../../features/api";
import { Loader2, Users } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { TRoom } from "../../types/roomsTypes";
import Swal from "sweetalert2";
import { useStripePayment } from "../../hook/useStripePayment";
import type { TBookingForm } from "../../types/bookingsTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { parseRTKError } from "../../utils/parseRTKError";

export const Checkout = () => {
  const { id } = useParams();
  const roomId = Number(id);
  const { initiatePayment, isLoading: isPaymentLoading } = useStripePayment();
  const [createBooking] = useCreateBookingMutation();
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    data: room,
    isLoading,
    isError,
  } = useGetRoomByIdQuery(roomId) as {
    data: TRoom | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const nights = useMemo(() => {
    if (checkInDate && checkOutDate) {
      const diff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [checkInDate, checkOutDate]);

  const totalPrice = useMemo(() => {
    return nights * (room?.pricePerNight ?? 0);
  }, [nights, room]);

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    if (!room) {
      toast.error("Room data unavailable. Please refresh.");
      return;
    }

    const bookingPayload: TBookingForm = {
      roomId,
      userId: Number(userId),
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      totalAmount: totalPrice.toFixed(2),
      bookingStatus: "Pending",
      gallery: [],
    };

    const toastId = toast.loading("Booking your stay...");

    try {
      const bookingResponse = await createBooking(bookingPayload).unwrap();
      const bookingId = Number(bookingResponse?.bookingId);

      if (!bookingId || isNaN(bookingId)) {
        throw new Error("Invalid booking ID received");
      }

      toast.loading("Redirecting to payment...", { id: toastId });

      const paymentUrl = await initiatePayment(bookingId, totalPrice);
      if (!paymentUrl) throw new Error("Failed to obtain payment URL");

      window.location.href = paymentUrl;
    } catch (err) {
      toast.dismiss(toastId);

      const errorMsg = parseRTKError(err, "Failed to create booking.");

      if (
        errorMsg.toLowerCase().includes("already booked") ||
        errorMsg.toLowerCase().includes("date conflict") ||
        errorMsg.toLowerCase().includes("unavailable")
      ) {
        Swal.fire({
          icon: "warning",
          title: "Room Already Booked",
          text: "The room is already booked for the selected dates. Please try different dates.",
        });
      } else {
        toast.error(errorMsg);
        console.error("Booking Error:", err);
      }
    }
  };
  // ✅ Return early if room ID is invalid
  if (!id || isNaN(roomId)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No room selected for checkout.
        </h2>
        <p className="text-gray-500 mb-6">
          Please choose a room before proceeding to checkout.
        </p>
        <Link
          to="/rooms"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition-all font-semibold"
        >
          Browse Rooms
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        Failed to load room details. Please try again later.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-md my-10"
    >
      {/* Left: Room Overview */}
      <div>
        <img
          src={room.thumbnail}
          alt={room.roomType}
          className="w-full h-64 object-cover rounded-xl"
        />
        <h2 className="text-2xl font-bold mt-4">{room.roomType}</h2>
        <p className="text-gray-500 text-sm mt-1">
          Capacity: <Users className="inline w-4 h-4" /> {room.capacity} guests
        </p>
        <p className="text-lg text-amber-600 font-semibold mt-2">
          ${room.pricePerNight} / night
        </p>
        <div className="flex gap-2 mt-4 overflow-auto">
          {room.gallery.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`gallery-${idx}`}
              className="w-20 h-20 object-cover rounded-md border"
            />
          ))}
        </div>
      </div>

      {/* Right: Booking Form */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Select Your Stay
        </h3>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Check-In Date</label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={new Date()}
            placeholderText="Select check-in"
            className="w-full px-4 py-2 border rounded-md shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Check-Out Date</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate || new Date()}
            placeholderText="Select check-out"
            className="w-full px-4 py-2 border rounded-md shadow-sm"
          />
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-gray-600">
            Number of Nights: <span className="font-semibold">{nights}</span>
          </p>
          <p className="text-gray-600">
            Total Price:{" "}
            <span className="font-bold text-green-600">
              ${totalPrice.toFixed(2)}
            </span>
          </p>
        </div>
        <button
          onClick={handleBooking}
          disabled={isPaymentLoading}
          className={`mt-6 bg-primary hover:bg-primary/80 text-white py-3 rounded-xl transition-all font-semibold ${
            isPaymentLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isPaymentLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </motion.div>
  );
};
