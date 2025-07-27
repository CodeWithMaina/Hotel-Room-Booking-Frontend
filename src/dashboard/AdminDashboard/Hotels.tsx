import { useState, useMemo } from "react";
import { useGetHotelsQuery } from "../../features/api/hotelsApi";
import type { THotel } from "../../types/hotelsTypes";
import { Building2, Search, Plus } from "lucide-react";
import { Loading } from "../../components/common/Loading";
import { DashboardHotelCard } from "../../components/hotel/DashboardHotelCard";
import { HotelFormContainer } from "../../components/hotel/HotelFormContainer";

export const Hotels = () => {
  const { data: hotelsData, isLoading, error, refetch } = useGetHotelsQuery();
  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<THotel | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const filteredHotels = useMemo(() => {
    if (!hotelsData) return [];
    const lower = search.toLowerCase();
    return hotelsData.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lower) ||
        hotel.location?.toLowerCase().includes(lower)
    );
  }, [hotelsData, search]);

  const openForm = (mode: "create" | "edit", hotel?: THotel) => {
    setFormMode(mode);
    setSelectedHotel(hotel || null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    refetch();
    setIsFormOpen(false);
  };

  if (isLoading) return <Loading />;
  if (error) return <span className="text-red-500 text-center">Error fetching hotels.</span>;
  if (!hotelsData?.length && !isFormOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center h-96">
            <span className="text-gray-500 mb-4">No hotels found.</span>
            <button
              onClick={() => openForm("create")}
              className="btn btn-primary text-white"
            >
              <Plus className="w-4 h-4" /> Add Your First Hotel
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={() => openForm("create")}
              className="btn btn-primary text-white"
            >
              <Plus className="w-4 h-4" /> Add Hotel
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <DashboardHotelCard
              key={hotel.hotelId}
              hotel={hotel}
              onEdit={() => openForm("edit", hotel)}
            />
          ))}
        </section>
      </main>

      {isFormOpen && (
        <HotelFormContainer
          mode={formMode}
          hotelId={formMode === "edit" ? selectedHotel?.hotelId : undefined}
          defaultValues={
            formMode === "edit" && selectedHotel
              ? {
                  name: selectedHotel.name,
                  location: selectedHotel.location ?? "",
                  description: selectedHotel.description ?? "",
                  contactPhone: selectedHotel.contactPhone ?? "",
                  category: selectedHotel.category ?? "",
                  thumbnail: selectedHotel.thumbnail ?? "",
                  amenities: selectedHotel.amenities ?? [],
                  gallery: selectedHotel.gallery ?? [],
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};