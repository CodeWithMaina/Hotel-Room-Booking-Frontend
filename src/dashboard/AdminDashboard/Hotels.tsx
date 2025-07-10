import { useState, useMemo } from "react";
import {
  useGetHotelsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} from "../../features/api/hotelsApi";
import { HeaderCard } from "../../components/dashboard/HeaderCard";
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
        ...payload
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
      <HeaderCard />
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
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
            >
              <img
                // src={hotel.thumbnail || "https://via.placeholder.com/300x200"}
                src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {hotel.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {hotel.location || "Unknown location"}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal("edit", hotel)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.hotelId)}
                      className="btn btn-sm btn-outline btn-error"
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
