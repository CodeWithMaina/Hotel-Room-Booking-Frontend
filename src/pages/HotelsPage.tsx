// pages/HotelsPage.tsx
import HotelCard from "../components/hotel/HotelCard";
import NavBar from "../components/NavBar";
import Sections from "../components/Sections";
import { useGetHotelsQuery } from "../features/api";
import type { THotel } from "../types/hotelsTypes";
import { Error } from "./Error";
import { Loading } from "./Loading";

export const HotelsPage = () => {
  const { data: hotelsData, isLoading, error } = useGetHotelsQuery({});
  console.log(hotelsData)
  if (isLoading){
    return <Loading/>;
  }
  if (error){
    return <Error/>;
  }
  if (hotelsData?.length === 0){
    return <span>No hotel found</span>
  }
  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
      <NavBar />
      <Sections title="Featured Hotels" subtitle="Luxury is where your peace is at">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-6 max-w-7xl mx-auto">
            {hotelsData?.map((hotel: THotel) => (
            <HotelCard key={hotel.hotelId} hotel={hotel} />
            ))}
        </div>
      </Sections>
    </div>
  );
};
