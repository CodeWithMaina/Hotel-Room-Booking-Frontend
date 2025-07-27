import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload, Plus, X } from "lucide-react";
import { type FormData } from "./types";

interface GalleryUploadProps {
  onUpload: (file: File, context: "gallery") => void;
}

export const GalleryUpload = ({ onUpload }: GalleryUploadProps) => {
  const { getValues, setValue } = useFormContext<FormData>();
  const gallery = getValues("gallery");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        onUpload(file, "gallery");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => onUpload(file, "gallery"));
    }
  };

  const removeImage = (index: number) => {
    setValue(
      "gallery",
      gallery.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Gallery Images</h2>
        <p className="text-gray-600 text-lg">Add more photos to showcase your room</p>
      </div>

      <motion.div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
      >
        <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Add Gallery Images</h3>
        <p className="text-gray-500 mb-6">Multiple images allowed - drag & drop or browse</p>
        <label className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg">
          <Upload className="w-5 h-5" />
          Choose Files
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </motion.div>

      {gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gallery Images ({gallery.length})
            </h3>
            <p className="text-gray-600">Click the × button to remove any image</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((url, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={url}
                  alt={`Gallery Image ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <motion.button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};