// components/common/ImageCarousel.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://media.istockphoto.com/id/1418701619/photo/hotel-sign-on-building-facade-in-city-business-travel-and-tourism.jpg?s=612x612&w=0&k=20&c=W9UcZTYo3f8fTaiU_4xqfVSBOQRna-Pm-Prw3k54kyM=",
  "https://media.istockphoto.com/id/487042276/photo/hotel-sign.jpg?s=612x612&w=0&k=20&c=DjEVAoFnjB2cWwX28cxSKWkxsbze7o9jgkYrhyfmq9E=",
  "https://media.istockphoto.com/id/487042276/photo/hotel-sign.jpg?s=612x612&w=0&k=20&c=DjEVAoFnjB2cWwX28cxSKWkxsbze7o9jgkYrhyfmq9E=",
];

export const ImageCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          alt="Hotel Hero"
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold-400 tracking-widest uppercase drop-shadow-md"
        >
          Hotels
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-slate-200 font-light max-w-2xl">
          Discover a hand-picked selection of luxurious stays tailored to your peace.
        </p>
      </div>
    </div>
  );
};
