import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Home, Star, Camera, ImageIcon, Check } from "lucide-react";
import { type FormData } from "./types";

interface ReviewSubmitProps {
  roomTypes: {
    roomTypeId: number;
    name: string;
  }[];
  amenities: {
    amenityId: number;
    name: string;
  }[];
}

export const ReviewSubmit = ({ roomTypes, amenities }: ReviewSubmitProps) => {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  const getRoomTypeName = (id: number) => {
    return roomTypes.find((type) => type.roomTypeId === id)?.name || id.toString();
  };

  const getAmenityName = (id: number) => {
    return amenities.find((amenity) => amenity.amenityId === id)?.name || id.toString();
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Your Room</h2>
        <p className="text-gray-600 text-lg">
          Double-check everything looks perfect before submitting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Details */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Room Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Room Type:</span>
              <span className="text-gray-900 font-semibold">
                {getRoomTypeName(values.roomTypeId)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Price Per Night:</span>
              <span className="text-green-600 font-bold">${values.pricePerNight}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Capacity:</span>
              <span className="text-gray-900 font-semibold">{values.capacity} guests</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Description:</span>
              <span className="text-gray-900 font-semibold">
                {values.description || "No description provided"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Available:</span>
              <span
                className={`font-semibold ${
                  values.isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {values.isAvailable ? "✓ Yes" : "✗ No"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Amenities */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Selected Amenities ({values.amenities.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {values.amenities.length > 0 ? (
              values.amenities.map((amenityId, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg"
                >
                  <Star className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {getAmenityName(Number(amenityId))}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic p-3 bg-white rounded-lg">
                No amenities selected
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Images Preview */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Thumbnail */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Thumbnail Image
          </h3>
          <div className="relative">
            <img
              src={values.thumbnail}
              alt="Room Thumbnail"
              className="w-full max-w-md mx-auto h-64 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
              Main Image
            </div>
          </div>
        </div>

        {/* Gallery */}
        {values.gallery.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Gallery Images ({values.gallery.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.gallery.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-semibold text-lg">
            Ready to Create Room
          </span>
        </div>
        <p className="text-blue-700">
          All information has been reviewed and is ready for submission.
        </p>
      </motion.div>
    </div>
  );
};