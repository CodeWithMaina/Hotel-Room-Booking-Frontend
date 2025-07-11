import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TopDestinations = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
  const interval = setInterval(() => {
    const container = scrollContainerRef.current;
    if (!container || isHovered) return;

    const scrollAmount = 200;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, 3000);

  return () => clearInterval(interval);
}, [isHovered]);


  const cities = [
    {
      name: "Maldives",
      image:
        "https://images.unsplash.com/photo-1576669809488-efd1f951f6a4?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Santorini",
      image:
        "https://images.unsplash.com/photo-1506023914709-837ff59e39b5?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Swiss Alps",
      image:
        "https://images.unsplash.com/photo-1616699001726-98ff5c7311cf?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Dubai",
      image:
        "https://images.unsplash.com/photo-1619188746076-56d50795f993?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Bali",
      image:
        "https://images.unsplash.com/photo-1600334129128-00a8bb3e3d75?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Paris",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-7xl"
      >
        {/* Header */}
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
          Explore <span className="text-yellow-600">Top Destinations</span>
        </h2>
        <p className="text-lg text-slate-700 mb-12 max-w-2xl mx-auto">
          Discover stunning cities where elegance, comfort, and world-class rooms await.
        </p>

        {/* Scrollable Destination Cards */}
        <motion.div
          ref={scrollContainerRef}
          className="flex lg:grid overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 lg:grid-cols-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {cities.map((city, index) => (
            <motion.div
              key={index}
              className="min-w-[180px] sm:min-w-[200px] lg:min-w-0 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 cursor-pointer snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-28 sm:h-32 object-cover"
              />
              <div className="py-3 text-center text-slate-800 font-semibold text-sm sm:text-base">
                {city.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
