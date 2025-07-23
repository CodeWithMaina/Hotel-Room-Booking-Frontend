import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  ImagePlus,
  X,
  Loader2,
  Phone,
  MapPin,
  Building2,
  Tag,
  Upload,
  Check,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useUpdateHotelMutation } from "../../features/api/hotelsApi";
import { useImageUploader } from "../../hook/useImageUploader";

// Mock types and hooks for demonstration
type THotel = {
  hotelId?: string;
  name: string;
  location: string;
  contactPhone: string;
  category?: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
};



type EditHotelModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  hotel: THotel;
};

export default function EditHotelModal({
  isOpen,
  setIsOpen,
  hotel,
}: EditHotelModalProps) {
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<THotel>({
    defaultValues: {
      ...hotel,
      thumbnail: hotel?.thumbnail || "",
    },
  });

  const { upload, isLoading: isUploading } = useImageUploader();
  const [preview, setPreview] = useState<string | null>(
    hotel?.thumbnail || null
  );
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    reset({
      ...hotel,
      thumbnail: hotel?.thumbnail || "",
    });
    setPreview(hotel?.thumbnail || null);
    setUploadSuccess(false);
  }, [hotel, reset]);

  const onSubmit = async (data: THotel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hotelId, createdAt, updatedAt, ...patch } = data;
    console.log(data);
    try {
      const id = hotelId !== undefined ? Number(hotelId) : undefined;
      if (id !== undefined) {
        await updateHotel({ hotelId: id, ...patch }).unwrap();
        toast.success("Hotel updated successfully.");
        setIsOpen(false);
      } else {
        toast.error("Hotel ID is missing.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Something went wrong updating the hotel.");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await upload(file, "hotel");
      if (!result?.secure_url) {
        toast.error("Image upload failed.");
        return;
      }
      setValue("thumbnail", result.secure_url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Edit Hotel</h3>
              <p className="text-blue-100 text-sm mt-1">Update hotel information</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Hotel Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
              <div className="p-1.5 bg-blue-100 rounded-lg group-focus-within:bg-blue-200 transition-colors">
                <Building2 size={14} className="text-blue-600" />
              </div>
              Hotel Name
            </label>
            <input
              {...register("name", { required: "Hotel name is required" })}
              placeholder="e.g. Royal Orchid"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.name.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
              <div className="p-1.5 bg-green-100 rounded-lg group-focus-within:bg-green-200 transition-colors">
                <MapPin size={14} className="text-green-600" />
              </div>
              Location
            </label>
            <input
              {...register("location", { required: "Location is required" })}
              placeholder="e.g. Nairobi, Kenya"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.location.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
              <div className="p-1.5 bg-orange-100 rounded-lg group-focus-within:bg-orange-200 transition-colors">
                <Phone size={14} className="text-orange-600" />
              </div>
              Contact Phone
            </label>
            <input
              {...register("contactPhone", {
                required: "Phone number is required",
              })}
              placeholder="e.g. +254712345678"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                {errors.contactPhone.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm">
              <div className="p-1.5 bg-purple-100 rounded-lg group-focus-within:bg-purple-200 transition-colors">
                <Tag size={14} className="text-purple-600" />
              </div>
              Category
            </label>
            <input
              {...register("category")}
              placeholder="e.g. Luxury, Budget"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
          </div>

          {/* Image Upload */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-3 text-sm">
              <div className="p-1.5 bg-indigo-100 rounded-lg group-focus-within:bg-indigo-200 transition-colors">
                <ImagePlus size={14} className="text-indigo-600" />
              </div>
              Hotel Image
            </label>
            
            <div className="flex items-center gap-4">
              <label
                className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isUploading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : uploadSuccess
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:scale-105"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check size={16} />
                    Uploaded!
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Image
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </label>
              
              {preview && (
                <div className="relative group/preview">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover/preview:shadow-md transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <ImagePlus size={20} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 rounded-b-3xl flex gap-3">
          <button
            type="button"
            className="flex-1 px-4 py-3 text-gray-600 font-medium rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isUploading || isUpdating}
            onClick={handleSubmit(onSubmit)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg disabled:hover:shadow-none"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}