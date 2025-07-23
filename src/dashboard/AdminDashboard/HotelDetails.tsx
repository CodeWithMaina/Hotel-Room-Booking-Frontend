import { useNavigate, useParams } from "react-router";
import {
  useGetHotelByIdQuery,
  useGetRoomByHotelIdQuery,
} from "../../features/api";
import {
  Landmark,
  MapPin,
  Phone,
  Star,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { DashboardRoomCard } from "../../components/room/DashboardRoomCard";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import type { TRoom } from "../../types/roomsTypes";
import { EditHotelModal } from "../../components/hotel/EditHotelModal";

export const HotelDetails = () => {
  const { id } = useParams();
  const hotelId = Number(id);

  const {
    data: hotel,
    isError: isHotelError,
    isLoading: isHotelLoading,
    refetch: hotelRefetch,
  } = useGetHotelByIdQuery(hotelId);

  const {
    data: rooms,
    isError: isRoomsError,
    isLoading: isRoomsLoading,
    refetch: roomRefetch,
  } = useGetRoomByHotelIdQuery(hotelId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    roomRefetch();
  }, []);

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Hotel?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      hotelRefetch();
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "The hotel has been removed.", "success");
      }
    });
  };

  const filteredRooms = rooms?.filter((room: TRoom) => {
    const matchesType = roomType ? room.roomType === roomType : true;
    const matchesCapacity = minCapacity
      ? room.capacity >= Number(minCapacity)
      : true;
    const matchesPrice =
      (!minPrice || room.pricePerNight >= Number(minPrice)) &&
      (!maxPrice || room.pricePerNight <= Number(maxPrice));
    const matchesAvailability = availableOnly ? room.isAvailable : true;

    return (
      matchesType && matchesCapacity && matchesPrice && matchesAvailability
    );
  });

  const isLoading = isHotelLoading || isRoomsLoading;
  const isError = isHotelError || isRoomsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FCA311] animate-spin" />
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-xl font-semibold text-gray-800">
          Oops! Unable to load hotel details.
        </p>
        <p className="text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 text-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[450px]"
      >
        <img
          src={hotel.thumbnail}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03071E]/80 to-transparent" />
        <div className="absolute bottom-10 left-10 z-10 text-white space-y-3">
          <h1 className="text-4xl font-extrabold drop-shadow-md">
            {hotel.name}
          </h1>

          <div className="flex items-center gap-3 text-sm text-slate-100">
            <MapPin size={18} />
            <span>{hotel.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-100">
            <Phone size={18} />
            <span>{hotel.contactPhone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-100">
            <Landmark size={18} />
            <span>{hotel.category}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#FCA311] font-semibold">
            <Star size={18} />
            <span>{hotel.rating} / 5</span>
          </div>
        </div>
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="btn btn-warning text-white shadow-lg"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Hotel
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-error text-white shadow-lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Hotel
          </button>
        </div>
      </motion.div>

      {/* Rooms Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="px-6 md:px-12 py-12 bg-white rounded-t-3xl -mt-16 relative z-20 shadow-xl"
      >
        {/* Header + Filters */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-3xl font-semibold text-[#14213D]">
              Available Rooms
            </h2>
            <button
              onClick={() => navigate(`/admin/create-room/${hotelId}`)}
              className="btn btn-primary shadow-md bg-[#FCA311] text-white hover:bg-[#e18d0a]"
            >
              + Create Room
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="form-control">
              <label className="label text-sm text-gray-600">Room Type</label>
              <select
                className="select select-bordered w-full"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label text-sm text-gray-600">
                Min Capacity
              </label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label text-sm text-gray-600">
                Min Price (Ksh)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label text-sm text-gray-600">
                Max Price (Ksh)
              </label>
              <input
                type="number"
                placeholder="e.g. 20000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={availableOnly}
                onChange={() => setAvailableOnly((prev) => !prev)}
              />
              <span className="label-text text-sm text-gray-700">
                Available only
              </span>
            </div>
          </div>
        </div>

        {filteredRooms && filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room: TRoom) => (
              <DashboardRoomCard key={room.roomId} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-lg">
            No rooms match current filters.
          </div>
        )}
      </motion.section>

      {/* Edit Modal Component */}
      <EditHotelModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        hotel={hotel}
      />
    </div>
  );
};
