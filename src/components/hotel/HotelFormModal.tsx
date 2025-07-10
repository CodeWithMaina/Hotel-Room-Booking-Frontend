import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  hotelFormSchema,
  type HotelFormData,
} from "../../validation/hotelFormSchema";
import { Hotel, MapPin, Save, XCircle, UploadCloud, X } from "lucide-react";
import Cropper from "react-easy-crop";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { dataURLtoFile } from "../../utils/imageUploadUtils";
import { useImageUploader } from "../../hook/useImageUploader";

interface Props {
  mode: "add" | "edit";
  defaultValues?: Partial<HotelFormData>;
  onClose: () => void;
  onSubmit: (values: HotelFormData) => Promise<void>;
}

type Area = { width: number; height: number; x: number; y: number };

function getCroppedImg(imageSrc: string, crop: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = () => reject("Image load failed");
  });
}

export const HotelFormModal = ({
  mode,
  defaultValues,
  onClose,
  onSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      location: defaultValues?.location ?? "",
      thumbnail: defaultValues?.thumbnail ?? "",
    },
  });

  const { upload } = useImageUploader();

  const fallbackUrl = "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [previewUrl, setPreviewUrl] = useState<string>(
    defaultValues?.thumbnail || fallbackUrl
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    reset(defaultValues);
    setPreviewUrl(defaultValues?.thumbnail || fallbackUrl);
  }, [defaultValues, reset]);

  const onCropComplete = useCallback((_: unknown, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempImage(reader.result);
        setIsCropping(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const finishCropping = async () => {
    if (tempImage && croppedAreaPixels) {
      try {
        const cropped = await getCroppedImg(tempImage, croppedAreaPixels);
        const croppedFile = dataURLtoFile(cropped, "thumbnail.jpeg");

        toast.loading("Uploading image...", { id: "upload-toast" });

        const uploaded = await upload(croppedFile, "hotel");

        if (!uploaded) {
          toast.error("Upload failed: No data received", {
            id: "upload-toast",
          });
          return;
        }
        if (!uploaded?.secure_url) {
          toast.error("Upload failed: Missing image URL", {
            id: "upload-toast",
          });
          return;
        }
        toast.success("Image uploaded!", { id: "upload-toast" });

        setValue("thumbnail", uploaded.secure_url);
        setPreviewUrl(uploaded.secure_url);
        setIsCropping(false);
      } catch (error) {
        console.error("Cropping/upload error:", error);
        toast.error("Image upload failed", { id: "upload-toast" });
      }
    }
  };

  const removeImage = () => {
    setPreviewUrl(fallbackUrl);
    setValue("thumbnail", "");
  };

  const submitHandler = async (data: HotelFormData) => {
    console.log(data)
    await onSubmit(data);
  };

  return (
    <dialog id="hotel_modal" className="modal modal-open">
      <div className="modal-box w-full max-w-2xl bg-white rounded-xl p-6 animate-fade-in-up overflow-visible">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          {mode === "add" ? "Add New Hotel" : "Edit Hotel"}
        </h2>

        {/* Image Cropper or Preview */}
        <div className="mb-4">
          {isCropping && tempImage ? (
            <div className="relative h-64 bg-black rounded-xl overflow-hidden">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={3 / 2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <div className="absolute bottom-2 right-2 z-10 flex gap-2">
                <button
                  onClick={finishCropping}
                  className="btn btn-primary btn-sm"
                >
                  Crop & Upload
                </button>
                <button
                  onClick={() => setIsCropping(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="relative border border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Dropzone onDrop={handleImageDrop} accept={{ "image/*": [] }}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="cursor-pointer text-gray-500 hover:text-blue-600"
                  >
                    <input {...getInputProps()} />
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover object-center rounded mb-2"
                    />
                    <div className="flex justify-center items-center gap-2 text-sm">
                      <UploadCloud className="w-4 h-4" />
                      <span>Drag and drop or click to upload image</span>
                    </div>
                  </div>
                )}
              </Dropzone>
              {previewUrl !== fallbackUrl && (
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* Hotel Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Hotel Name
            </label>
            <div className="relative">
              <Hotel className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
              <input
                {...register("name")}
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                placeholder="Enter hotel name"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
              <input
                {...register("location")}
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                placeholder="Enter location"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Thumbnail (hidden) */}
          <input type="hidden" {...register("thumbnail")} />

          {/* Actions */}
          <div className="modal-action flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-error flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                ? "Add Hotel"
                : "Update Hotel"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
