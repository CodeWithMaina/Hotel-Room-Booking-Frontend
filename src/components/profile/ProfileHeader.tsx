import { Camera, Star, Edit2, X } from "lucide-react";

interface ProfileHeaderProps {
  profileImage?: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role?: string;
  createdAt?: string;
  editMode: boolean;
  onToggleEdit: () => void;
}

export const ProfileHeader = ({
  profileImage,
  firstName,
  lastName,
  email,
  bio,
  role,
  createdAt,
  editMode,
  onToggleEdit,
}: ProfileHeaderProps) => {
  return (
    <section className="flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div className="relative group">
        <img
          src={profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-[#FCA311]/40"
        />
        <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Camera className="w-5 h-5 text-white" />
        </button>
        {role === "admin" && (
          <div className="absolute -top-2 -right-2 bg-[#FCA311] p-1 rounded-full">
            <Star className="w-4 h-4 text-black" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h1 className="text-2xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className="text-gray-400">{email}</p>
        <p className="text-sm text-gray-500">{bio || "No bio available"}</p>
        <div className="flex flex-wrap gap-4 text-sm text-[#E5E5E5]">
          {createdAt && (
            <span className="flex items-center gap-1">
              Member since {new Date(createdAt).getFullYear()}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onToggleEdit}
        className="px-5 py-2 rounded-xl font-medium bg-[#FCA311] text-black hover:bg-[#e59d08] flex items-center gap-2"
      >
        {editMode ? (
          <>
            <X className="w-4 h-4" /> Cancel
          </>
        ) : (
          <>
            <Edit2 className="w-4 h-4" /> Edit
          </>
        )}
      </button>
    </section>
  );
};
