import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload, Check } from "lucide-react";
import { type FormData } from "./types";

interface ThumbnailUploadProps {
  onUpload: (file: File, context: "thumbnail") => void;
}

export const ThumbnailUpload = ({ onUpload }: ThumbnailUploadProps) => {
  const { getValues } = useFormContext<FormData>();
  const [isDragging, setIsDragging] = useState(false);
  const thumbnail = getValues("thumbnail");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file, "thumbnail");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, "thumbnail");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Thumbnail</h2>
        <p className="text-gray-600 text-lg">Choose a stunning main image for your room</p>
      </div>

      {!thumbnail ? (
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
        >
          <Upload className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            Drop your image here, or browse
          </h3>
          <p className="text-gray-500 mb-8 text-lg">
            Supports: JPG, PNG, WebP (Max 10MB)
          </p>
          <label className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
            <Upload className="w-5 h-5" />
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="relative group">
            <img
              src={thumbnail}
              alt="Thumbnail Preview"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center">
              <label className="flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl font-medium cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                <Upload className="w-5 h-5" />
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="text-center">
            <p className="text-green-600 font-semibold text-lg flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Thumbnail uploaded successfully
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};