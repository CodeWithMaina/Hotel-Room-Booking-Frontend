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
import type { TSingleBooking } from "../../types/bookingsTypes";

export const Bookings = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRoomType, setSelectedRoomType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleDelete = (bookingId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(bookingId)
          .unwrap()
          .then(() => toast.success("Booking deleted successfully."))
          .catch(() =>
            Swal.fire("Error", "Failed to delete booking", "error")
          );
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScrollY.current ? "down" : "up";
      setShowMobileFilter(direction === "up");
      lastScrollY.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#e5e5e5] pb-20">
      {/* Header with Search */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
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

      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out z-30 w-full ${
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
              setSearchQuery("");
            }}
          />
        </div>

        {/* Booking Cards */}
        <section className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-red-600 py-10">
              Failed to load your bookings. Please try again.
            </div>
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
            <div className="text-center text-slate-500 py-20">
              <p className="text-lg">
                You have no bookings matching these filters.
              </p>
            </div>
          )}
        </section>

        {/* Desktop Filter */}
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
              setSearchQuery("");
            }}
          />
        </aside>
      </div>

      {/* Booking Edit Modal */}
      <BookingEditModal show={showEdit} onClose={() => setShowEdit(false)} />
    </div>
  );
};
