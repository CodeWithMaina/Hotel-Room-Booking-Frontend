// import { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { CalendarIcon } from "lucide-react";
// import { format, isBefore, differenceInCalendarDays } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import "../styles/calendar.css";
// import { toast } from "react-hot-toast";
// import { useNavigate, useParams } from "react-router";
// import { useSelector } from "react-redux";
// import { useCreateBookingMutation, useGetRoomByIdQuery } from "../features/api";
// import { useCreateCheckoutSessionMutation } from "../features/api/stripeApi";
// import { AnimatePresence, motion } from "framer-motion";
// import type { RootState } from "../app/store";
// import type { TBookingForm } from "../types/bookingsTypes";
// import { bookingSchema } from "../validation/bookingValidator";

// const BookingPage = () => {
//   const { register, handleSubmit } = useForm();
//   const { userId } = useSelector((state: RootState) => state.auth);
//   const [createBooking] = useCreateBookingMutation();
//   const [createCheckoutSession] = useCreateCheckoutSessionMutation();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const roomId = Number(id);

//   const [checkInDate, setCheckInDate] = useState<Date | undefined>();
//   const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
//   const [stayDays, setStayDays] = useState(0);
//   const [calendarOpen, setCalendarOpen] = useState<
//     "checkin" | "checkout" | null
//   >(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const checkInCalendarRef = useRef<HTMLDivElement>(null);
//   const checkOutCalendarRef = useRef<HTMLDivElement>(null);

//   const { data: roomBookingInfo } = useGetRoomByIdQuery(roomId);
//   const pricePerNight = Number(roomBookingInfo?.pricePerNight || 0);
//   const totalAmount = stayDays * pricePerNight;

//   const isFormValid =
//     checkInDate &&
//     checkOutDate &&
//     isBefore(checkInDate, checkOutDate) &&
//     stayDays > 0;

//   useEffect(() => {
//     if (checkInDate && checkOutDate && isBefore(checkInDate, checkOutDate)) {
//       const days = differenceInCalendarDays(checkOutDate, checkInDate);
//       setStayDays(days);
//     } else {
//       setStayDays(0);
//     }
//   }, [checkInDate, checkOutDate]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;
//       if (
//         calendarOpen &&
//         !checkInCalendarRef.current?.contains(target) &&
//         !checkOutCalendarRef.current?.contains(target)
//       ) {
//         setCalendarOpen(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [calendarOpen]);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get("cancelled") === "true") {
//       toast.error(
//         "Payment was cancelled. Please try again if you wish to complete your booking."
//       );
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   // Enhanced onSubmit handler
//   const onSubmit = async () => {
//     if (!checkInDate || !checkOutDate) {
//       toast.error("Please select both check-in and check-out dates.");
//       return;
//     }

//     if (!isBefore(checkInDate, checkOutDate)) {
//       toast.error("Check-out date must be after check-in date.");
//       return;
//     }

//     // Ensure roomId is valid
//     if (isNaN(roomId) || roomId <= 0) {
//       toast.error("Invalid room selection. Please try again.");
//       return;
//     }

//     const bookingPayload: TBookingForm = {
//       roomId,
//       userId: Number(userId),
//       checkInDate: checkInDate.toISOString(),
//       checkOutDate: checkOutDate.toISOString(),
//       totalAmount: totalAmount.toFixed(2),
//       bookingStatus: "Pending",
//       gallery: []
//     };

//     // Validate with schema
//     const validation = bookingSchema.safeParse(bookingPayload);
//     if (!validation.success) {
//       toast.error(
//         validation.error.errors[0]?.message || "Invalid booking data."
//       );
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Create booking
//       const bookingResult = await createBooking(bookingPayload).unwrap();
//       if (!bookingResult?.bookingId) {
//         throw new Error("Booking ID not returned");
//       }

//       // Create Stripe session
//       const stripePayload = {
//         roomType: roomBookingInfo?.roomType || "Room",
//         totalAmount,
//         userId: Number(userId),
//         roomId,
//         checkInDate: checkInDate.toISOString().split("T")[0],
//         checkOutDate: checkOutDate.toISOString().split("T")[0],
//         bookingId: bookingResult.bookingId,
//       };

//       const { url } = await createCheckoutSession(stripePayload).unwrap();

//       if (url && typeof url === "string") {
//         window.location.href = url;
//       } else {
//         throw new Error("Invalid redirect URL from Stripe");
//       }
//     } catch (err: unknown) {
//       console.error("Booking/Payment Error:", err);

//       let errorMessage = "Booking process failed. Please try again.";
//       if (err instanceof Error) {
//         errorMessage = err.message;
//       } else if (typeof err === "object" && err !== null && "data" in err) {
//         const errData = (err as { data?: { message?: string; error?: string } })
//           .data;
//         if (errData?.error?.includes("already booked")) {
//           errorMessage =
//             "The room is not available for your selected dates. Please choose different dates.";
//         } else {
//           errorMessage = errData?.message || errorMessage;
//         }
//       }

//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white px-4 py-10 flex justify-center items-center">
//       <div className="w-full max-w-5xl mx-auto bg-white text-gray-800 p-6 sm:p-10 rounded-xl shadow-xl">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
//           {/* Room Details */}
//           <div className="space-y-6 text-center">
//             <img
//               src={roomBookingInfo?.thumbnail}
//               alt="Room"
//               className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
//             />
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 {roomBookingInfo?.roomType}
//               </h2>
//               <p className="text-gray-600">
//                 Capacity: {roomBookingInfo?.capacity} guests
//               </p>
//               <p className="text-gray-600">
//                 Price: ${roomBookingInfo?.pricePerNight} / night
//               </p>
//             </div>
//           </div>

//           {/* Booking Form */}
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-6 relative"
//           >
//             {/* Check-In */}
//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Check-In Date
//               </label>
//               <button
//                 type="button"
//                 onClick={() => setCalendarOpen("checkin")}
//                 className="btn btn-outline w-full justify-start gap-2 text-left border-gray-300"
//               >
//                 <CalendarIcon className="w-5 h-5" />
//                 {checkInDate
//                   ? format(checkInDate, "dd MMM yyyy")
//                   : "Select Check-In"}
//               </button>
//               <AnimatePresence>
//                 {calendarOpen === "checkin" && (
//                   <motion.div
//                     ref={checkInCalendarRef}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute mt-2 z-50 bg-white text-black p-4 rounded-xl shadow-2xl"
//                   >
//                     <DayPicker
//                       mode="single"
//                       selected={checkInDate}
//                       onSelect={setCheckInDate}
//                       disabled={{ before: new Date() }}
//                       modifiersClassNames={{
//                         selected: "bg-blue-500 text-white",
//                       }}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Check-Out */}
//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Check-Out Date
//               </label>
//               <button
//                 type="button"
//                 onClick={() => setCalendarOpen("checkout")}
//                 className="btn btn-outline w-full justify-start gap-2 text-left border-gray-300"
//               >
//                 <CalendarIcon className="w-5 h-5" />
//                 {checkOutDate
//                   ? format(checkOutDate, "dd MMM yyyy")
//                   : "Select Check-Out"}
//               </button>
//               <AnimatePresence>
//                 {calendarOpen === "checkout" && (
//                   <motion.div
//                     ref={checkOutCalendarRef}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute mt-2 z-50 bg-white text-black p-4 rounded-xl shadow-2xl"
//                   >
//                     <DayPicker
//                       mode="single"
//                       selected={checkOutDate}
//                       onSelect={setCheckOutDate}
//                       disabled={{ before: checkInDate || new Date() }}
//                       modifiersClassNames={{
//                         selected: "bg-blue-500 text-white",
//                       }}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div className="text-lg">
//               Total for <span className="font-semibold">{stayDays} nights</span>
//               :{" "}
//               <span className="text-blue-600 font-bold">
//                 ${totalAmount.toFixed(2)}
//               </span>
//             </div>

//             <input type="hidden" {...register("userId")} value={userId ?? ""} />
//             <input
//               type="hidden"
//               {...register("checkInDate")}
//               value={checkInDate ? format(checkInDate, "yyyy-MM-dd") : ""}
//             />
//             <input
//               type="hidden"
//               {...register("checkOutDate")}
//               value={checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : ""}
//             />
//             <input
//               type="hidden"
//               {...register("totalAmount")}
//               value={totalAmount.toFixed(2)}
//             />

//             <div className="flex flex-col gap-4 pt-2">
//               <button
//                 type="submit"
//                 className={`btn text-white w-full ${
//                   isFormValid && !isSubmitting
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-blue-300 cursor-not-allowed opacity-50"
//                 }`}
//                 disabled={!isFormValid || isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
//                         5.291A7.962 7.962 0 014 12H0c0 3.042 
//                         1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   "Continue to Payment"
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="btn bg-gray-100 text-gray-800 hover:bg-gray-200 w-full"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;
