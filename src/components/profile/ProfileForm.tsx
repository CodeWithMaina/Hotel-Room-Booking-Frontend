import { useFormContext } from "react-hook-form";
import { Check } from "lucide-react";
import type { TUserForm } from "../../types/usersTypes";

interface ProfileFormProps {
  isDirty: boolean;
  onCancel: () => void;
}

export const ProfileForm = ({ isDirty, onCancel }: ProfileFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TUserForm>();

  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm">First Name</label>
        <input
          type="text"
          {...register("firstName", { required: "First name is required" })}
          className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
        />
        {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName.message}</p>}
      </div>
      <div>
        <label className="text-sm">Last Name</label>
        <input
          type="text"
          {...register("lastName", { required: "Last name is required" })}
          className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
        />
        {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName.message}</p>}
      </div>
      <div>
        <label className="text-sm">Bio</label>
        <input
          type="text"
          {...register("bio", { required: "Bio is required" })}
          className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
        />
        {errors.bio && <p className="text-red-400 text-sm">{errors.bio.message}</p>}
      </div>
      <div>
        <label className="text-sm">Phone</label>
        <input
          type="tel"
          {...register("contactPhone")}
          className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
        />
      </div>
      <div>
        <label className="text-sm">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-[#FCA311] text-[#FCA311] hover:bg-[#FCA311]/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#FCA311] text-black font-medium rounded-lg hover:bg-[#e59d08]"
          disabled={!isDirty}
        >
          <Check className="w-4 h-4 inline-block mr-1" /> Save
        </button>
      </div>
    </div>
  );
};
