import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FC } from "react";
import clsx from "clsx";
import type { TEditRoomForm } from "../../types/roomsTypes";
import { useImageUploader } from "../../hook/useImageUploader";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../ui/loadingSpinner";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: TEditRoomForm;
  onSubmit: (data: TEditRoomForm) => void;
}

export const EditRoomModal: FC<EditRoomModalProps> = ({
  isOpen,
  onClose,
  room,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<TEditRoomForm>({
    defaultValues: room,
  });

  const { upload, isLoading: isImageLoading } = useImageUploader();
  const [preview, setPreview] = useState<string | null>(
    room?.thumbnail || null
  );

  useEffect(() => {
    if (room) {
      reset({
        roomType: room.roomType,
        capacity: room.capacity,
        thumbnail: room.thumbnail,
        pricePerNight: room.pricePerNight,
        isAvailable: room.isAvailable,
      });
      setPreview(room.thumbnail);
    }
  }, [room, reset]);

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

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white text-gray-800 border border-gray-200 shadow-xl w-11/12 max-w-2xl">
        <h3 className="font-bold text-xl text-[#14213D] mb-4">
          Edit Room Details
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Room Type</label>
            <input
              type="text"
              {...register("roomType", { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g. Deluxe Suite"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Capacity</label>
            <input
              type="number"
              {...register("capacity", { required: true, valueAsNumber: true })}
              className="input input-bordered w-full"
              placeholder="e.g. 2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Price Per Night (USD)
            </label>
            <input
              type="text"
              {...register("pricePerNight", { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g. 299.99"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded-lg w-full h-48 object-cover border"
              />
            )}
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              {...register("isAvailable")}
              className="checkbox checkbox-primary"
              defaultChecked={room.isAvailable}
            />
            <span className="text-sm">Available for booking</span>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={isSubmitting || isImageLoading}
              className={clsx(
                "btn w-full font-semibold",
                "bg-[#FCA311] text-black hover:bg-[#e69500]",
                { "btn-disabled": isSubmitting }
              )}
            >
              {isImageLoading
                ? <span><LoadingSpinner/>image uploading...</span>
                : isSubmitting
                ? <span><LoadingSpinner/>saving...</span>
                : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="modal-action mt-4">
          <button onClick={onClose} type="button" className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
