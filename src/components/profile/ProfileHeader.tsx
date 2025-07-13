import React from "react";
import { Star, Edit2, X } from "lucide-react";

interface ProfileHeaderProps {
  profileImage?: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role?: string;
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
  editMode,
  onToggleEdit,
}: ProfileHeaderProps) => {
  return (
    <section className="bg-[#03071E] p-8 rounded-2xl flex flex-col items-center text-white shadow-md space-y-6">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-[#FCA311]/50 shadow-lg"
        />
        {role === "admin" && (
          <div className="absolute -top-2 -right-2 bg-[#FCA311] p-1 rounded-full shadow-md">
            <Star className="w-4 h-4 text-black" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className="text-sm text-[#E5E5E5] italic">
          {bio || "No bio available"}
        </p>
        <p className="text-xs text-gray-400 mt-1">{email}</p>
      </div>

      {/* Edit Button */}
      <div>
        <button
          onClick={onToggleEdit}
          className="px-5 py-2 rounded-xl font-semibold bg-[#FCA311] text-black hover:bg-[#e59d08] flex items-center gap-2 transition"
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
      </div>
    </section>
  );
};
