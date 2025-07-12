import { useState, useMemo } from "react";
import {
  useGetHotelsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} from "../../features/api/hotelsApi";
import type { THotel } from "../../types/hotelsTypes";
import { Building2, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { HotelFormModal } from "../../components/hotel/HotelFormModal";
import { Loading } from "../../pages/Loading";
import type { HotelFormData } from "../../validation/hotelFormSchema";

export const Hotels = () => {
  const { data: hotelsData, isLoading, error, refetch } = useGetHotelsQuery();
  const [createHotel] = useCreateHotelMutation();
  const [updateHotel] = useUpdateHotelMutation();
  const [deleteHotel] = useDeleteHotelMutation();
  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<THotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const filteredHotels = useMemo(() => {
    if (!hotelsData) return [];
    const lower = search.toLowerCase();
    return hotelsData.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lower) ||
        hotel.location?.toLowerCase().includes(lower)
    );
  }, [hotelsData, search]);

  const openModal = (mode: "add" | "edit", hotel?: THotel) => {
    setModalMode(mode);
    setSelectedHotel(hotel || null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // In Hotels.tsx
  const handleDelete = (hotelId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the hotel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteHotel(hotelId).unwrap();
          toast.success("Hotel deleted successfully");
          refetch();
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Failed to delete hotel");
        }
      }
    });
  };

  const handleSubmit = async (formData: HotelFormData): Promise<void> => {
    try {
      const payload = {
        name: formData.name,
        location: formData.location,
        ...(formData.thumbnail && { thumbnail: formData.thumbnail }),
      };

      if (modalMode === "add") {
        await createHotel(payload).unwrap();
        toast.success("Hotel created successfully");
      } else {
        if (!selectedHotel) return;

        await updateHotel({
          hotelId: selectedHotel.hotelId,
          ...payload,
        }).unwrap();
        toast.success("Hotel updated successfully");
      }

      refetch();
      closeModal();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Operation failed. Please try again.");
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <span className="text-red-500 text-center">Error fetching hotels.</span>
    );
  if (!hotelsData?.length)
    return <span className="text-gray-500">No hotel found.</span>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <main className="max-w-7xl mx-auto p-6">
        <section className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" /> Hotel Management
            </h1>
            <p className="text-gray-500 text-sm">
              Administer and manage your hotels
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hotels..."
                className="outline-none w-full bg-transparent text-sm"
              />
            </div>
            <button
              onClick={() => openModal("add")}
              className="btn btn-primary text-white"
            >
              <Plus className="w-4 h-4" /> Add Hotel
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.hotelId}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-[#e5e5e5]"
            >
              {/* Thumbnail */}
              <img
                src={hotel.thumbnail}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />

              {/* Info Section */}
              <div className="p-4 space-y-2">
                {/* Name & Category */}
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-[#000000]">
                    {hotel.name}
                  </h3>
                  <span className="bg-[#fca311] text-white text-xs px-2 py-1 rounded-md">
                    {hotel.category}
                  </span>
                </div>

                {/* Location & Contact */}
                <div className="text-sm text-[#14213d] space-y-1">
                  <p>📍 {hotel.location || "Unknown location"}</p>
                  <p>📞 {hotel.contactPhone || "No contact"}</p>
                </div>

                {/* Rating & Actions */}
                <div className="flex justify-between items-center pt-3">
                  {/* Rating */}
                  {/* <div className="text-sm text-[#03071e] font-medium flex items-center gap-1">
          <span className="bg-[#fca311] text-white px-2 py-1 rounded-full text-xs">
            ⭐ {hotel.rating || "N/A"}
          </span>
        </div> */}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal("edit", hotel)}
                      className="p-2 rounded-md border border-[#3b82f6] text-[#3b82f6] hover:bg-blue-50 transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.hotelId)}
                      className="p-2 rounded-md border border-[#dc2626] text-[#dc2626] hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {isModalOpen && (
        <HotelFormModal
          mode={modalMode}
          defaultValues={
            modalMode === "edit" && selectedHotel
              ? {
                  name: selectedHotel.name,
                  location: selectedHotel.location ?? "",
                  thumbnail:
                    selectedHotel.thumbnail ??
                    "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop",
                }
              : undefined
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
