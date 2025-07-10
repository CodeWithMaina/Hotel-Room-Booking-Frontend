import {
  XCircle,
  UserPlus,
  Mail,
  Phone,
  User,
  BadgePlus,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userFormSchema,
  type TUserForm,
} from "../../validation/userFormSchema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: TUserForm) => void;
}

export const AddUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactPhone: "",
      role: "user",
    },
  });

  const onSubmit = (data: TUserForm) => {
    onSave(data);
    toast.success("User added!");
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <motion.div
        className="modal-box max-w-lg bg-gradient-to-br from-white to-slate-100 rounded-2xl shadow-xl border border-blue-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Add New User
          </h3>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <User className="text-blue-500 w-4 h-4" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className="w-full bg-transparent outline-none text-blue-800 placeholder:text-slate-400"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <User className="text-blue-500 w-4 h-4" />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
                className="w-full bg-transparent outline-none text-blue-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <Mail className="text-blue-500 w-4 h-4" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent outline-none text-blue-800 placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <Phone className="text-green-600 w-4 h-4" />
              <input
                {...register("contactPhone")}
                type="text"
                placeholder="Phone Number"
                className="w-full bg-transparent outline-none text-blue-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <BadgePlus className="text-purple-600 w-4 h-4" />
              <select
                {...register("role")}
                className="w-full bg-transparent outline-none text-blue-800"
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
            >
              Save User
            </button>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
};
