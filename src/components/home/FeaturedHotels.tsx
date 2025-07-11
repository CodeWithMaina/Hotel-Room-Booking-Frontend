import React, { useState } from "react";
import { MapPin, Heart, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Room {
  id: number;
  roomType: string;
  location: string;
  pricePerNight: number;
  originalPrice?: number;
  thumbnail: string;
  description: string;
  capacity: string;
  isAvailable: boolean;
}

const rooms: Room[] = [
  {
    id: 1,
    roomType: "Ocean View Villa",
    location: "Maldives",
    pricePerNight: 450,
    originalPrice: 620,
    thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    description: "Overwater villas with stunning ocean views and private decks.",
    capacity: "2-4 guests",
    isAvailable: true,
  },
  {
    id: 2,
    roomType: "Alpine Suite",
    location: "Swiss Alps",
    pricePerNight: 320,
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    description: "Cozy alpine retreat with snowy views and fireplaces.",
    capacity: "2 guests",
    isAvailable: true,
  },
  {
    id: 3,
    roomType: "Sunset Terrace Room",
    location: "Santorini, Greece",
    pricePerNight: 380,
    originalPrice: 485,
    thumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
    description: "White-washed terraces with breathtaking sunset views.",
    capacity: "2 guests",
    isAvailable: false,
  },
];

export const FeaturedRooms: React.FC = () => {
  const [favoriteRooms, setFavoriteRooms] = useState<Set<number>>(new Set());

  const toggleFavorite = (roomId: number) => {
    const newFavorites = new Set(favoriteRooms);
    if (newFavorites.has(roomId)) {
      newFavorites.delete(roomId);
    } else {
      newFavorites.add(roomId);
    }
    setFavoriteRooms(newFavorites);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Featured <span className="text-blue-600">Rooms</span>
          </h2>
          <p className="text-lg text-gray-600">
            Explore compact luxury options designed to impress.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.thumbnail}
                  alt={room.roomType}
                  className="w-full h-full object-cover"
                />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(room.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${
                    favoriteRooms.has(room.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/30 text-white hover:bg-white/50"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${favoriteRooms.has(room.id) ? "fill-current" : ""}`}
                  />
                </button>

                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-white/80 px-2 py-1 rounded-md text-sm font-semibold text-gray-800">
                  ${room.pricePerNight}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {room.roomType}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {room.location}
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {room.capacity}
                  </div>
                  <button
                    disabled={!room.isAvailable}
                    className={`text-sm px-3 py-1 rounded-md font-medium flex items-center gap-1 ${
                      room.isAvailable
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {room.isAvailable ? "Book" : "Unavailable"}
                    {room.isAvailable && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
