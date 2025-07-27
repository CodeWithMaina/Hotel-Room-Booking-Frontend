// EditRoomPage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useImageUploader } from "../../hook/useImageUploader";
import { useGetRoomTypesQuery } from "../../features/api/roomTypeApi";
import { useGetAmenitiesQuery } from "../../features/api/amenitiesApi";
import { useUpdateRoomMutation } from "../../features/api/roomsApi";
import type {
  TAmenitySelect,
  TEditRoomForm,
  TRoomTypeSelect,
} from "../../types/roomsTypes";
import { parseRTKError } from "../../utils/parseRTKError";

interface EditRoomPageProps {
  room: TEditRoomForm;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditRoomPage = ({
  room,
  onCancel,
  onSuccess,
}: EditRoomPageProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<TEditRoomForm>({
    defaultValues: room,
    mode: "onBlur",
  });

  // Fetch room types and amenities
  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useGetRoomTypesQuery();

  const {
    data: amenities,
    isLoading: isAmenitiesLoading,
    isError: isAmenitiesError,
  } = useGetAmenitiesQuery();

  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const { upload, isLoading: isImageLoading } = useImageUploader();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    room.thumbnail
  );
  const [gallery, setGallery] = useState<string[]>(room.gallery || []);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    room.amenities || []
  );

  // Handle data loading and errors
  useEffect(() => {
    if (isRoomTypesError) {
      toast.error("Failed to load room types");
    }
    if (isAmenitiesError) {
      toast.error("Failed to load amenities");
    }
  }, [isRoomTypesError, isAmenitiesError]);

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await upload(file, "room");
      if (result?.secure_url) {
        setValue("thumbnail", result.secure_url);
        toast.success("Thumbnail uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length + gallery.length > 10) {
      toast.error("Maximum 10 gallery images allowed");
      return;
    }

    try {
      for (const file of files) {
        const result = await upload(file, "room-gallery");
        if (result?.secure_url) {
          setGallery((prev) => [...prev, result.secure_url]);
        }
      }
    } catch {
      toast.error("Some images failed to upload");
    }
  };

  const removeGalleryImage = (url: string) => {
    setGallery((prev) => prev.filter((img) => img !== url));
  };

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Reset form when room prop changes
  useEffect(() => {
    reset(room);
    setGallery(room.gallery || []);
    setSelectedAmenities(room.amenities || []);
    setThumbnailPreview(room.thumbnail || null);
  }, [room, reset]);

  const onSubmit = async (data: TEditRoomForm) => {
  if (selectedAmenities.length === 0) {
    toast.error("Please select at least one amenity");
    return;
  }

  try {
    const requestData = {
      roomId: room.roomId,
      roomData: {
        ...data,
        gallery,
        amenities: selectedAmenities,
      }
    };

    console.log(requestData);

    await updateRoom(requestData).unwrap();
    toast.success("Room updated successfully");
    onSuccess();
  } catch (error) {
    const errorMessage = parseRTKError(error, "Failed to update room");
    toast.error(errorMessage);
  }
};

  const isLoading =
    isRoomTypesLoading || isAmenitiesLoading || isUpdating || isImageLoading;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
        <button onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Form fields remain the same as before */}
        {/* Room Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type *
          </label>
          <select
            {...register("roomTypeId", { required: "Room type is required" })}
            className={`select w-full ${
              errors.roomTypeId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isRoomTypesLoading}
          >
            <option value="">Select room type</option>
            {roomTypes?.map((type: TRoomTypeSelect) => (
              <option key={type.roomTypeId} value={type.roomTypeId}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.roomTypeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.roomTypeId.message}
            </p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity *
          </label>
          <input
            type="number"
            {...register("capacity", {
              required: "Capacity is required",
              min: { value: 1, message: "Minimum capacity is 1" },
            })}
            className={`input w-full ${
              errors.capacity ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g. 2"
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.capacity.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Per Night (USD) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("pricePerNight", {
              required: "Price is required",
              min: { value: 0.01, message: "Price must be greater than 0" },
            })}
            className={`input w-full ${
              errors.pricePerNight ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="199.99"
          />
          {errors.pricePerNight && (
            <p className="mt-1 text-sm text-red-600">
              {errors.pricePerNight.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            className="textarea w-full border-gray-300"
            rows={3}
            placeholder="Describe the room features and benefits"
          />
        </div>

        {/* Thumbnail */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="file-input w-full border-gray-300"
            disabled={isImageLoading}
          />
          {thumbnailPreview && (
            <div className="mt-2 relative w-full h-52">
              <img
                src={thumbnailPreview}
                alt="Thumbnail"
                className="rounded w-full h-full object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailPreview(null);
                  setValue("thumbnail", "");
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
          {!thumbnailPreview && !watch("thumbnail") && (
            <p className="mt-1 text-sm text-red-600">Thumbnail is required</p>
          )}
        </div>

        {/* Gallery */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gallery Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="file-input w-full border-gray-300"
            disabled={isImageLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Max 10 images (recommended size: 1200x800)
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {gallery.map((url) => (
              <div
                key={url}
                className="relative h-32 border rounded overflow-hidden group"
              >
                <img
                  src={url}
                  className="w-full h-full object-cover"
                  alt="Gallery"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(url)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amenities *
          </label>
          {isAmenitiesLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin w-4 h-4" />
              Loading amenities...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {amenities?.map((a: TAmenitySelect) => (
                <button
                  key={a.amenityId}
                  type="button"
                  onClick={() => toggleAmenity(a.amenityId)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedAmenities.includes(a.amenityId)
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
          {selectedAmenities.length === 0 && (
            <p className="mt-1 text-sm text-red-600">
              Please select at least one amenity
            </p>
          )}
        </div>

        {/* Availability */}
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            {...register("isAvailable")}
            className="checkbox"
            id="availability-checkbox"
          />
          <label
            htmlFor="availability-checkbox"
            className="text-sm text-gray-700"
          >
            Available for booking
          </label>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                {isImageLoading ? "Uploading images..." : "Saving changes..."}
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
