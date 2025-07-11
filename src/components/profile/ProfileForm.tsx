import { useForm } from "react-hook-form";
import { Check, Mail, Phone, User } from "lucide-react";
import type { TUserForm } from "../../types/usersTypes";

type Props = {
  defaultValues: TUserForm;
  onSubmit: (data: TUserForm) => void;
};

export const ProfileForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserForm>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-2xl shadow border border-slate-200">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" /> First Name
          </label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" /> Last Name
          </label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" /> Phone Number
          </label>
          <input
            type="tel"
            {...register("contactPhone", { required: "Phone number is required" })}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 ${
              errors.contactPhone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contactPhone && <p className="mt-1 text-sm text-red-500">{errors.contactPhone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" /> Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
        >
          <Check className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </form>
  );
};