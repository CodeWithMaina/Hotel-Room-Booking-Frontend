import React, { useState, useRef } from "react";
import { Calendar, MapPin, Users, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { TopDestinations } from "./TopDestination";

export const Hero: React.FC = () => {
  const [location, setLocation] = useState("Pakistan");
  const [checkIn, setCheckIn] = useState("10 May");
  const [checkOut, setCheckOut] = useState("10 May");
  const [guests, setGuests] = useState("");
  const [payOnCheckin, setPayOnCheckin] = useState(true);

  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        {/* Subtle white tint */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xs" />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Animated Heading */}
          <motion.div
            className="flex-1 text-slate-900"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
              Find the Most <br />
              <span className="text-yellow-600">Luxurious Rooms</span> <br />
              Across the Globe
            </h1>
          </motion.div>

          {/* Animated Booking Card */}
          <motion.div
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-2xl text-slate-900">
              <h2 className="text-2xl font-semibold mb-6">Where you go?</h2>

              <div className="space-y-4">
                {/* Location */}
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 backdrop-blur text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-slate-700/70" />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-sm mb-1 block">Check in</label>
                    <input
                      type="text"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 backdrop-blur text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <Calendar className="absolute right-3 top-9 w-5 h-5 text-slate-700/70" />
                  </div>
                  <div className="relative">
                    <label className="text-sm mb-1 block">Check out</label>
                    <input
                      type="text"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 backdrop-blur text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <Calendar className="absolute right-3 top-9 w-5 h-5 text-slate-700/70" />
                  </div>
                </div>

                {/* Guests */}
                <div className="relative">
                  <label className="text-sm mb-1 block">Guests</label>
                  <input
                    type="text"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="How many guests?"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 backdrop-blur text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <Users className="absolute right-3 top-11 w-5 h-5 text-slate-700/70" />
                </div>

                {/* Pay on check-in */}
                <div className="flex items-center gap-3">
                  <input
                    id="payOnCheckin"
                    type="checkbox"
                    checked={payOnCheckin}
                    onChange={(e) => setPayOnCheckin(e.target.checked)}
                    className="w-5 h-5 text-yellow-500 bg-white/50 border-white/60 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <label htmlFor="payOnCheckin" className="text-sm">
                    Pay when checking in?
                  </label>
                </div>

                {/* Search Button */}
                <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md">
                  <Search className="w-5 h-5" />
                  Search Rooms
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bouncing Arrow at Bottom */}
        <motion.button
          onClick={handleScroll}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-yellow-600 hover:text-yellow-700 transition"
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Scroll Target */}
      <div
        ref={scrollTargetRef}
        className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-6"
      >
        <TopDestinations/>
      </div>
    </>
  );
};
