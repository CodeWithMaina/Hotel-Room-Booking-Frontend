import { useGetHotelsQuery } from "../../features/api/hotelsApi";
import { Loading } from "../../pages/Loading";
import type { THotel } from "../../types/hotelsTypes";
import HotelCard from "../hotel/HotelCard";
import NavBar from "../NavBar";
import Sections from "../Sections";
import { AlertCircle } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";

export const FeaturedHotels = () => {
  const { data: featuredHotels, isLoading, error } = useGetHotelsQuery({});

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
      <NavBar />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-700 px-4">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-lg font-semibold">Something went wrong while fetching hotels.</p>
          <span className="text-gray-500 text-sm">Please try again later.</span>
        </div>
      ) : featuredHotels?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-700 px-4">
          <p className="text-2xl font-semibold text-blue-600">No hotels found</p>
          <span className="text-gray-500">We're adding more hotels soon. Stay tuned!</span>
        </div>
      ) : (
        <Sections
          title="Featured Hotels"
          subtitle="Luxury is where your peace is at"
        >
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-6 max-w-7xl mx-auto">
              {featuredHotels?.map((hotel: THotel) => (
                <HotelCard key={hotel.hotelId} hotel={hotel} />
              ))}
            </div>
          </FadeIn>
        </Sections>
      )}
    </div>
  );
};
