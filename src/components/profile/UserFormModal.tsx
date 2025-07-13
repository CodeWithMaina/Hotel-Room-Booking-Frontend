// UserFormModal.tsx
import React, { useEffect, useState } from "react";
import { User, FileText, X, SendHorizontal, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useImageUploader } from "../../hook/useImageUploader";
import toast from "react-hot-toast";

export type TUserFormValues = {
  firstName: string;
  lastName: string;
  bio: string;
  profileImage?: string;
};

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TUserFormValues) => void;
  defaultValues: TUserFormValues;
}

export const UserFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TUserFormValues>();

  const { upload, isLoading: isUploading } = useImageUploader();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const profileImage = watch("profileImage");

  useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues);
      setPreviewImage(defaultValues.profileImage || null);
    }
  }, [isOpen, defaultValues, reset]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      const result = await upload(file, "userProfile");
      if(!result) {
        toast.error("Uploading failed")
      }
      setValue("profileImage", result?.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFormSubmit = (data: TUserFormValues) => {
    onSubmit(data);
    reset(defaultValues);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-[#e5e5e5] text-black w-full max-w-lg rounded-2xl shadow-2xl p-8 relative border border-[#FCA311]"
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-[#03071E] tracking-wide">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="form-control">
                <label className="label text-[#14213D] font-medium">
                  <span className="flex items-center gap-2">
                    <ImageIcon size={18} /> Profile Image
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FCA311]">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : profileImage ? (
                        <img src={profileImage} alt="Current profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <ImageIcon size={24} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full max-w-xs bg-white text-black border border-[#FCA311] focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    disabled={isUploading}
                  />
                </div>
                {isUploading && <p className="text-sm mt-2 text-[#FCA311]">Uploading image...</p>}
              </div>

              {/* Rest of the form fields remain the same */}
              {/* First Name */}
              <div className="form-control">
                <label className="label text-[#14213D] font-medium">
                  <span className="flex items-center gap-2">
                    <User size={18} /> First Name
                  </span>
                </label>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="form-control">
                <label className="label text-[#14213D] font-medium">
                  <span className="flex items-center gap-2">
                    <User size={18} /> Last Name
                  </span>
                </label>
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label text-[#14213D] font-medium">
                  <span className="flex items-center gap-2">
                    <FileText size={18} /> Bio
                  </span>
                </label>
                <textarea
                  {...register("bio", { required: "Bio is required" })}
                  className="textarea textarea-bordered w-full bg-white text-black border border-[#FCA311] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="btn bg-[#FCA311] text-black hover:bg-[#e59400] border-none shadow-md flex items-center gap-2 px-6"
                  disabled={isUploading}
                >
                  <SendHorizontal size={18} /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};