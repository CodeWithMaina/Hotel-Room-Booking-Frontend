import { useState } from "react";
import { Mail, Phone, Pencil } from "lucide-react";
import type { TUser } from "../../types/usersTypes";
import { UserDetailsModal } from "./UserDetailsModal";
import { UserEditModal } from "./UserEditModal";

interface Props {
  user: TUser;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleCardClick = () => setShowDetails(true);

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent opening modal when clicking edit
    setShowEdit(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white hover:shadow-lg transition-shadow border border-[#E5E5E5] rounded-xl p-4 flex flex-col items-center text-[#03071E] cursor-pointer"
      >
        <img
          src={user.profileImage || "/placeholder.jpg"}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-20 h-20 rounded-full object-cover border-4 border-[#14213D] mb-4"
        />

        <h3 className="text-lg font-semibold text-[#14213D] text-center">
          {user.firstName} {user.lastName}
        </h3>

        <p className="text-sm text-[#000000] italic text-center mb-2">
          {user.bio || "No bio available."}
        </p>

        <div className="mt-2 space-y-1 text-sm w-full text-left">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#FCA311]" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#FCA311]" />
            <span>{user.contactPhone}</span>
          </div>
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="flex-grow" />

        <div className="w-full mt-auto pt-4">
          <button
            onClick={handleEditClick}
            className="w-full bg-[#14213D] text-white rounded-full py-2 flex items-center justify-center gap-2 hover:opacity-90 transition"
            title="Edit User"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
      </div>

      {showDetails && (
        <UserDetailsModal user={user} onClose={() => setShowDetails(false)} />
      )}

      {showEdit && (
        <UserEditModal user={user} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
};
