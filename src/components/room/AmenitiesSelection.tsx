import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { type FormData } from "./types";

interface AmenitiesSelectionProps {
  amenities: {
    amenityId: number;
    name: string;
    description: string | null;
    icon: string | null;
  }[];
}

export const AmenitiesSelection = ({ amenities }: AmenitiesSelectionProps) => {
  const { watch, setValue } = useFormContext<FormData>();
  const selected = watch("amenities");

  const toggleAmenity = (value: string) => {
    if (selected.includes(value)) {
      setValue("amenities", selected.filter((v) => v !== value));
    } else {
      setValue("amenities", [...selected, value]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Select Amenities</h2>
        <p className="text-gray-600 text-lg">Choose the features available in this room</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map(({ name, icon }, index) => {
          const isSelected = selected.includes(name);

          return (
            <motion.button
              type="button"
              key={name}
              onClick={() => toggleAmenity(name)}
              className={`relative flex items-center gap-4 p-6 border-2 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {icon ? (
                  <span className="text-lg">{icon}</span>
                ) : (
                  <Check className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                {/* {description && (
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                )} */}
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <p className="text-blue-800 font-medium text-center">
            ✓ Selected {selected.length} amenities:{" "}
            {selected.join(", ")}
          </p>
        </motion.div>
      )}
    </div>
  );
};