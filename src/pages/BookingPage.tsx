import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { addDays, format, differenceInCalendarDays } from "date-fns";
import { toast } from "react-hot-toast";
import {
  incrementDays,
  decrementDays,
  setStayDates,
  selectBooking,
} from "../features/slices/bookingSlice";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/calendar.css";
import { useNavigate, useParams } from "react-router";
import { useCreateBookingMutation, useGetRoomByIdQuery } from "../features/api";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { TBookingForm } from "../types/bookingsTypes";
import { bookingSchema } from "../validation/bookingValidator";
import PaymentModal from "../components/payment/PaymentModal";

const BookingPage = () => {
  const dispatch = useAppDispatch();
  const { stayDays, checkInDate, checkOutDate } = useAppSelector(selectBooking);
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { userId } = useSelector((state: RootState) => state.auth);
  const [createBooking] = useCreateBookingMutation();

  const [range, setRange] = useState<{ from: Date; to: Date } | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);

  const { id } = useParams();
  const roomId = Number(id);

  const { data: roomBookingInfo } = useGetRoomByIdQuery(roomId);
  const pricePerNight = parseFloat(roomBookingInfo?.pricePerNight || "0");
  const totalAmount = pricePerNight * stayDays;

  const updateDates = (days: number) => {
    const checkIn = new Date();
    const checkOut = addDays(checkIn, days);
    dispatch(
      setStayDates({
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
      })
    );
  };

  useEffect(() => {
    updateDates(stayDays);
  }, [stayDays]);

  useEffect(() => {
    if (range?.from && range?.to) {
      const days = differenceInCalendarDays(range.to, range.from);
      dispatch(
        setStayDates({
          checkInDate: range.from.toISOString(),
          checkOutDate: range.to.toISOString(),
        })
      );
      dispatch(
        days > 0
          ? { type: "booking/incrementDays", payload: days }
          : { type: "booking/decrementDays" }
      );
    }
  }, [range]);

  const onSubmit = async (data: any) => {
    const formattedPayload: TBookingForm = {
      roomId: Number(roomId),
      userId: Number(userId),
      checkInDate: format(checkInDate, "yyyy-MM-dd"),
      checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
      totalAmount: Number(totalAmount).toFixed(2),
      bookingStatus: "Pending",
    };

    const validation = bookingSchema.safeParse(formattedPayload);
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid data");
      return;
    }

    try {
      const res = await createBooking(formattedPayload).unwrap();
      console.log(res.bookingId);
      toast.success("Booking Successful!");
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
          Booking Information
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please fill in the details below
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Room Preview */}
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop"
              alt={roomBookingInfo?.roomType}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-gray-700">
                {roomBookingInfo?.roomType}
              </h3>
              <p className="text-sm text-gray-500">
                Capacity: {roomBookingInfo?.capacity} people
              </p>
              <p className="text-sm text-gray-500">
                Price per night: ${roomBookingInfo?.pricePerNight}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Stay Duration */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                How long will you stay?
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => dispatch(decrementDays())}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  -
                </button>
                <span className="text-gray-700 font-medium">
                  {stayDays} Days
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(incrementDays())}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Pick a Date
              </label>
              <div
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {format(new Date(checkInDate), "dd MMM")} -{" "}
                  {format(new Date(checkOutDate), "dd MMM")}
                </span>
              </div>
              {showCalendar && (
                <div className="mt-2 bg-white p-4 border rounded shadow w-fit z-10">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={(range) => setRange(range as any)}
                    numberOfMonths={2}
                    className="custom-calendar"
                  />
                </div>
              )}
            </div>

            {/* Price Info */}
            <div className="text-gray-500">
              You will pay{" "}
              <span className="text-blue-600 font-semibold">
                ${totalAmount.toFixed(2)} USD
              </span>{" "}
              for
              <span className="text-gray-700 font-medium">
                {" "}
                {stayDays} Days
              </span>
            </div>

            {/* Hidden Fields */}
            <input
              type="hidden"
              {...register("userId")}
              value={Number(userId)}
            />
            <input
              type="hidden"
              {...register("checkInDate")}
              value={format(checkInDate, "yyyy-MM-dd")}
            />
            <input
              type="hidden"
              {...register("checkOutDate")}
              value={format(checkOutDate, "yyyy-MM-dd")}
            />
            <input
              type="hidden"
              {...register("totalAmount")}
              value={totalAmount.toFixed(2)}
            />

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                onClick={() => {
                  const modal = document.getElementById(
                    "payment_modal"
                  ) as HTMLDialogElement;
                  modal?.showModal();
                }}
                disabled={totalAmount <= 0}
                className={`px-6 py-2 rounded w-full ${
                  totalAmount <= 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Pay Now
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-600 px-6 py-2 rounded w-full"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <PaymentModal
                totalAmount={totalAmount}
                initialPayment={totalAmount / 2}
                bookingSummary={{
                  title: roomBookingInfo?.roomType || "Room",
                  days: stayDays,
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
