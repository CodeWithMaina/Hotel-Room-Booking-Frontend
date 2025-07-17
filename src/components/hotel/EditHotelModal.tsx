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
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { THotel } from "../../types/hotelsTypes";
import { useImageUploader } from "../../hook/useImageUploader";
import { useUpdateHotelMutation } from "../../features/api";

type EditHotelModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  hotel: THotel;
};

export const EditHotelModal = ({
  isOpen,
  setIsOpen,
  hotel,
}: EditHotelModalProps) => {
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

  useEffect(() => {
    reset({
      ...hotel,
      thumbnail: hotel?.thumbnail || "",
    });
    setPreview(hotel?.thumbnail || null);
  }, [hotel, reset]);

  const onSubmit = async (data: THotel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hotelId, createdAt, updatedAt, ...patch } = data;
    console.log(data);
    try {
      await updateHotel({ hotelId, ...patch }).unwrap();
      toast.success("Hotel updated successfully.");
      setIsOpen(false);
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
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.");
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <form
        method="dialog"
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box bg-[#FFFFFF] p-6 rounded-2xl shadow-xl space-y-6 max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-[#14213D]">Edit Hotel</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-[#03071E] hover:text-[#FCA311] transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {/* Hotel Name */}
          <div>
            <label className="label text-[#14213D] font-medium flex items-center gap-2">
              <Building2 size={16} /> Hotel Name
            </label>
            <input
              {...register("name", { required: "Hotel name is required" })}
              placeholder="e.g. Royal Orchid"
              className="input input-bordered w-full bg-[#E5E5E5] placeholder:text-[#14213D]"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="label text-[#14213D] font-medium flex items-center gap-2">
              <MapPin size={16} /> Location
            </label>
            <input
              {...register("location", { required: "Location is required" })}
              placeholder="e.g. Nairobi, Kenya"
              className="input input-bordered w-full bg-[#E5E5E5] placeholder:text-[#14213D]"
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label text-[#14213D] font-medium flex items-center gap-2">
              <Phone size={16} /> Contact Phone
            </label>
            <input
              {...register("contactPhone", {
                required: "Phone number is required",
              })}
              placeholder="e.g. +254712345678"
              className="input input-bordered w-full bg-[#E5E5E5] placeholder:text-[#14213D]"
            />
            {errors.contactPhone && (
              <p className="text-sm text-red-600">
                {errors.contactPhone.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="label text-[#14213D] font-medium flex items-center gap-2">
              <Tag size={16} /> Category
            </label>
            <input
              {...register("category")}
              placeholder="e.g. Luxury, Budget"
              className="input input-bordered w-full bg-[#E5E5E5] placeholder:text-[#14213D]"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="label text-[#14213D] font-medium flex items-center gap-2">
            <ImagePlus size={16} /> Hotel Image
          </label>
          <div className="flex items-center gap-4">
            <label
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isUploading
                  ? "bg-[#E5E5E5] text-[#999]"
                  : "bg-[#FCA311] text-white hover:opacity-90"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus size={18} />
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
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border border-[#E5E5E5]"
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-[#03071E] text-[#03071E] hover:bg-[#FCA311]/10 transition"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || isUpdating}
            className="px-5 py-2 rounded-lg bg-[#FCA311] text-white hover:bg-[#e59d05] transition disabled:opacity-60"
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </dialog>
  );
};
