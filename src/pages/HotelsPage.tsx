// pages/HotelsPage.tsx
import HotelCard from "../components/hotel/HotelCard";
import NavBar from "../components/NavBar";
import Sections from "../components/Sections";
import { useGetHotelsQuery } from "../features/api";
import type { THotel } from "../types/hotelsTypes";

export const HotelsPage = () => {
  const { data: hotelsData, isLoading, error } = useGetHotelsQuery({});
  console.log(hotelsData)

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
      <NavBar />
      <Sections title="Featured Hotels" subtitle="Luxury is where your peace is at">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-6 max-w-7xl mx-auto">
          {isLoading && <p>Loading hotels...</p>}
          {error && <p>Error loading hotels.</p>}
          {hotelsData?.length === 0 && <p>No hotels found.</p>}
            {hotelsData?.map((hotel: THotel) => (
            <HotelCard key={hotel.hotelId} hotel={hotel} />
            ))}
        </div>
      </Sections>
    </div>
  );
};
