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

  const {
    data: roomDetails,
    isLoading: isRoomLoading,
    isError: isRoomError,
    refetch,
  } = useGetRoomWithAmenitiesQuery(roomId, {
    skip: !roomId,
    refetchOnMountOrArgChange: true,
  });

  if (isRoomLoading) return <Loading />;
  if (isRoomError || !roomDetails) {
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
        refetch();
        navigate("/admin/hotels");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Delete failed:", error);
      toast.error(
        error?.message || "Failed to delete the room. Please try again."
      );
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
    } catch (error: any) {
      toast.dismiss();
      console.error("Update failed:", error);
      toast.error(
        error?.message || "Failed to update the room. Please check your input."
      );
    }
  };

  
  const amenityIcons: Record<string, React.JSX.Element> = {
    TV: <Tv />,
    "Air Conditioning": <Snowflake />,
    "Mini Bar": <GlassWater />,
    "King Bed": <BedDouble />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#e5e5e5] text-[#03071E] px-6 py-10 lg:px-15">
      <div className="w-full mb-8">
        <ArrowLeft onClick={()=>navigate(-1)}/>
        <img
          src={room.thumbnail || fallBackUrl}
          alt="Room"
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Room Details */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-[#14213D]">
              {room.roomType}
            </h1>
            <div className="flex gap-2">
              <button
                className="btn btn-warning text-black"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="mr-2" size={16} /> Edit
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2" size={16} /> Delete
              </button>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Experience the {room.roomType}, crafted for guests who seek both
            elegance and comfort. Designed with premium furnishings, a cozy
            atmosphere, and everything you need for a perfect stay.
          </p>

          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Capacity:</strong> {room.capacity} Guest(s)
            </p>
            <p>
              <strong>Price Per Night:</strong> ${room.pricePerNight}
            </p>
            <p className="flex items-center gap-2">
              <strong>Status:</strong>
              {room.isAvailable ? (
                <>
                  <CheckCircle size={18} className="text-green-500" /> Available
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-500" /> Unavailable
                </>
              )}
            </p>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-[#14213D] mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 text-sm text-gray-800">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#FCA311]">
                  {amenityIcons[amenity.name] || <Circle />}
                </span>
                <span>{amenity.name}</span>
              </div>
            ))}
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
