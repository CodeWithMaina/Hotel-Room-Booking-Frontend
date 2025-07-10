import { useEffect, useMemo, useRef, useState } from "react";
import { BookingCard } from "../../components/booking/BookingCard";
import { BookingEditModal } from "../../components/booking/BookingEditModal";
import { BookingCardSkeleton } from "../../components/booking/BookingCardSkeleton";
import { BookingFilterSidebar } from "../../components/booking/BookingFilterSidebar";
import {
  useDeleteBookingMutation,
  useGetBookingByUserIdQuery,
} from "../../features/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { HeaderCard } from "../../components/dashboard/HeaderCard";
import type { TSingleBooking } from "../../types/bookingsTypes";



export const Bookings = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRoomType, setSelectedRoomType] = useState("All");

  const [showMobileFilter, setShowMobileFilter] = useState(true);
  const lastScrollY = useRef(0);
  const [deleteBooking] = useDeleteBookingMutation();

  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: userBookings = [],
    isLoading,
    isError,
  } = useGetBookingByUserIdQuery(id);


  // SweetAlert-based delete
  const handleDelete = (bookingId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete your booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4ED8", // Tailwind blue-700
      cancelButtonColor: "#6B7280", // Tailwind gray-500
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "swal2-confirm btn btn-error",
        cancelButton: "swal2-cancel btn btn-outline",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(bookingId)
          .unwrap()
          .then(() => {
            toast.success("Booking deleted successfully.");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to delete booking", "error");
          });
      }
    });
  };

  const roomTypes = useMemo(() => {
    const types = new Set(
      userBookings.map((b: { room: { roomType: string } }) => b.room?.roomType)
    );
    return Array.from(types).filter(Boolean) as string[];
  }, [userBookings]);

  const filteredBookings = userBookings.filter(
    (booking: { bookingStatus: string; room: { roomType: string } }) => {
      const matchesStatus =
        filterStatus === "All" || booking.bookingStatus === filterStatus;
      const matchesRoom =
        selectedRoomType === "All" ||
        booking.room?.roomType === selectedRoomType;
      return matchesStatus && matchesRoom;
    }
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScrollY.current ? "down" : "up";
      if (direction === "down") setShowMobileFilter(false);
      else setShowMobileFilter(true);
      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <HeaderCard/>

      <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Mobile Filter - Top Bar */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out z-30 ${
              showMobileFilter
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full"
            }`}
          >
            <BookingFilterSidebar
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              availableRoomTypes={roomTypes}
              onClear={() => {
                setFilterStatus("All");
                setSelectedRoomType("All");
              }}
            />
          </div>

          {/* Main Booking Section */}
          <section className="flex-1">
            <div className="mb-6 mt-2 lg:mt-0">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Bookings
              </h2>
              <p className="text-sm text-gray-500">
                Manage your reservations with ease
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BookingCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <p className="text-red-500">Error fetching bookings.</p>
            ) : filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredBookings.map((booking: TSingleBooking) => (
                  <BookingCard
                    key={booking.bookingId}
                    bookingId={booking.bookingId}
                    bookingStatus={booking.bookingStatus}
                    checkInDate={booking.checkInDate}
                    checkOutDate={booking.checkOutDate}
                    totalAmount={booking.totalAmount}
                    room={booking.room}
                    onEdit={() => setShowEdit(true)}
                    onDelete={() => handleDelete(booking.bookingId!)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No bookings found.
              </p>
            )}
          </section>

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-full lg:w-72">
            <BookingFilterSidebar
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              availableRoomTypes={roomTypes}
              onClear={() => {
                setFilterStatus("All");
                setSelectedRoomType("All");
              }}
            />
          </aside>
        </div>

        {/* Modals */}
        <BookingEditModal show={showEdit} onClose={() => setShowEdit(false)} />
      </main>
    </div>
  );
};
