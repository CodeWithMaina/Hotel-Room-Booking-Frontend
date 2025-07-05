import { Search } from "lucide-react";
import { Button } from "../Button";
import { useNavigate } from "react-router";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100/90 to-slate-200/80"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 drop-shadow-lg leading-tight">
          Discover Luxury & Comfort
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">
          Escape to elegance at our premium hotels. Enjoy world-class amenities,
          breathtaking views, and unforgettable experiences.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button onClick={()=> navigate('/hotels')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-xl shadow-lg">
            Book Now
          </Button>
          <Button
          onClick={()=> navigate('/rooms')}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white px-6 py-3 text-lg rounded-xl shadow-sm"
          >
            <Search className="mr-2 h-5 w-5" />
            Browse Rooms
          </Button>
        </div>
      </div>
    </section>
  );
};
