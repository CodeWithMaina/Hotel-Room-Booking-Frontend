import { useState, useMemo } from "react";
import {
  useGetHotelsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
} from "../../features/api/hotelsApi";
import type { THotel } from "../../types/hotelsTypes";
import { Building2, Search, Plus} from "lucide-react";
import { toast } from "sonner";
import { HotelFormModal } from "../../components/hotel/HotelFormModal";
import { Loading } from "../../pages/Loading";
import type { HotelFormData } from "../../validation/hotelFormSchema";
import { DashboardHotelCard } from "../../components/hotel/DashboardHotelCard";

export const Hotels = () => {
  const { data: hotelsData, isLoading, error, refetch } = useGetHotelsQuery();
  const [createHotel] = useCreateHotelMutation();
  const [updateHotel] = useUpdateHotelMutation();
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
            <div key={hotel.hotelId} className="relative">
              <DashboardHotelCard hotel={hotel} />
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
