import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BookingCard } from "../../components/booking/BookingCard";
import { BookingCardSkeleton } from "../../components/booking/BookingCardSkeleton";
import { BookingEditModal } from "../../components/booking/BookingEditModal";
import { BookingFilterSidebar } from "../../components/booking/BookingFilterSidebar";
import {
  useDeleteBookingMutation,
  useGetBookingsQuery,
} from "../../features/api";
import type { RootState } from "../../app/store";
import type { TSingleBooking } from "../../types/bookingsTypes";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export const Booking = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRoomType, setSelectedRoomType] = useState("All");
  const [showMobileFilter, setShowMobileFilter] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
  
  const lastScrollY = useRef(0);

  const { userType } = useSelector((state: RootState) => state.auth);

  const {
    data: allBookings,
    isLoading,
    isError,
  } = useGetBookingsQuery(undefined, { skip: userType !== "admin" });

  console.log(allBookings)

  const [deleteBooking] = useDeleteBookingMutation();

  const bookings: TSingleBooking[] = useMemo(() => {
    return Array.isArray(allBookings) ? allBookings : [];
  }, [allBookings]);

  const roomTypes = useMemo(() => {
    const types = new Set<string>();
    bookings.forEach((b) => {
      if (b?.room?.roomType) types.add(b.room.roomType);
    });
    return Array.from(types);
  }, [bookings]);

  const filteredBookings = bookings.filter(
    (booking: TSingleBooking) => {
      const matchStatus =
        filterStatus === "All" || booking.bookingStatus === filterStatus;
      const matchRoom =
        selectedRoomType === "All" ||
        booking.room?.roomType === selectedRoomType;

      const matchSearch =
        searchQuery.trim() === "" ||
        booking.room?.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.checkInDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.checkOutDate.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchRoom && matchSearch;
    }
  );


  const handleDelete = (bookingId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4ED8",
      cancelButtonColor: "#6B7280",
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScrollY.current ? "down" : "up";
      setShowMobileFilter(direction !== "down");
      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 sm:p-6">
        {/* Header with Search */}
      <div className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#000000] mb-1">
              Your Bookings
            </h1>
            <p className="text-[#14213d] text-sm">
              View, edit or manage your hotel bookings
            </p>
          </div>
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search by room type, status, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[#d1d5db] bg-[#ffffff] text-[#03071e] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#fca311] transition duration-200"
            />
          </div>
        </div>
      </div>
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Mobile Filter */}
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
              <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>
              <p className="text-sm text-gray-500">
                Overview of all reservations
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
                {filteredBookings.map((booking) => (
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

          {/* Desktop Sidebar */}
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
