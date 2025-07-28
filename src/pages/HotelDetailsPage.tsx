import {
  Wifi,
  Bath,
  Dumbbell,
  Utensils,
  Sparkles,
  ParkingCircle,
  MapPin,
  Phone,
  Star,
  Camera,
  ChevronLeft,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { JSX } from "react";
import { Loading } from "../components/common/Loading";
import type { TRoom } from "../types/roomsTypes";
import { RoomCard } from "../components/room/RoomCard";
import Navbar from "../components/common/NavBar";
import { SimilarHotelsSidebar } from "../components/hotel/SimilarHotelsSidebar";
import { useState } from "react";
import { useGetRoomByHotelIdQuery } from "../features/api/roomsApi";
import { useGetHotelFullDetailsQuery } from "../features/api/hotelsApi";
import { useNavigate, useParams } from "react-router";

const amenityIcons: Record<string, JSX.Element> = {
  wifi: <Wifi className="w-5 h-5 text-emerald-600" />,
  pool: <Bath className="w-5 h-5 text-blue-600" />,
  fitness_center: <Dumbbell className="w-5 h-5 text-orange-600" />,
  restaurant: <Utensils className="w-5 h-5 text-red-600" />,
  spa: <Sparkles className="w-5 h-5 text-purple-600" />,
  local_parking: <ParkingCircle className="w-5 h-5 text-slate-600" />,
};

export const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const hotelId = Number(id);
  const [selectedImage, setSelectedImage] = useState(0);

  const navigate = useNavigate();

  const {
    data: hotelDetails,
    isLoading: isLoadingHotelDetails,
    isError: isErrorHotelDetails,
  } = useGetHotelFullDetailsQuery(hotelId);

  const {
    data: hotelRoomsData,
    isLoading: isLoadingHotelRoomsData,
    isError: isErrorHotelRoomsData,
  } = useGetRoomByHotelIdQuery(hotelId);

  if (isLoadingHotelDetails || isLoadingHotelRoomsData) return <Loading />;

  if (
    isErrorHotelDetails ||
    !hotelDetails ||
    isErrorHotelRoomsData ||
    !hotelRoomsData
  ) {
    toast.error("Failed to load hotel details");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 text-red-500">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We couldn't load the hotel details. Please try refreshing the page
            or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { hotel, address, amenities } = hotelDetails;
  const allImages = [
    hotel.thumbnail,
    ...(Array.isArray(hotel.gallery) ? hotel.gallery : []),
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Image Gallery */}
      <div className="relative bg-white">
        {/* Main Image Display */}
        <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <img
            src={allImages[selectedImage]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Image Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev > 0 ? prev - 1 : allImages.length - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev < allImages.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all shadow-lg rotate-180"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <Camera className="w-4 h-4 inline mr-2" />
            {selectedImage + 1} of {allImages.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex gap-2 justify-center max-w-md mx-auto overflow-x-auto">
              {allImages.slice(0, 6).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-white shadow-lg scale-110"
                      : "border-white/50 hover:border-white/80"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {allImages.length > 6 && (
                <div className="flex-shrink-0 w-16 h-12 rounded-lg bg-black/50 border-2 border-white/50 flex items-center justify-center text-white text-xs font-medium">
                  +{allImages.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Hotel Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hotel Information Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {/* Hotel Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    {hotel.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(hotel.rating ?? 0)}
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      {hotel.rating}
                    </span>
                    <span className="text-gray-500 text-sm">(324 reviews)</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {hotel.name}
                </h1>

                {/* Contact Information */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">
                        {address?.street ?? ""},
                        {address?.city ?? ""},
                        {address?.state ?? ""},
                        {address?.country ?? ""}
                        {address?.postalCode ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-gray-700">
                    <Phone className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-gray-600">{hotel.contactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Gallery Section */}
              {Array.isArray(hotel.gallery) && hotel.gallery.length > 0 && (
                <div className="border-t border-gray-100 pt-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Hotel Gallery
                    </h2>
                    <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {hotel.gallery.length} photos
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hotel.gallery.map((imgUrl: string, index: number) => (
                      <div
                        key={index}
                        className="group cursor-pointer"
                        onClick={() => {
                          setSelectedImage(index + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <ImageWithSkeleton src={imgUrl} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities Section */}
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Hotel Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.amenityId}
                      className="group flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        {typeof amenity.icon === "string" &&
                        amenity.icon &&
                        amenityIcons[amenity.icon] ? (
                          amenityIcons[amenity.icon]
                        ) : (
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">
                          {amenity.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {amenity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rooms Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Available Rooms
                </h2>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {Array.isArray(hotelRoomsData) ? hotelRoomsData.length : 0}{" "}
                  room{hotelRoomsData?.length !== 1 ? "s" : ""} available
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.isArray(hotelRoomsData) &&
                  hotelRoomsData.map((room: TRoom) => (
                    <div
                      key={room.roomId}
                      className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 bg-white"
                    >
                      <RoomCard
                        room={{
                          ...room,
                          pricePerNight: Number(room.pricePerNight),
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/hotel/${hotel.hotelId}/rooms`)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              </div>

              {/* Similar Hotels Sidebar */}
              <SimilarHotelsSidebar currentHotelId={hotelId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Lazy Loading Image With Skeleton and Hover Effects
const ImageWithSkeleton = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group cursor-pointer">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <Camera className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt="Gallery"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {loaded && !error && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <Camera className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
