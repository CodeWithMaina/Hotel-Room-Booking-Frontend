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
  AlertCircle,
  Pencil,
  Trash2,
  Plus,
  Filter,
  Building2,
  Users,
  DollarSign,
  CheckCircle2,
  X,
} from "lucide-react";
import { DashboardRoomCard } from "../../components/room/DashboardRoomCard";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import type { TRoom } from "../../types/roomsTypes";
import EditHotelModal from "../../components/hotel/EditHotelModal";

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
  const [showFilters, setShowFilters] = useState(false);

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

  const clearFilters = () => {
    setRoomType("");
    setMinCapacity("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
  };

  const hasActiveFilters = roomType || minCapacity || minPrice || maxPrice || availableOnly;

  const isLoading = isHotelLoading || isRoomsLoading;
  const isError = isHotelError || isRoomsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hotel Not Found
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            We couldn't load the hotel details. Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{hotel.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{hotel.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Landmark size={16} className="text-gray-400" />
                  <span>{hotel.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-current" />
                  <span className="font-medium">{hotel.rating}/5</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Hotel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Hotel
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hotel Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={hotel.thumbnail}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </motion.div>

      {/* Rooms Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="bg-white rounded-2xl shadow-sm border">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Hotel Rooms
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {filteredRooms?.length || 0} rooms
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    hasActiveFilters
                      ? 'border-blue-300 text-blue-700 bg-blue-50'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => navigate(`/admin/create-room/${hotelId}`)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-gray-100 bg-gray-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filter Rooms</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building2 className="w-4 h-4" />
                      Room Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4" />
                      Min Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      Price Range (KSh)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Availability
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer mt-3">
                      <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={() => setAvailableOnly((prev) => !prev)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Available only</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rooms Grid */}
          <div className="p-6">
            {filteredRooms && filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room: TRoom, index: number) => (
                  <motion.div
                    key={room.roomId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <DashboardRoomCard room={room} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-600 mb-6">
                  {hasActiveFilters 
                    ? "No rooms match your current filters. Try adjusting them."
                    : "This hotel doesn't have any rooms yet."
                  }
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/admin/create-room/${hotelId}`)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Room
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Modal Component */}
      <EditHotelModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        hotel={hotel}
      />
    </div>
  );
};