import {
  Tv,
  Snowflake,
  GlassWater,
  CheckCircle,
  XCircle,
  BedDouble,
  Circle,
  Pencil,
  Trash2,
  ArrowLeft,
  DollarSign,
  Users,
  Star,
  MapPin,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteRoomMutation,
  useGetRoomWithAmenitiesQuery,
  useUpdateRoomMutation,
} from "../../features/api/roomsApi";
import { Loading } from "../../components/common/Loading";
import { Error } from "../../components/common/Error";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { EditRoomModal } from "../../components/room/EditRoomModal";
import type { TEditRoomForm } from "../../types/roomsTypes";
import { parseRTKError } from "../../utils/parseRTKError";

const fallBackUrl =
  "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop";

const MySwal = withReactContent(Swal);

export const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);

  const {
    data: roomDetails,
    isLoading,
    isError,
    refetch,
  } = useGetRoomWithAmenitiesQuery(roomId, {
    skip: !roomId,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <Loading />;
  if (isError || !roomDetails) {
    toast.error("Failed to load room details.");
    return <Error />;
  }

  const { room, amenities } = roomDetails;

  const handleDelete = async () => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        toast.loading("Deleting room...");
        await deleteRoom(roomId).unwrap();
        toast.dismiss();
        toast.success("Room deleted successfully!");
        navigate("/admin/hotels");
      }
    } catch (error) {
      const errorMessage = parseRTKError(
        error,
        "Action failed. Please try again."
      );
      toast.error(errorMessage);
    }
  };

  const handleEditSubmit = async (data: TEditRoomForm) => {
    try {
      toast.loading("Updating room...");
      await updateRoom({ roomId, ...data }).unwrap();
      toast.dismiss();
      toast.success("Room updated successfully!");
      setIsEditOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = parseRTKError(error, "Update failed.");
      toast.error(errorMessage);
    }
  };

  const amenityIcons: Record<string, React.JSX.Element> = {
    TV: <Tv />,
    "Air Conditioning": <Snowflake />,
    "Mini Bar": <GlassWater />,
    "King Bed": <BedDouble />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#e5e5e5] text-[#03071E]">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Rooms</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Pencil className="w-4 h-4" />
                Edit Room
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Main Image */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Room Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Premium Room Collection</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {room.roomType}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience luxury and comfort in our thoughtfully designed {room.roomType}. 
                Featuring premium amenities and elegant furnishings, this space offers 
                the perfect retreat for discerning guests seeking an exceptional stay.
              </p>
            </div>

            {/* Main Room Image */}
            <div className="relative mb-6">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={room.thumbnail || fallBackUrl}
                  alt={room.roomType}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">Premium</span>
                </div>
              </div>
            </div>

            {/* Room Gallery */}
            {room.gallery && room.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {room.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedGalleryImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${
                        selectedGalleryImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <DollarSign className="w-6 h-6 text-gray-600" />
                    <span className="text-4xl font-bold text-gray-900">{room.pricePerNight}</span>
                    <span className="text-gray-600">/ night</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {room.isAvailable ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700 font-medium">Unavailable</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Capacity</span>
                    </div>
                    <span className="font-semibold text-gray-900">{room.capacity} Guests</span>
                  </div>
                </div>
              </div>

              {/* Amenities Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Amenities</h3>
                <div className="space-y-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <span className="text-blue-600">
                          {amenityIcons[amenity.name] || <Circle className="w-5 h-5" />}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect For</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Business travelers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Weekend getaways
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Special occasions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Extended stays
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>


      <EditRoomModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        room={room}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

// While strictly maintaining the business logic that is currently in place. Redesign the following UI to have a professionally look. Strategically position every component. Remove the gallery image where they are and use it another place. Just the thumbnail should remain where it is. Maintain a white background: 