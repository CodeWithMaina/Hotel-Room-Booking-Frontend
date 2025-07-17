import { useParams, useNavigate } from "react-router";
import { useGetBookingByIdQuery } from "../../features/api";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const navigate = useNavigate();

  const {
    data: booking,
    isLoading,
    isError,
  } = useGetBookingByIdQuery(bookingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffffff] to-[#e5e5e5]">
        <Loader2 className="h-10 w-10 text-[#14213D] animate-spin" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffffff] to-[#e5e5e5]">
        <div className="flex flex-col items-center text-red-600">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-lg font-semibold">Failed to load booking details.</p>
        </div>
      </div>
    );
  }

  const {
    bookingId: idNum,
    checkInDate,
    checkOutDate,
    bookingStatus,
    totalAmount,
    user,
    room,
  } = booking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#e5e5e5] p-6 md:p-12">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-[#14213D] hover:text-[#FCA311] font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>

      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#14213D] text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Booking #{idNum}</h2>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              bookingStatus === "Confirmed"
                ? "bg-[#FCA311] text-[#14213D]"
                : "bg-gray-300"
            }`}
          >
            {bookingStatus}
          </span>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6 text-[#03071E]">
          {/* Guest Info */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#FCA311]">Guest Info</h3>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.contactPhone}
            </p>
          </motion.div>

          {/* Room Info */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#FCA311]">Room Details</h3>
            <p>
              <strong>Type:</strong> {room.roomType}
            </p>
            <p>
              <strong>Capacity:</strong> {room.capacity} guests
            </p>
            <p>
              <strong>Price/Night:</strong> ${room.pricePerNight}
            </p>
          </motion.div>

          {/* Stay Info */}
          <motion.div
            className="space-y-3 col-span-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-[#FCA311]">Stay Duration</h3>
            <p>
              <strong>Check-in:</strong> {new Date(checkInDate).toDateString()}
            </p>
            <p>
              <strong>Check-out:</strong> {new Date(checkOutDate).toDateString()}
            </p>
            <p>
              <strong>Total Amount:</strong>{" "}
              <span className="text-green-700 font-bold">${totalAmount}</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
