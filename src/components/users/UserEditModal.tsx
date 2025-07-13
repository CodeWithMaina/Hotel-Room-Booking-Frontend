import { XCircle, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import type { TUser } from "../../types/usersTypes";
import { useUpdateUserMutation } from "../../features/api";
import {
  userFormSchema,
  type TUserForm,
} from "../../validation/userFormSchema";

interface Props {
  user: TUser;
  onClose: () => void;
}

export const UserEditModal: React.FC<Props> = ({ user, onClose }) => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactPhone: user.contactPhone,
      bio: user.bio || "",
    },
  });

  const onSubmit = async (data: TUserForm) => {
    try {
      await updateUser({ userId: id, ...data }).unwrap();
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl px-6 py-6 rounded-2xl shadow-2xl border border-[#E5E5E5] bg-white text-[#03071E] animate-fade-in-out">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-[#14213D]">
            <Pencil className="w-6 h-6 text-[#FCA311]" />
            Edit User
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Image Display */}
        <div className="flex justify-center mb-6">
          <img
            src={user.profileImage || "/placeholder.jpg"}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-24 h-24 rounded-full border-4 border-[#14213D] object-cover shadow"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("firstName")}
                className="input input-bordered w-full"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("lastName")}
                className="input input-bordered w-full"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              className="input input-bordered w-full"
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contact Phone */}
          <div>
            <input
              {...register("contactPhone")}
              className="input input-bordered w-full"
              placeholder="Phone Number"
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactPhone.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <textarea
              {...register("bio")}
              className="textarea textarea-bordered w-full"
              placeholder="Bio"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="modal-action sticky bottom-0 bg-white pt-4 border-t border-[#E5E5E5] flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#14213D] text-white hover:bg-[#0f1b33]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
